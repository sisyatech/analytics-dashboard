import {
	IconBook,
	IconCalendarEvent,
	IconPercentage,
	IconSchool,
	IconSearch,
	IconUserCheck,
	IconUsers,
	IconUserX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCoursesByGrade,
	useSessionAttendance,
	useSessionsByCourse,
} from "@/hooks/analytics/useAttendance";
import { cn } from "@/lib/utils";
import type { Course, Session } from "@/types/analytics";

const GRADES = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

export default function AttendancePage() {
	const [viewType, setViewType] = useState<"attendance" | "live">("attendance");

	// Selection State
	const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Data Fetching
	const { data: coursesData, isLoading: isLoadingCourses } = useCoursesByGrade(selectedGrade);
	const { data: sessionsData, isLoading: isLoadingSessions } =
		useSessionsByCourse(selectedCourseId);
	const { data: attendanceData } = useSessionAttendance(selectedSessionId);

	const stats = attendanceData
		? [
				{
					label: "Total Enrolled",
					value: attendanceData.totalEnrolled,
					icon: <IconUsers className="w-5 h-5" />,
					color: "text-blue-600 dark:text-blue-400",
					bg: "bg-blue-50 dark:bg-blue-900/20",
				},
				{
					label: "Present",
					value: attendanceData.presentCount,
					icon: <IconUserCheck className="w-5 h-5" />,
					color: "text-emerald-600 dark:text-emerald-400",
					bg: "bg-emerald-50 dark:bg-emerald-900/20",
				},
				{
					label: "Absent",
					value: attendanceData.absentCount,
					icon: <IconUserX className="w-5 h-5" />,
					color: "text-rose-600 dark:text-rose-400",
					bg: "bg-rose-50 dark:bg-rose-900/20",
				},
				{
					label: "Attendance Rate",
					value: `${((attendanceData.presentCount / attendanceData.totalEnrolled) * 100).toFixed(
						1,
					)}%`,
					icon: <IconPercentage className="w-5 h-5" />,
					color: "text-amber-600 dark:text-amber-400",
					bg: "bg-amber-50 dark:bg-amber-900/20",
				},
			]
		: [];

	const filteredStudents = attendanceData?.students.filter(
		(s) =>
			s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.phone.includes(searchQuery),
	);

	return (
		<DashboardLayout actor="admin" userName="Admin User">
			<div className="space-y-6">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{viewType === "attendance" ? "Attendance Analytics" : "Live Session Analytics"}
						</h1>
						<p className="text-gray-500 dark:text-neutral-400 mt-2">
							{viewType === "attendance"
								? "Monitor and manage student attendance records."
								: "Real-time engagement and presence in live sessions."}
						</p>
					</div>
					<Select
						value={viewType}
						onValueChange={(val) => setViewType(val as "attendance" | "live")}
					>
						<SelectTrigger className="w-full md:w-45 bg-white dark:bg-neutral-800">
							<SelectValue placeholder="Select View" />
						</SelectTrigger>
						<SelectContent className="bg-white dark:bg-neutral-800">
							<SelectItem value="attendance">Attendance</SelectItem>
							<SelectItem value="live">Live</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<AnimatePresence mode="wait">
					{viewType === "attendance" ? (
						<motion.div
							key="attendance-view"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="space-y-8"
						>
							{/* Filter Section */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
								<div className="space-y-2">
									<div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
										<IconSchool className="w-4 h-4" /> Grade
									</div>
									<Select
										value={selectedGrade || ""}
										onValueChange={(val) => {
											setSelectedGrade(val);
											setSelectedCourseId(null);
											setSelectedSessionId(null);
										}}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select Grade" />
										</SelectTrigger>
										<SelectContent>
											{GRADES.map((g) => (
												<SelectItem key={g} value={g}>
													Grade {g}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
										<IconBook className="w-4 h-4" /> Course
									</div>
									<Select
										disabled={!selectedGrade || isLoadingCourses}
										value={selectedCourseId?.toString() || ""}
										onValueChange={(val) => {
											setSelectedCourseId(Number.parseInt(val, 10));
											setSelectedSessionId(null);
										}}
									>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={isLoadingCourses ? "Loading..." : "Select Course"}
											/>
										</SelectTrigger>
										<SelectContent>
											{coursesData?.courses.map((c: Course) => (
												<SelectItem key={c.id} value={c.id.toString()}>
													{c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
										<IconCalendarEvent className="w-4 h-4" /> Session
									</div>
									<Select
										disabled={!selectedCourseId || isLoadingSessions}
										value={selectedSessionId?.toString() || ""}
										onValueChange={(val) => setSelectedSessionId(Number.parseInt(val, 10))}
									>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={isLoadingSessions ? "Loading..." : "Select Session"}
											/>
										</SelectTrigger>
										<SelectContent>
											{sessionsData?.sessions.map((s: Session) => (
												<SelectItem key={s.id} value={s.id.toString()}>
													{s.detail}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Stats Grid */}
							{stats.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
									{stats.map((stat, i) => (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: i * 0.1 }}
											key={stat.label}
											className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm"
										>
											<div className="flex items-center justify-between mb-4">
												<div className={cn("p-2 rounded-xl", stat.bg)}>
													<span className={stat.color}>{stat.icon}</span>
												</div>
											</div>
											<h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
											<p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
										</motion.div>
									))}
								</div>
							)}

							{/* Attendance Detail Table */}
							{attendanceData && (
								<div className="space-y-4">
									<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
										<h2 className="text-xl font-semibold dark:text-white">Student Roll Call</h2>
										<div className="relative w-full sm:w-72">
											<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
											<input
												type="text"
												placeholder="Search students..."
												className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-200 text-sm"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
											/>
										</div>
									</div>

									<div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden shadow-sm">
										<div className="overflow-x-auto">
											<table className="w-full text-sm text-left">
												<thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 font-medium uppercase text-[10px] tracking-widest">
													<tr>
														<th className="px-6 py-4">Student</th>
														<th className="px-6 py-4">Contact</th>
														<th className="px-6 py-4">Status</th>
														<th className="px-6 py-4">Duration</th>
														<th className="px-6 py-4">Participation</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
													{filteredStudents?.map((student) => (
														<tr
															key={student.studentId}
															className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition duration-150"
														>
															<td className="px-6 py-4">
																<div className="flex items-center gap-3">
																	<div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-500">
																		{student.name.charAt(0)}
																	</div>
																	<div>
																		<p className="font-semibold text-neutral-900 dark:text-white">
																			{student.name}
																		</p>
																		<p className="text-[10px] text-neutral-400">
																			ID: {student.studentId}
																		</p>
																	</div>
																</div>
															</td>
															<td className="px-6 py-4">
																<p className="dark:text-neutral-300">{student.email}</p>
																<p className="text-[10px] text-neutral-400">{student.phone}</p>
															</td>
															<td className="px-6 py-4">
																<span
																	className={cn(
																		"px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
																		student.status === "PRESENT"
																			? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
																			: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
																	)}
																>
																	{student.status}
																</span>
															</td>
															<td className="px-6 py-4">
																<div className="flex flex-col gap-1">
																	<span className="font-medium dark:text-white">
																		{student.totalDurationMin.toFixed(1)}m
																	</span>
																	{(student.isEarlyLeave || student.isLateJoin) && (
																		<div className="flex gap-1">
																			{student.isLateJoin && (
																				<span className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1 rounded">
																					LATE
																				</span>
																			)}
																			{student.isEarlyLeave && (
																				<span className="text-[9px] bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-1 rounded">
																					EARLY
																				</span>
																			)}
																		</div>
																	)}
																</div>
															</td>
															<td className="px-6 py-4">
																<div className="flex gap-0.5">
																	{student.intervals.map((_, idx) => (
																		<div
																			// biome-ignore lint/suspicious/noArrayIndexKey: <intervals are static here>
																			key={idx}
																			className="w-4 h-1 rounded-full bg-blue-500 dark:bg-blue-400"
																			title="Session Interval"
																		/>
																	))}
																	{student.intervals.length === 0 && (
																		<span className="text-neutral-300 dark:text-neutral-600">
																			—
																		</span>
																	)}
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										{!selectedSessionId && (
											<div className="p-12 text-center text-neutral-400">
												Select a session to view student list
											</div>
										)}
										{filteredStudents?.length === 0 && (
											<div className="p-12 text-center text-neutral-400">
												No students found matching your search.
											</div>
										)}
									</div>
								</div>
							)}

							{!selectedGrade && (
								<div className="h-64 flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl">
									<IconSchool className="w-12 h-12 mb-4 opacity-20" />
									<p>Please select a grade to get started</p>
								</div>
							)}
						</motion.div>
					) : (
						<motion.div
							key="live-view"
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.98 }}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-24 rounded-2xl bg-linear-to-br from-blue-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-blue-50 dark:border-neutral-700 flex items-center justify-center text-blue-400 dark:text-neutral-500 font-medium"
									>
										Live Stat {i} (Placeholder)
									</div>
								))}
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2 h-100 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400">
									<div className="animate-pulse space-y-4 w-full px-8">
										<div className="h-4 bg-neutral-100 dark:bg-neutral-700 rounded w-1/4" />
										<div className="h-64 bg-neutral-50 dark:bg-neutral-800 rounded-xl" />
									</div>
									<p className="mt-4">Live Participation Map (Coming Soon)</p>
								</div>
								<div className="h-100 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400">
									Active Teachers List
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</DashboardLayout>
	);
}
