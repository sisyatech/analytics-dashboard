import {
	IconCalendar,
	IconChartBar,
	IconStar,
	IconTrophy,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangeInsightsModalProps {
	sheet: AttendanceEngineSheet;
	onClose: () => void;
}

export const DateRangeInsightsModal = ({ sheet, onClose }: DateRangeInsightsModalProps) => {
	const sortedSessions = useMemo(() => {
		return [...sheet.sessions].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}, [sheet.sessions]);

	const initialStartDate = sortedSessions.length > 0 ? sortedSessions[0].date.split("T")[0] : "";
	const initialEndDate =
		sortedSessions.length > 0 ? sortedSessions[sortedSessions.length - 1].date.split("T")[0] : "";

	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);

	// View toggles for "See More"
	const [showAllDays, setShowAllDays] = useState(false);
	const [showAllAttStudents, setShowAllAttStudents] = useState(false);
	const [showAllHwStudents, setShowAllHwStudents] = useState(false);

	const { stats, chartData, rankedDays, topStudentsAtt, topStudentsHw } = useMemo(() => {
		if (!startDate || !endDate)
			return {
				stats: null,
				chartData: [],
				rankedDays: [],
				topStudentsAtt: [],
				topStudentsHw: [],
			};

		const start = new Date(startDate).getTime();
		const end = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1;

		const validSessions = sheet.sessions.filter((s) => {
			const time = new Date(s.date).getTime();
			return time >= start && time <= end;
		});

		validSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		let totalPresent = 0;
		let totalHWDone = 0;
		const totalPossible = sheet.students.length * validSessions.length;

		const data = validSessions.map((session) => {
			const sessionStudents = sheet.students
				.map((student) => student.sessions.find((s) => s.sessionId === session.id))
				.filter(Boolean);

			const presentCount = sessionStudents.filter((s) => s && s.att === "P").length;
			const hwDoneCount = sessionStudents.filter((s) => s && s.hw?.toLowerCase() === "done").length;

			totalPresent += presentCount;
			totalHWDone += hwDoneCount;

			return {
				date: new Date(session.date).toLocaleDateString("en-GB", {
					day: "numeric",
					month: "short",
				}),
				attendance: sheet.students.length > 0 ? (presentCount / sheet.students.length) * 100 : 0,
				homework: sheet.students.length > 0 ? (hwDoneCount / sheet.students.length) * 100 : 0,
			};
		});

		const rankedD = [...data].sort((a, b) => b.attendance - a.attendance);

		const studentStats = sheet.students.map((student) => {
			let present = 0;
			let hwDone = 0;
			let classesForStudent = 0;

			validSessions.forEach((session) => {
				const s = student.sessions.find((x) => x.sessionId === session.id);
				if (s) {
					classesForStudent++;
					if (s.att === "P") present++;
					if (s.hw?.toLowerCase() === "done") hwDone++;
				}
			});

			return {
				id: student.id,
				name: student.name,
				attendanceRate: classesForStudent > 0 ? (present / classesForStudent) * 100 : 0,
				hwRate: classesForStudent > 0 ? (hwDone / classesForStudent) * 100 : 0,
				totalClasses: classesForStudent,
			};
		});

		// Filter out students with 0 classes in range if any, then sort
		const activeStudents = studentStats.filter((s) => s.totalClasses > 0);
		const topAtt = [...activeStudents].sort((a, b) => b.attendanceRate - a.attendanceRate);
		const topHw = [...activeStudents].sort((a, b) => b.hwRate - a.hwRate);

		return {
			stats: {
				totalStudents: sheet.students.length,
				totalClasses: validSessions.length,
				attendanceRate: totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0,
				hwRate: totalPossible > 0 ? (totalHWDone / totalPossible) * 100 : 0,
			},
			chartData: data,
			rankedDays: rankedD,
			topStudentsAtt: topAtt,
			topStudentsHw: topHw,
		};
	}, [sheet, startDate, endDate]);

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 10 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 10 }}
				className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
							<IconChartBar className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-neutral-800">Detailed Analytics Report</h2>
							<p className="text-sm text-neutral-500 font-medium">{sheet.name.split(" - ")[0]}</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
					>
						<IconX className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-white">
					{/* Controls Row */}
					<div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm sticky top-0 z-10">
						<div className="flex items-center gap-3 flex-1 min-w-[280px]">
							<IconCalendar className="w-5 h-5 text-neutral-400" />
							<div className="flex items-center gap-2 flex-1">
								<div className="flex-1 space-y-1">
									<label
										htmlFor="startDateInput"
										className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pl-1"
									>
										Start Date
									</label>
									<input
										id="startDateInput"
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
									/>
								</div>
								<span className="text-neutral-300 mt-5">-</span>
								<div className="flex-1 space-y-1">
									<label
										htmlFor="endDateInput"
										className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pl-1"
									>
										End Date
									</label>
									<input
										id="endDateInput"
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
									/>
								</div>
							</div>
						</div>
					</div>

					{stats && (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<MetricCard title="Total Students" value={stats.totalStudents} color="blue" />
							<MetricCard title="Classes in Range" value={stats.totalClasses} color="purple" />
							<MetricCard
								title="Avg Attendance"
								value={`${stats.attendanceRate.toFixed(1)}%`}
								color="emerald"
							/>
							<MetricCard
								title="Avg Homework"
								value={`${stats.hwRate.toFixed(1)}%`}
								color="amber"
							/>
						</div>
					)}

					{chartData.length > 0 ? (
						<>
							<div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-6">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">
										Performance Trends
									</h3>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-emerald-400" />
											<span className="text-xs font-medium text-neutral-500">Attendance</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full bg-blue-400" />
											<span className="text-xs font-medium text-neutral-500">Homework</span>
										</div>
									</div>
								</div>
								<div className="h-[300px] w-full">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={chartData}>
											<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
											<XAxis
												dataKey="date"
												axisLine={false}
												tickLine={false}
												tick={{ fontSize: 11, fontWeight: 500, fill: "#a3a3a3" }}
												dy={10}
											/>
											<YAxis
												axisLine={false}
												tickLine={false}
												tick={{ fontSize: 11, fontWeight: 500, fill: "#a3a3a3" }}
												dx={-10}
												domain={[0, 100]}
											/>
											<Tooltip
												contentStyle={{
													borderRadius: "16px",
													border: "none",
													boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
													padding: "12px 16px",
													fontWeight: "bold",
												}}
											/>
											<Line
												type="monotone"
												dataKey="attendance"
												stroke="#34d399"
												strokeWidth={3}
												dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }}
												activeDot={{ r: 6, strokeWidth: 0 }}
											/>
											<Line
												type="monotone"
												dataKey="homework"
												stroke="#60a5fa"
												strokeWidth={3}
												dot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }}
												activeDot={{ r: 6, strokeWidth: 0 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Best Days */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
											<IconTrophy className="w-4 h-4 text-amber-500" /> Best Days
										</h3>
									</div>
									<div className="space-y-2">
										<AnimatePresence>
											{(showAllDays ? rankedDays : rankedDays.slice(0, 3)).map((day, i) => (
												<motion.div
													key={day.date}
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex items-center justify-between"
												>
													<div className="flex items-center gap-3">
														<span className="text-sm font-black text-amber-600/50">#{i + 1}</span>
														<span className="text-sm font-bold text-neutral-700">{day.date}</span>
													</div>
													<div className="text-right">
														<span className="text-xs font-black text-emerald-600 block">
															{day.attendance.toFixed(0)}% Att
														</span>
													</div>
												</motion.div>
											))}
										</AnimatePresence>
										{rankedDays.length > 3 && (
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-xs text-amber-600 hover:bg-amber-50 rounded-xl"
												onClick={() => setShowAllDays(!showAllDays)}
											>
												{showAllDays ? "Show Less" : `View ${rankedDays.length - 3} More`}
											</Button>
										)}
									</div>
								</div>

								{/* Top Students - Attendance */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
											<IconUsers className="w-4 h-4 text-emerald-500" /> Top by Attendance
										</h3>
									</div>
									<div className="space-y-2">
										<AnimatePresence>
											{(showAllAttStudents ? topStudentsAtt : topStudentsAtt.slice(0, 5)).map(
												(student, i) => (
													<motion.div
														key={student.id}
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														exit={{ opacity: 0, height: 0 }}
														className="p-3 rounded-2xl bg-emerald-50/30 border border-emerald-100/50 flex items-center justify-between"
													>
														<div className="flex items-center gap-2 overflow-hidden pr-2">
															<span className="text-xs font-black text-emerald-600/50 shrink-0">
																#{i + 1}
															</span>
															<span className="text-xs font-bold text-neutral-700 truncate">
																{student.name}
															</span>
														</div>
														<span className="text-xs font-black text-emerald-600 shrink-0">
															{student.attendanceRate.toFixed(0)}%
														</span>
													</motion.div>
												),
											)}
										</AnimatePresence>
										{topStudentsAtt.length > 5 && (
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-xs text-emerald-600 hover:bg-emerald-50 rounded-xl"
												onClick={() => setShowAllAttStudents(!showAllAttStudents)}
											>
												{showAllAttStudents
													? "Show Less"
													: `View ${topStudentsAtt.length - 5} More`}
											</Button>
										)}
									</div>
								</div>

								{/* Top Students - Homework */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
											<IconStar className="w-4 h-4 text-blue-500" /> Top by Homework
										</h3>
									</div>
									<div className="space-y-2">
										<AnimatePresence>
											{(showAllHwStudents ? topStudentsHw : topStudentsHw.slice(0, 5)).map(
												(student, i) => (
													<motion.div
														key={student.id}
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														exit={{ opacity: 0, height: 0 }}
														className="p-3 rounded-2xl bg-blue-50/30 border border-blue-100/50 flex items-center justify-between"
													>
														<div className="flex items-center gap-2 overflow-hidden pr-2">
															<span className="text-xs font-black text-blue-600/50 shrink-0">
																#{i + 1}
															</span>
															<span className="text-xs font-bold text-neutral-700 truncate">
																{student.name}
															</span>
														</div>
														<span className="text-xs font-black text-blue-600 shrink-0">
															{student.hwRate.toFixed(0)}%
														</span>
													</motion.div>
												),
											)}
										</AnimatePresence>
										{topStudentsHw.length > 5 && (
											<Button
												variant="ghost"
												size="sm"
												className="w-full text-xs text-blue-600 hover:bg-blue-50 rounded-xl"
												onClick={() => setShowAllHwStudents(!showAllHwStudents)}
											>
												{showAllHwStudents ? "Show Less" : `View ${topStudentsHw.length - 5} More`}
											</Button>
										)}
									</div>
								</div>
							</div>
						</>
					) : (
						<div className="py-20 flex flex-col items-center justify-center text-center bg-neutral-50 rounded-3xl border border-neutral-100 border-dashed">
							<IconCalendar className="w-12 h-12 text-neutral-300 mb-3" />
							<p className="text-neutral-500 font-medium">
								No classes found in the selected date range.
							</p>
							<p className="text-xs text-neutral-400 mt-1">
								Try adjusting your start and end dates.
							</p>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
};

const MetricCard = ({
	title,
	value,
	color,
}: {
	title: string;
	value: string | number;
	color: "blue" | "emerald" | "purple" | "amber";
}) => {
	const colors = {
		blue: "bg-blue-50 border-blue-100 text-blue-600",
		emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
		purple: "bg-purple-50 border-purple-100 text-purple-600",
		amber: "bg-amber-50 border-amber-100 text-amber-600",
	};

	return (
		<div
			className={cn(
				"p-5 rounded-3xl border flex flex-col gap-1 transition-transform hover:scale-[1.02]",
				colors[color],
			)}
		>
			<p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{title}</p>
			<p className="text-3xl font-black">{value}</p>
		</div>
	);
};
