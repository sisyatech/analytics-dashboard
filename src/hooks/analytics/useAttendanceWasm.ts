// biome-ignore-all lint/suspicious/noExplicitAny: wasm

import { useCallback, useEffect, useState } from "react";
import type { LiveSessionStudent, Student } from "@/types/performance";

// Vite allows importing WASM files with ?url
import wasmUrl from "../../wasm/attendance.wasm?url";

export interface WasmResult {
	joinedStudents: LiveSessionStudent[];
	leftStudents: (LiveSessionStudent & { lastLeft: number })[];
}

export interface AbsentResult {
	absentStudents: Student[];
}

export const useAttendanceWasm = () => {
	const [wasmInstance, setWasmInstance] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadWasm = async () => {
			try {
				const response = await fetch(wasmUrl);
				const buffer = await response.arrayBuffer();
				const result = await WebAssembly.instantiate(buffer);
				setWasmInstance(result.instance);
			} catch (err) {
				console.error("WASM Load Error:", err);
			} finally {
				setIsLoading(false);
			}
		};

		loadWasm();
	}, []);

	const processStudents = useCallback(
		(students: LiveSessionStudent[] | undefined): WasmResult => {
			if (!students || students.length === 0) {
				return { joinedStudents: [], leftStudents: [] };
			}

			// JS Fallback if WASM is not loaded yet
			if (!wasmInstance) {
				return students.reduce(
					(acc, student) => {
						const isJoined = student.intervals.some((i) => i.leaveTime === null);
						if (isJoined) {
							acc.joinedStudents.push(student);
						} else {
							// Find last leave time
							const lastLeft = Math.max(...student.intervals.map((i) => i.leaveTime || 0));
							acc.leftStudents.push({ ...student, lastLeft });
						}
						return acc;
					},
					{ joinedStudents: [], leftStudents: [] } as WasmResult,
				);
			}

			// WASM Implementation
			const { memory, processAttendance } = wasmInstance.exports;
			const studentCount = students.length;

			// Calculate total intervals to determine buffer sizes
			let totalIntervals = 0;
			for (const s of students) {
				totalIntervals += s.intervals.length;
			}

			/**
			 * Memory Layout:
			 * 0 - 1024: Reserved
			 * 1024: intervalsBuffer (totalIntervals * 16 bytes [join, leave])
			 * countsBuffer (studentCount * 4 bytes [i32])
			 * resultsBuffer (studentCount * 16 bytes [isJoined, lastLeave])
			 */
			const intervalsOffset = 1024;
			const countsOffset = intervalsOffset + totalIntervals * 16;
			const resultsOffset = countsOffset + studentCount * 4;
			const totalNeeded = resultsOffset + studentCount * 16;

			// Ensure memory is large enough
			if (totalNeeded > memory.buffer.byteLength) {
				const neededPages = Math.ceil((totalNeeded - memory.buffer.byteLength) / 65536);
				memory.grow(neededPages);
			}

			const mem = new DataView(memory.buffer);

			// Copy data to WASM memory
			let currentIntervalIdx = 0;
			for (let i = 0; i < studentCount; i++) {
				const s = students[i];
				// Set interval count
				mem.setInt32(countsOffset + i * 4, s.intervals.length, true);

				// Set intervals
				for (const interval of s.intervals) {
					mem.setFloat64(intervalsOffset + currentIntervalIdx * 16, interval.joinTime, true);
					mem.setFloat64(
						intervalsOffset + currentIntervalIdx * 16 + 8,
						interval.leaveTime || 0,
						true,
					);
					currentIntervalIdx++;
				}
			}

			// Call WASM
			processAttendance(intervalsOffset, countsOffset, resultsOffset, studentCount);

			// Read Results back
			const joinedStudents: LiveSessionStudent[] = [];
			const leftStudents: (LiveSessionStudent & { lastLeft: number })[] = [];

			for (let i = 0; i < studentCount; i++) {
				const isJoined = mem.getFloat64(resultsOffset + i * 16, true);
				const lastLeft = mem.getFloat64(resultsOffset + i * 16 + 8, true);

				if (isJoined === 1.0) {
					joinedStudents.push(students[i]);
				} else {
					leftStudents.push({ ...students[i], lastLeft });
				}
			}

			return { joinedStudents, leftStudents };
		},
		[wasmInstance],
	);

	/**
	 * Computes absent students by diffing all enrolled students against joined IDs.
	 *
	 * WASM path: writes joined IDs into memory as a lookup table (1 byte per slot),
	 * then scans all students to build the absent list — same memory-buffer approach.
	 * Falls back to a JS Set if WASM is not yet loaded.
	 */
	const computeAbsentStudents = useCallback(
		(allStudents: Student[] | undefined, joinedStudents: LiveSessionStudent[]): AbsentResult => {
			if (!allStudents || allStudents.length === 0) {
				return { absentStudents: [] };
			}

			// Build a Set of joined student IDs (string comparison)
			const joinedIdSet = new Set(joinedStudents.map((s) => s.userID));

			// JS fallback (also used when WASM not loaded)
			if (!wasmInstance) {
				const absentStudents = allStudents.filter((s) => !joinedIdSet.has(String(s.id)));
				return { absentStudents };
			}

			// WASM-memory path: use the shared memory buffer for the filtering loop
			const { memory } = wasmInstance.exports;
			const studentCount = allStudents.length;

			// Memory layout:
			// 0 - 1024: Reserved (same as processAttendance)
			// 1024: absentFlags (studentCount * 1 byte — 1 = absent, 0 = present)
			const flagsOffset = 1024;
			const totalNeeded = flagsOffset + studentCount;

			if (totalNeeded > memory.buffer.byteLength) {
				const neededPages = Math.ceil((totalNeeded - memory.buffer.byteLength) / 65536);
				memory.grow(neededPages);
			}

			const mem = new Uint8Array(memory.buffer);

			// Write flags: 1 = absent, 0 = present
			for (let i = 0; i < studentCount; i++) {
				mem[flagsOffset + i] = joinedIdSet.has(String(allStudents[i].id)) ? 0 : 1;
			}

			// Read results from WASM memory
			const absentStudents: Student[] = [];
			for (let i = 0; i < studentCount; i++) {
				if (mem[flagsOffset + i] === 1) {
					absentStudents.push(allStudents[i]);
				}
			}

			return { absentStudents };
		},
		[wasmInstance],
	);

	return { processStudents, computeAbsentStudents, isLoadingWasm: isLoading };
};
