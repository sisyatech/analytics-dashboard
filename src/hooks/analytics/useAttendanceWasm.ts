// biome-ignore-all lint/suspicious/noExplicitAny: wasm

import { useCallback, useEffect, useState } from "react";
import type { LiveSessionStudent } from "@/types/performance";

// Vite allows importing WASM files with ?url
import wasmUrl from "../../wasm/attendance.wasm?url";

export interface WasmResult {
	joinedStudents: LiveSessionStudent[];
	leftStudents: (LiveSessionStudent & { lastLeft: number })[];
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

	return { processStudents, isLoadingWasm: isLoading };
};
