/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * src/wasm/attendance/processAttendance
 * @param intervalsPtr `usize`
 * @param countsPtr `usize`
 * @param resultsPtr `usize`
 * @param studentCount `i32`
 */
export declare function processAttendance(
	intervalsPtr: number,
	countsPtr: number,
	resultsPtr: number,
	studentCount: number,
): void;
