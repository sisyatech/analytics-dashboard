/// <reference types="assemblyscript/std/assembly" />

/**
 * Efficiently processes student attendance intervals.
 *
 * @param intervalsPtr Pointer to a Float64Array of [join, leave, join, leave, ...]
 * @param countsPtr Pointer to an Int32Array of [intervalCountStudent1, intervalCountStudent2, ...]
 * @param resultsPtr Pointer to a Float64Array for output [isJoined, lastLeave, ...]
 * @param studentCount Total number of students to process
 */
export function processAttendance(
	intervalsPtr: usize,
	countsPtr: usize,
	resultsPtr: usize,
	studentCount: i32,
): void {
	let intervalIdx = 0;

	for (let s = 0; s < studentCount; s++) {
		const numIntervals = load<i32>(countsPtr + s * 4);

		let isJoined = 0.0;
		let lastLeave = 0.0;

		for (let i = 0; i < numIntervals; i++) {
			// joinTime is at offset (intervalIdx * 16)
			// leaveTime is at offset (intervalIdx * 16 + 8)
			const leaveTime = load<f64>(intervalsPtr + intervalIdx * 16 + 8);

			if (leaveTime <= 0.0) {
				// null or 0 means currently joined
				isJoined = 1.0;
			} else if (leaveTime > lastLeave) {
				lastLeave = leaveTime;
			}

			intervalIdx++;
		}

		// Results are stored as [isJoined, lastLeave] per student (16 bytes total)
		store<f64>(resultsPtr + s * 16, isJoined);
		store<f64>(resultsPtr + s * 16 + 8, lastLeave);
	}
}
