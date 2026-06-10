import {
	IconArrowLeft,
	IconChevronDown,
	IconChevronUp,
	IconDatabase,
	IconRefresh,
	IconReload,
	IconReport,
	IconSearch,
	IconSortAscending,
	IconSortDescending,
	IconTrendingUp,
	IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { AttendanceEngineSheet } from "@/api/attendanceEngine";
import { SpreadsheetView } from "@/components/admin/AttendanceEngine/SpreadsheetView";
import { Button } from "@/components/ui/button";
import { useAttendanceEngineReport, useSyncAttendance } from "@/hooks/admin/useAttendanceEngine";
import { cn } from "@/lib/utils";

const PROGRAMS = [
	{
		id: "topper",
		name: "Topper Program",
		courseIds: [446, 447, 448, 450, 451, 453, 454, 456, 457, 458],
		isActive: true,
	},
	{
		id: "mathchamp",
		name: "Math Champ",
		courseIds: [435, 436, 437, 438, 439, 440, 441, 442, 443, 444],
		isActive: true,
	},
	{ id: "jee", name: "JEE Foundation Elite Batch", courseIds: [460], isActive: true },
	{
		id: "summercamp",
		name: "Summer Camp",
		courseIds: [302, 303, 304, 305, 306, 307, 308, 309, 310, 311],
		isActive: false,
	},
];

export default function AttendanceEnginePage() {
	const [selectedProgram, setSelectedProgram] = useState<(typeof PROGRAMS)[0] | null>(null);
	const [activeCourseId, setActiveCourseId] = useState<string>("");
	const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
	const [isGradeInsightsOpen, setIsGradeInsightsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [sessionOrder, setSessionOrder] = useState<"newest" | "oldest">(() => {
		const saved = localStorage.getItem("ae_session_order");
		return (saved as "newest" | "oldest") || "oldest";
	});

	const { data, isLoading, isError, refetch } = useAttendanceEngineReport(
		selectedProgram ? selectedProgram.courseIds : [],
	);
	const syncMutation = useSyncAttendance();

	// Calculate matches for navigation
	const matches = useMemo(() => {
		if (!searchQuery || !data?.sheets) return [];
		const activeSheet = data.sheets.find((s) => s.courseId.toString() === activeCourseId);
		if (!activeSheet) return [];

		const results: { studentId: number; type: "name" | "phone" }[] = [];
		activeSheet.students.forEach((student) => {
			if (student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push({ studentId: student.id, type: "name" });
			}
			if (student.phone.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push({ studentId: student.id, type: "phone" });
			}
		});
		return results;
	}, [searchQuery, data, activeCourseId]);

	useEffect(() => {
		if (matches.length > 0) {
			setCurrentMatchIndex(0);
		} else {
			setCurrentMatchIndex(-1);
		}
	}, [matches.length]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "f") {
				e.preventDefault();
				setIsSearchVisible(true);
				setTimeout(() => searchInputRef.current?.focus(), 50);
			}
			if (e.key === "Escape") {
				setIsGradeInsightsOpen(false);
				setIsSearchVisible(false);
				setSearchQuery("");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		localStorage.setItem("ae_session_order", sessionOrder);
	}, [sessionOrder]);

	const handleSyncAll = async () => {
		if (!selectedProgram) return;
		try {
			await Promise.all(
				selectedProgram.courseIds.map((id) => syncMutation.mutateAsync({ courseId: id })),
			);
			setLastSync(new Date().toLocaleTimeString());
			refetch();
		} catch (error) {
			console.error("Sync failed", error);
		}
	};

	const handleNextMatch = () => {
		if (matches.length === 0) return;
		setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
	};

	const handlePrevMatch = () => {
		if (matches.length === 0) return;
		setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
	};

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center bg-white flex-col gap-4">
				<div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
				<div className="flex flex-col items-center">
					<p className="text-emerald-800 font-bold text-xl animate-pulse">
						Initializing Attendance Engine
					</p>
					<p className="text-neutral-400 text-sm">
						Crunching data for {selectedProgram?.courseIds.length || 0} grades...
					</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<p className="text-rose-500 font-bold">Failed to load spreadsheet.</p>
				<Button onClick={() => refetch()} variant="outline">
					<IconReload className="w-4 h-4 mr-2" /> Retry
				</Button>
			</div>
		);
	}

	const sheets = data?.sheets || [];
	const activeSheet = sheets.find((s) => s.courseId.toString() === activeCourseId);

	if (!selectedProgram) {
		return (
			<div className="h-[calc(100vh-2rem)] flex flex-col items-start justify-start bg-[#f8f9fa] -m-4 md:-m-8 p-6 md:p-8 overflow-auto">
				<div className="max-w-4xl w-full space-y-8 mt-0">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
							<IconDatabase className="w-7 h-7 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
								Attendance Engine
							</h1>
							<p className="text-neutral-500 mt-1 font-medium">
								Select a program to view its records
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						{PROGRAMS.map((program) => (
							<button
								key={program.id}
								type="button"
								onClick={() => {
									setSelectedProgram(program);
									setActiveCourseId(program.courseIds[0].toString());
								}}
								className={cn(
									"flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border transition-all duration-200 group text-left w-full gap-4 sm:gap-0",
									program.isActive
										? "bg-white border-neutral-200 hover:border-emerald-500 hover:shadow-lg"
										: "bg-red-50/40 border-red-100/60 hover:border-red-300 hover:shadow-md opacity-90",
								)}
							>
								<div className="flex items-center gap-4">
									<div
										className={cn(
											"w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0",
											program.isActive
												? "bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600"
												: "bg-red-100/50 group-hover:bg-red-100 text-red-500",
										)}
									>
										<span className="font-black text-xl">{program.name.charAt(0)}</span>
									</div>
									<div>
										<div className="flex items-center gap-2">
											<h3
												className={cn(
													"text-lg font-bold transition-colors",
													program.isActive
														? "text-neutral-800 group-hover:text-emerald-700"
														: "text-neutral-700 group-hover:text-red-700",
												)}
											>
												{program.name}
											</h3>
											{!program.isActive && (
												<span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
													Inactive
												</span>
											)}
										</div>
										<p className="text-sm text-neutral-400 mt-0.5">
											View attendance and engagement records
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3 w-full sm:w-auto justify-end">
									<span
										className={cn(
											"text-[13px] font-medium px-3 py-1.5 rounded-full border",
											program.isActive
												? "text-neutral-500 bg-neutral-50 border-neutral-100"
												: "text-red-400 bg-red-50/50 border-red-100",
										)}
									>
										{program.courseIds.length} course{program.courseIds.length !== 1 ? "s" : ""}
									</span>
									<div
										className={cn(
											"w-8 h-8 rounded-full flex items-center justify-center transition-colors",
											program.isActive
												? "bg-neutral-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-neutral-400"
												: "bg-red-50/50 group-hover:bg-red-50 group-hover:text-red-500 text-red-300",
										)}
									>
										<IconChevronDown className="w-4 h-4 -rotate-90" />
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-[#f8f9fa] -m-4 md:-m-8 overflow-hidden">
			{/* Top Bar - Mini */}
			<div className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 relative z-50">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setSelectedProgram(null)}
						className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors mr-1"
						title="Back to Programs"
					>
						<IconArrowLeft className="w-5 h-5" />
					</button>
					<div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
						<IconDatabase className="w-5 h-5 text-white" />
					</div>
					<h1 className="text-lg font-medium text-neutral-700 truncate max-w-[300px]">
						Attendance Engine - {selectedProgram.name}
					</h1>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-[11px] text-neutral-400 font-medium mr-1">
						Last sync: {lastSync}
					</span>

					<Button
						onClick={() => setIsSearchVisible(!isSearchVisible)}
						variant="outline"
						size="sm"
						className={cn(
							"h-8 border-neutral-300 hover:bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-bold px-3 transition-all",
							isSearchVisible && "bg-neutral-100 border-neutral-400",
						)}
					>
						<IconSearch className="w-3.5 h-3.5 mr-1.5" /> Find
					</Button>

					<Button
						onClick={() => setIsGradeInsightsOpen(true)}
						variant="outline"
						size="sm"
						className="h-8 border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold px-3 transition-all"
					>
						<IconTrendingUp className="w-3.5 h-3.5 mr-1.5" /> Grade Insights
					</Button>

					<Button
						onClick={() => setSessionOrder((prev) => (prev === "oldest" ? "newest" : "oldest"))}
						variant="outline"
						size="sm"
						className="h-8 border-neutral-300 hover:bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-bold px-3 transition-all"
					>
						{sessionOrder === "oldest" ? (
							<>
								<IconSortAscending className="w-3.5 h-3.5 mr-1.5" /> Oldest First
							</>
						) : (
							<>
								<IconSortDescending className="w-3.5 h-3.5 mr-1.5" /> Newest First
							</>
						)}
					</Button>

					<Button
						onClick={handleSyncAll}
						disabled={syncMutation.isPending}
						variant="outline"
						size="sm"
						className="h-8 border-neutral-300 hover:bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-bold px-3 transition-all"
					>
						<IconRefresh
							className={cn("w-3.5 h-3.5 mr-1.5", syncMutation.isPending && "animate-spin")}
						/>
						{syncMutation.isPending ? "Syncing..." : "Sync Data"}
					</Button>
				</div>

				{/* Floating Google Sheets Style Search Box */}
				{isSearchVisible && (
					<div className="absolute top-14 right-4 z-100 bg-white shadow-2xl border border-neutral-200 rounded-lg p-2 flex items-center gap-1 animate-in slide-in-from-top-2 duration-200">
						<div className="flex items-center border border-emerald-500 rounded px-2 bg-white h-9 min-w-[200px]">
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Find in sheet"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 outline-none text-sm h-full"
							/>
							{searchQuery && (
								<span className="text-[11px] text-neutral-400 font-medium px-2 border-l border-neutral-200 ml-2">
									{matches.length > 0 ? `${currentMatchIndex + 1} of ${matches.length}` : "0 of 0"}
								</span>
							)}
						</div>
						<div className="flex items-center relative">
							<button
								type="button"
								onClick={handlePrevMatch}
								className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
								title="Previous match"
							>
								<IconChevronUp className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={handleNextMatch}
								className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
								title="Next match"
							>
								<IconChevronDown className="w-4 h-4" />
							</button>
							<div className="w-px h-6 bg-neutral-200 mx-1" />
							<button
								type="button"
								onClick={() => {
									setIsSearchVisible(false);
									setSearchQuery("");
								}}
								className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
							>
								<IconX className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Main Spreadsheet Area */}
			<div className="flex-1 min-h-0 overflow-hidden relative">
				{activeSheet && (
					<SpreadsheetView
						key={activeSheet.courseId}
						sheet={activeSheet}
						sessionOrder={sessionOrder}
						searchQuery={searchQuery}
						currentMatch={matches[currentMatchIndex] || null}
						targetDate={null}
					/>
				)}
			</div>

			{/* Bottom Tabs Area */}
			<div className="h-10 bg-[#f8f9fa] border-t border-neutral-300 flex items-center px-1 shrink-0 overflow-x-auto scrollbar-hide">
				<div className="flex h-full">
					{sheets.map((sheet) => (
						<button
							key={sheet.courseId}
							type="button"
							onClick={() => setActiveCourseId(sheet.courseId.toString())}
							className={cn(
								"px-4 h-full flex items-center text-sm font-medium transition-colors border-r border-neutral-300 min-w-[120px] relative",
								activeCourseId === sheet.courseId.toString()
									? "bg-white text-emerald-700 border-t-2 border-t-emerald-600"
									: "text-neutral-600 hover:bg-neutral-200",
							)}
						>
							{sheet.name.split(" - ")[0]}
							{activeCourseId === sheet.courseId.toString() && (
								<div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
							)}
						</button>
					))}
				</div>
			</div>

			<AnimatePresence>
				{isGradeInsightsOpen && activeSheet && (
					<GradeInsightsSheet sheet={activeSheet} onClose={() => setIsGradeInsightsOpen(false)} />
				)}
			</AnimatePresence>
		</div>
	);
}

// --- Grade Insights Bottom Sheet (Compact & Pastel) ---

const GradeInsightsSheet = ({
	sheet,
	onClose,
}: {
	sheet: AttendanceEngineSheet;
	onClose: () => void;
}) => {
	const totalStudents = sheet.students.length;
	const totalPossibleAttendances = totalStudents * sheet.sessions.length;

	let totalPresent = 0;
	let totalHWDone = 0;
	let totalTimeSpent = 0;

	sheet.students.forEach((student) => {
		student.sessions.forEach((session) => {
			if (session.att === "P") totalPresent++;
			if (session.hw?.toLowerCase() === "done") totalHWDone++;
			totalTimeSpent += session.time || 0;
		});
	});

	const overallAttendanceRate =
		totalPossibleAttendances > 0 ? (totalPresent / totalPossibleAttendances) * 100 : 0;
	const overallHWRate =
		totalPossibleAttendances > 0 ? (totalHWDone / totalPossibleAttendances) * 100 : 0;
	const avgTimePerStudentSession =
		totalPossibleAttendances > 0 ? totalTimeSpent / totalPossibleAttendances : 0;

	const trendsData = sheet.sessions.map((session) => {
		const sessionStudents = sheet.students
			.map((student) => student.sessions.find((s) => s.sessionId === session.id))
			.filter(Boolean);

		const presentCount = sessionStudents.filter((s) => s && s.att === "P").length;
		const hwDoneCount = sessionStudents.filter((s) => s && s.hw?.toLowerCase() === "done").length;

		return {
			date: new Date(session.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
			attendance: totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0,
			homework: totalStudents > 0 ? (hwDoneCount / totalStudents) * 100 : 0,
		};
	});

	const bestSession = [...sheet.sessions]
		.map((session) => {
			const presentInSession = sheet.students.filter((student) =>
				student.sessions.some((s) => s.sessionId === session.id && s.att === "P"),
			).length;
			return { ...session, presentCount: presentInSession };
		})
		.sort((a, b) => b.presentCount - a.presentCount)[0];

	const riskStudents = sheet.students
		.map((student) => {
			const presentCount = student.sessions.filter((s) => s.att === "P").length;
			const attRate =
				student.sessions.length > 0 ? (presentCount / student.sessions.length) * 100 : 0;
			return { ...student, attendanceRate: attRate };
		})
		.filter((s) => s.attendanceRate < 50)
		.slice(0, 3);

	return (
		<div className="fixed inset-0 z-1000 flex flex-col justify-end">
			<motion.button
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
				className="absolute inset-0 w-full h-full bg-black/20 backdrop-blur-[2px] outline-none"
				aria-label="Close"
			/>

			<motion.div
				initial={{ y: "100%" }}
				animate={{ y: 0 }}
				exit={{ y: "100%" }}
				transition={{ type: "spring", damping: 30, stiffness: 300 }}
				className="relative bg-white w-full max-h-[75vh] rounded-t-[32px] shadow-2xl flex flex-col border-t border-neutral-100 overflow-hidden"
			>
				<div className="flex justify-center p-3 shrink-0">
					<div className="w-10 h-1 bg-neutral-100 rounded-full" />
				</div>

				<div className="px-8 pb-4 flex justify-between items-center border-b border-neutral-50 shrink-0">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
							<IconReport className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-neutral-800 leading-tight">
								{sheet.name.split(" - ")[0]} Insights
							</h2>
							<p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
								OVERVIEW • {totalStudents} STUDENTS
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1.5 hover:bg-neutral-50 rounded-lg transition-colors"
					>
						<IconX className="w-5 h-5 text-neutral-300" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
					{/* Key Metrics - Pastel Row */}
					<div className="grid grid-cols-3 gap-4">
						<InsightStatCard
							label="Attendance"
							value={`${overallAttendanceRate.toFixed(1)}%`}
							detail={`${totalPresent} present`}
							color="emerald"
						/>
						<InsightStatCard
							label="Homework"
							value={`${overallHWRate.toFixed(1)}%`}
							detail={`${totalHWDone} done`}
							color="blue"
						/>
						<InsightStatCard
							label="Avg. Time"
							value={`${avgTimePerStudentSession.toFixed(0)}m`}
							detail="per session"
							color="purple"
						/>
					</div>

					{/* Trends Chart - Soft Pastel Integration */}
					<div className="p-6 rounded-[24px] bg-[#fcfcfc] border border-neutral-100/50 space-y-5">
						<div className="flex items-center justify-between px-1">
							<div className="flex items-center gap-2">
								<div className="w-1.5 h-4 bg-emerald-200 rounded-full" />
								<h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
									Performance Trends
								</h3>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1.5">
									<div className="w-2 h-2 rounded-full bg-emerald-300" />
									<span className="text-[9px] font-bold text-neutral-400 uppercase">
										Attendance
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="w-2 h-2 rounded-full bg-blue-300" />
									<span className="text-[9px] font-bold text-neutral-400 uppercase">Homework</span>
								</div>
							</div>
						</div>

						<div className="h-[220px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={trendsData}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
									<XAxis
										dataKey="date"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 9, fontWeight: 600, fill: "#d4d4d4" }}
										dy={8}
									/>
									<YAxis hide domain={[0, 100]} />
									<Tooltip
										contentStyle={{
											borderRadius: "12px",
											border: "none",
											boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.03)",
											padding: "8px 12px",
											fontSize: "10px",
											background: "rgba(255, 255, 255, 0.9)",
											backdropFilter: "blur(4px)",
										}}
									/>
									<Line
										type="monotone"
										dataKey="attendance"
										stroke="#6ee7b7"
										strokeWidth={3}
										dot={{ r: 3, fill: "#6ee7b7", strokeWidth: 0 }}
										activeDot={{ r: 5 }}
									/>
									<Line
										type="monotone"
										dataKey="homework"
										stroke="#93c5fd"
										strokeWidth={3}
										dot={{ r: 3, fill: "#93c5fd", strokeWidth: 0 }}
										activeDot={{ r: 5 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Highlights & Monitoring - Pastel Side-by-Side */}
					<div className="grid grid-cols-2 gap-6 pt-2">
						<div className="space-y-4">
							<h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest px-1">
								Peak Session
							</h3>
							<div className="p-5 rounded-[24px] bg-emerald-50/50 border border-emerald-100/50 flex items-center gap-4 transition-all hover:bg-emerald-50">
								<div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-400 shadow-sm">
									<span className="text-base font-black">{bestSession?.presentCount}</span>
								</div>
								<div>
									<p className="text-sm font-bold text-neutral-700">
										{new Date(bestSession?.date).toLocaleDateString("en-GB", {
											weekday: "short",
											day: "numeric",
											month: "short",
										})}
									</p>
									<p className="text-[10px] text-neutral-400 font-medium mt-0.5">
										Highest class turnout
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest px-1">
								Risk Monitoring
							</h3>
							<div className="space-y-2">
								{riskStudents.map((student) => (
									<div
										key={student.id}
										className="flex justify-between items-center p-3 px-4 rounded-xl bg-rose-50/30 border border-rose-100/30 hover:bg-rose-50 transition-colors"
									>
										<span className="text-xs font-bold text-neutral-600">{student.name}</span>
										<span className="text-[10px] font-black text-rose-400">
											{student.attendanceRate.toFixed(0)}%
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="p-8 bg-white border-t border-neutral-50 shrink-0">
					<Button
						onClick={onClose}
						variant="ghost"
						className="w-full h-12 rounded-2xl text-neutral-400 font-bold text-xs hover:bg-neutral-50 hover:text-neutral-600 transition-all"
					>
						Done Exploring Insights
					</Button>
				</div>
			</motion.div>
		</div>
	);
};

const InsightStatCard = ({
	label,
	value,
	detail,
	color,
}: {
	label: string;
	value: string;
	detail: string;
	color: "emerald" | "blue" | "purple";
}) => {
	const colors = {
		emerald: "bg-emerald-50/50 border-emerald-100/50 text-emerald-600",
		blue: "bg-blue-50/50 border-blue-100/50 text-blue-600",
		purple: "bg-purple-50/50 border-purple-100/50 text-purple-600",
	};

	return (
		<div
			className={cn(
				"p-5 rounded-[24px] border flex flex-col gap-0.5 transition-all hover:scale-[1.02]",
				colors[color],
			)}
		>
			<p className="text-[9px] font-bold uppercase tracking-wider opacity-60">{label}</p>
			<h4 className="text-2xl font-black tracking-tight">{value}</h4>
			<p className="text-[9px] font-bold opacity-40 italic">{detail}</p>
		</div>
	);
};
