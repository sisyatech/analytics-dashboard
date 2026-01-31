import {
	IconArrowLeft,
	IconBook,
	IconCalendar,
	IconCalendarEvent,
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronUp,
	IconCircleCheck,
	IconCircleCheckFilled,
	IconCircleX,
	IconClock,
	IconHistory,
	IconNotes,
	IconPercentage,
	IconSchool,
	IconSearch,
	IconTag,
	IconUser,
	IconUserCheck,
	IconUsers,
	IconUserX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useMemo, useState } from "react";
import { AnnouncementModal } from "@/components/admin/Attendance/AnnouncementModal";
import { Button } from "@/components/ui/button";
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
import {
	AnnouncementAudience,
	AnnouncementScope,
	AnnouncementType,
	type CreateAnnouncementPayload,
} from "@/types/announcement";

const GRADES = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

function formatTime(dateStr: string | undefined) {
	if (!dateStr) return "N/A";
	return new Date(dateStr).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

function formatDate(dateStr: string | undefined) {
	if (!dateStr) return "N/A";
	return new Date(dateStr).toLocaleDateString([], {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

const SessionCard = ({
	session,
	onSelect,
}: {
	session: Session;
	onSelect: (id: number) => void;
}) => {
	const isCompleted = !!session.actualEndTime;

	return (
		<motion.button
			whileHover={{
				y: -4,
				boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => onSelect(session.id)}
			className="group flex flex-col text-left p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden"
		>
			{/* Background Accent */}
			<div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

			<div className="flex justify-between items-start mb-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
							{session.subject.name}
						</span>
						{isCompleted ? (
							<span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-tight">
								<IconCircleCheckFilled className="w-3 h-3" /> Done
							</span>
						) : (
							<span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase tracking-tight">
								<div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
							</span>
						)}
					</div>
					<div className="flex items-center gap-1.5 mt-1 text-neutral-400">
						<IconCalendar className="w-3 h-3" />
						<span className="text-[10px] font-bold uppercase tracking-tighter">
							{formatDate(session.scheduledStartTime)}
						</span>
					</div>
				</div>
				<div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
					<IconChevronRight className="w-4 h-4" />
				</div>
			</div>

			<h3 className="font-bold text-neutral-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
				{session.detail}
			</h3>

			<div className="mt-auto pt-4 border-t border-neutral-50 dark:border-neutral-700/50 grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Teacher</p>
					<div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
						<div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
							<IconUser className="w-3 h-3" />
						</div>
						<span className="text-[11px] font-bold truncate">{session.scheduledTeacher.name}</span>
					</div>
				</div>
				<div className="space-y-1 text-right">
					<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
						Homework
					</p>
					<div
						className={cn(
							"inline-flex items-center gap-1 text-[11px] font-bold",
							session.isHomeworkUploaded ? "text-emerald-500" : "text-rose-500",
						)}
					>
						{session.isHomeworkUploaded ? "Uploaded" : "Missing"}
						{session.isHomeworkUploaded ? (
							<IconCircleCheck className="w-3 h-3" />
						) : (
							<IconCircleX className="w-3 h-3" />
						)}
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
				<div className="flex items-center gap-1.5">
					<IconClock className="w-3.5 h-3.5 text-blue-500/70" />
					<span>
						{formatTime(session.scheduledStartTime)} • {session.scheduledDuration}m
					</span>
				</div>
				<div className="flex items-center gap-1">
					<IconTag className="w-3 h-3" />
					<span>#{session.id}</span>
				</div>
			</div>
		</motion.button>
	);
};

export default function AttendancePage() {
	const [viewType, setViewType] = useState<"attendance" | "live">("attendance");

	// Selection State
	const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "present" | "absent">("all");
	const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Announcement Modal State
	const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
	const [announcementPayload, setAnnouncementPayload] = useState<
		Partial<CreateAnnouncementPayload>
	>({});
	const [announcementTargetName, setAnnouncementTargetName] = useState("");

	// Data Fetching
	const { data: coursesData, isLoading: isLoadingCourses } = useCoursesByGrade(selectedGrade);
	const { data: sessionsData, isLoading: isLoadingSessions } = useSessionsByCourse(
		selectedCourseId,
		currentPage,
	);
	const { data: attendanceData } = useSessionAttendance(selectedSessionId);

	const selectedSession = useMemo(() => {
		return sessionsData?.sessions.find((s) => s.id === selectedSessionId);
	}, [sessionsData, selectedSessionId]);

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

	const filteredStudents = useMemo(() => {
		if (!attendanceData) return [];
		return attendanceData.students.filter((s) => {
			const matchesSearch =
				s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.phone.includes(searchQuery);

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "present" && s.status === "PRESENT") ||
				(statusFilter === "absent" && s.status === "ABSENT");

			return matchesSearch && matchesStatus;
		});
	}, [attendanceData, searchQuery, statusFilter]);

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="flex items-center gap-4">
					{selectedSessionId && (
						<motion.button
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							onClick={() => setSelectedSessionId(null)}
							className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
						>
							<IconArrowLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
						</motion.button>
					)}
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{selectedSessionId
								? "Session Details"
								: viewType === "attendance"
									? "Attendance Analytics"
									: "Live Session Analytics"}
						</h1>
						<p className="text-gray-500 dark:text-neutral-400 mt-1">
							{selectedSessionId
								? `${selectedSession?.detail}`
								: viewType === "attendance"
									? "Monitor and manage student attendance records."
									: "Real-time engagement and presence in live sessions."}
						</p>
					</div>
				</div>
				{!selectedSessionId && (
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
				)}
			</div>

			<AnimatePresence mode="wait">
				{viewType === "attendance" ? (
					<motion.div
						key={selectedSessionId ? "detail" : "list"}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="space-y-8"
					>
						{!selectedSessionId && (
							<>
								{/* Filter Section */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
									<div className="space-y-3">
										<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
											<IconSchool className="w-4 h-4 text-blue-500" /> Grade
										</div>
										<Select
											value={selectedGrade || ""}
											onValueChange={(val) => {
												setSelectedGrade(val);
												setSelectedCourseId(null);
												setCurrentPage(1);
											}}
										>
											<SelectTrigger className="w-full h-12 rounded-xl">
												<SelectValue placeholder="Which grade?" />
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

									<div className="space-y-3">
										<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
											<IconBook className="w-4 h-4 text-emerald-500" /> Course
										</div>
										<Select
											disabled={!selectedGrade || isLoadingCourses}
											value={selectedCourseId?.toString() || ""}
											onValueChange={(val) => {
												setSelectedCourseId(Number.parseInt(val, 10));
												setCurrentPage(1);
											}}
										>
											<SelectTrigger className="w-full h-12 rounded-xl">
												<SelectValue
													placeholder={isLoadingCourses ? "Loading..." : "Which course?"}
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
								</div>

								{/* Session List Grid */}
								{selectedCourseId && (
									<div className="space-y-4">
										<div className="flex items-center justify-between px-2">
											<h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
												<IconCalendarEvent className="w-5 h-5 text-purple-500" /> Recent Sessions
											</h2>
											<span className="text-xs font-medium text-neutral-400">
												{sessionsData?.sessions.length || 0} found
											</span>
										</div>

										{isLoadingSessions ? (
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
												{[1, 2, 3].map((i) => (
													<div
														key={i}
														className="h-44 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-pulse"
													/>
												))}
											</div>
										) : (
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
												{sessionsData?.sessions.map((session) => (
													<SessionCard
														key={session.id}
														session={session}
														onSelect={setSelectedSessionId}
													/>
												))}
											</div>
										)}

										{/* Pagination Footer */}
										{sessionsData?.pagination &&
											sessionsData.pagination.total > sessionsData.pagination.limit && (
												<div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-neutral-100 dark:border-neutral-800">
													<div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
														<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
														<p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
															Page {sessionsData.pagination.page}{" "}
															<span className="mx-2 text-neutral-300">|</span>{" "}
															{sessionsData.pagination.total} sessions total
														</p>
													</div>

													<div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
														<button
															type="button"
															onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
															disabled={currentPage === 1}
															className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
															title="Previous Page"
														>
															<IconChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
														</button>

														<div className="flex items-center gap-1 h-9 px-1">
															{Array.from(
																{
																	length: Math.ceil(
																		sessionsData.pagination.total / sessionsData.pagination.limit,
																	),
																},
																(_, i) => i + 1,
															)
																.filter(
																	(p) =>
																		p === 1 ||
																		p ===
																			Math.ceil(
																				sessionsData.pagination.total /
																					sessionsData.pagination.limit,
																			) ||
																		Math.abs(p - currentPage) <= 1,
																)
																.map((p, i, arr) => (
																	<div key={p} className="flex items-center">
																		{i > 0 && arr[i - 1] !== p - 1 && (
																			<span className="w-6 text-center text-neutral-300 font-black text-[10px]">
																				•••
																			</span>
																		)}
																		<button
																			type="button"
																			onClick={() => setCurrentPage(p)}
																			className={cn(
																				"min-w-9 h-9 rounded-xl font-black text-[10px] transition-all duration-300",
																				currentPage === p
																					? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-xl scale-105"
																					: "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700",
																			)}
																		>
																			{p.toString().padStart(2, "0")}
																		</button>
																	</div>
																))}
														</div>

														<button
															type="button"
															onClick={() => setCurrentPage((p) => p + 1)}
															disabled={!sessionsData.pagination.hasNext}
															className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
															title="Next Page"
														>
															<IconChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
														</button>
													</div>

													<div className="hidden lg:block text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
														Showing{" "}
														{(sessionsData.pagination.page - 1) * sessionsData.pagination.limit + 1}{" "}
														-{" "}
														{Math.min(
															sessionsData.pagination.page * sessionsData.pagination.limit,
															sessionsData.pagination.total,
														)}
													</div>
												</div>
											)}
									</div>
								)}

								{!selectedGrade && (
									<div className="h-64 flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/20 transition-colors">
										<IconSchool className="w-16 h-16 mb-4 opacity-10" />
										<p className="font-medium">Select a grade and course to browse sessions</p>
									</div>
								)}
							</>
						)}

						{/* Detail View */}
						{selectedSessionId && selectedSession && (
							<div className="space-y-8">
								{/* Session Overview Section */}
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									{/* Main Profile Info */}
									<div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm relative overflow-hidden group">
										<div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
											<IconHistory className="w-32 h-32" />
										</div>

										<div className="flex flex-col h-full gap-8">
											<div className="flex items-start justify-between">
												<div>
													<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-2">
														Active Session Information
													</p>
													<h2 className="text-2xl font-bold dark:text-white">
														{selectedSession.detail}
													</h2>
												</div>
												<div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs">
													<IconTag className="w-3.5 h-3.5 text-neutral-400" />
													<span className="text-[10px] font-black text-neutral-500 uppercase tracking-tighter">
														ID #{selectedSession.id}
													</span>
												</div>
											</div>

											<div className="space-y-8">
												{/* Row 1: Subject and Homework */}
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/20">
														<div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
															<IconBook className="w-6 h-6" />
														</div>
														<div>
															<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
																Subject
															</p>
															<p className="font-bold dark:text-white text-lg">
																{selectedSession.subject.name}
															</p>
														</div>
													</div>

													<div
														className={cn(
															"relative flex items-start gap-4 p-4 rounded-2xl border transition-colors",
															selectedSession.isHomeworkUploaded
																? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800"
																: "bg-amber-50/30 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800",
														)}
													>
														<div
															className={cn(
																"p-3 rounded-2xl",
																selectedSession.isHomeworkUploaded
																	? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
																	: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
															)}
														>
															<IconNotes className="w-6 h-6" />
														</div>
														<div className="flex flex-col flex-1">
															<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
																Homework
															</p>
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<p className="font-bold dark:text-white text-lg">
																		{selectedSession.isHomeworkUploaded ? "Uploaded" : "Pending"}
																	</p>
																	{selectedSession.isHomeworkUploaded ? (
																		<IconCircleCheck className="w-5 h-5 text-emerald-500" />
																	) : (
																		<IconCircleX className="w-5 h-5 text-amber-500" />
																	)}
																</div>
																{!selectedSession.isHomeworkUploaded && (
																	<Button
																		onClick={(e: React.MouseEvent) => {
																			e.stopPropagation();
																			const targetTeacher =
																				selectedSession.actualTeacher ||
																				selectedSession.scheduledTeacher;
																			setAnnouncementTargetName(targetTeacher.name);
																			setAnnouncementPayload({
																				title: "Homework Pending Warning",
																				message: `The homework for session "${selectedSession.detail}" has not been uploaded yet. Please upload it as soon as possible.`,
																				type: AnnouncementType.ALERT,
																				audience: AnnouncementAudience.TEACHERS,
																				scope: AnnouncementScope.INDIVIDUAL,
																				mentorId: targetTeacher.id,
																			});
																			setIsAnnouncementModalOpen(true);
																		}}
																		variant="outline"
																		size="sm"
																		className="relative z-20 h-8 rounded-xl border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
																	>
																		Send Warning
																	</Button>
																)}
															</div>
														</div>
													</div>
												</div>

												{/* Row 2: Teachers */}
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
													<div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/50">
														<div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
															<IconUser className="w-6 h-6" />
														</div>
														<div>
															<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
																Scheduled Teacher
															</p>
															<p className="font-bold dark:text-white text-lg">
																{selectedSession.scheduledTeacher.name}
															</p>
														</div>
													</div>

													<div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/50 relative overflow-hidden">
														<div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
															<IconUserCheck className="w-6 h-6" />
														</div>
														<div>
															<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
																Actual Teacher
															</p>
															<p className="font-bold dark:text-white text-lg">
																{selectedSession.actualTeacher?.name || "N/A"}
															</p>
															{selectedSession.actualTeacher &&
																selectedSession.actualTeacher.id !==
																	selectedSession.scheduledTeacher.id && (
																	<span className="inline-block mt-1 px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[8px] font-black uppercase rounded-md">
																		Substitution
																	</span>
																)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Time Analysis Card */}
									<div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between shadow-sm relative overflow-hidden group">
										<div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
											<IconClock className="w-32 h-32" />
										</div>

										<div className="space-y-6">
											<div className="flex items-center justify-between">
												<h3 className="font-bold dark:text-white flex items-center gap-2">
													<IconClock className="w-5 h-5 text-blue-500" /> Time Metrics
												</h3>
												<div className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[9px] font-black uppercase tracking-widest text-neutral-500">
													{formatDate(selectedSession.scheduledStartTime)}
												</div>
											</div>

											<div className="space-y-4">
												<div className="space-y-2">
													<div className="flex justify-between items-center">
														<p className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">
															Scheduled
														</p>
														<span className="text-xs font-black text-blue-600 dark:text-blue-400">
															{selectedSession.scheduledDuration} MIN
														</span>
													</div>
													<div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 flex justify-between items-center">
														<span className="text-[11px] text-neutral-600 dark:text-neutral-300 font-bold tracking-tight">
															{formatTime(selectedSession.scheduledStartTime)}
														</span>
														<div className="w-6 h-px bg-neutral-200 dark:bg-neutral-600" />
														<span className="text-[11px] text-neutral-600 dark:text-neutral-300 font-bold tracking-tight">
															{formatTime(selectedSession.scheduledEndTime)}
														</span>
													</div>
												</div>

												<div className="space-y-2">
													<div className="flex justify-between items-center">
														<p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
															Actual
														</p>
														{selectedSession.actualDuration && (
															<span
																className={cn(
																	"text-xs font-black",
																	selectedSession.actualDuration > selectedSession.scheduledDuration
																		? "text-rose-600 dark:text-rose-400"
																		: "text-emerald-600 dark:text-emerald-400",
																)}
															>
																{selectedSession.actualDuration} MIN
															</span>
														)}
													</div>
													<div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 flex justify-between items-center">
														<span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold tracking-tight">
															{formatTime(selectedSession.actualStartTime)}
														</span>
														<div className="w-6 h-px bg-emerald-200 dark:bg-emerald-800" />
														<span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold tracking-tight">
															{formatTime(selectedSession.actualEndTime)}
														</span>
													</div>
												</div>
											</div>
										</div>

										<div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2 text-neutral-400">
													<IconHistory className="w-3.5 h-3.5" />
													<p className="text-[9px] font-bold uppercase tracking-widest">
														Session Log
													</p>
												</div>
												<span className="text-[10px] font-black text-neutral-300 dark:text-neutral-600">
													VERIFIED
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Stats Row */}
								<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
									{stats.map((stat, i) => (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: i * 0.1 }}
											key={stat.label}
											className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm group hover:border-blue-500/30 transition-all duration-300"
										>
											<div className="flex items-center gap-4">
												<div
													className={cn(
														"p-3 rounded-2xl group-hover:rotate-12 transition-transform duration-300",
														stat.bg,
													)}
												>
													<span className={stat.color}>{stat.icon}</span>
												</div>
												<div>
													<h3 className="text-xl font-black dark:text-white tracking-tight leading-none mb-1">
														{stat.value}
													</h3>
													<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
														{stat.label}
													</p>
												</div>
											</div>
										</motion.div>
									))}
								</div>

								{/* Student List Section */}
								{attendanceData && (
									<div className="space-y-6">
										<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
											<div className="space-y-1">
												<h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
													<IconUsers className="w-6 h-6 text-blue-500" /> Student Roll Call
												</h2>
												<p className="text-sm font-medium text-neutral-500">
													Showing {filteredStudents?.length} of {attendanceData.totalEnrolled}{" "}
													enrolled
												</p>
											</div>

											<div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
												<Select
													value={statusFilter}
													onValueChange={(val) =>
														setStatusFilter(val as "all" | "present" | "absent")
													}
												>
													<SelectTrigger className="w-full sm:w-40 h-12 rounded-2xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
														<SelectValue placeholder="Status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Students</SelectItem>
														<SelectItem value="present">Present Only</SelectItem>
														<SelectItem value="absent">Absent Only</SelectItem>
													</SelectContent>
												</Select>

												<div className="relative w-full sm:w-80">
													<IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
													<input
														type="text"
														placeholder="Search students..."
														className="w-full pl-11 pr-4 py-3 h-12 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition duration-300 text-sm font-medium"
														value={searchQuery}
														onChange={(e) => setSearchQuery(e.target.value)}
													/>
												</div>
											</div>
										</div>

										<div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden shadow-sm">
											<div className="overflow-x-auto">
												<table className="w-full text-sm text-left">
													<thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 font-bold uppercase text-[9px] tracking-[0.2em]">
														<tr>
															<th className="px-8 py-5">Student Information</th>
															<th className="px-8 py-5">Contact Details</th>
															<th className="px-8 py-5 text-center">Engagement Status</th>
															<th className="px-8 py-5">Duration Data</th>
															<th className="px-8 py-5 text-center">Actions</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
														{filteredStudents?.map((student) => {
															const isExpanded = expandedStudentId === student.studentId;
															return (
																<Fragment key={student.studentId}>
																	<tr
																		onClick={() =>
																			setExpandedStudentId(isExpanded ? null : student.studentId)
																		}
																		className={cn(
																			"group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition duration-150 cursor-pointer",
																			isExpanded && "bg-blue-50/20 dark:bg-blue-900/5",
																		)}
																	>
																		<td className="px-8 py-5">
																			<div className="flex items-center gap-4">
																				<div className="w-10 h-10 rounded-2xl bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center font-black text-neutral-600 dark:text-neutral-200 shadow-sm group-hover:scale-110 transition-transform">
																					{student.name.charAt(0)}
																				</div>
																				<div>
																					<p className="font-bold text-neutral-900 dark:text-white mb-0.5">
																						{student.name}
																					</p>
																					<p className="text-[10px] font-black text-neutral-400 tracking-widest">
																						ID #{student.studentId}
																					</p>
																				</div>
																			</div>
																		</td>
																		<td className="px-8 py-5">
																			<p className="font-medium text-neutral-600 dark:text-neutral-300">
																				{student.email}
																			</p>
																			<p className="text-[10px] font-bold text-neutral-400 mt-1">
																				{student.phone}
																			</p>
																		</td>
																		<td className="px-8 py-5">
																			<div className="flex justify-center">
																				<span
																					className={cn(
																						"px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest",
																						student.status === "PRESENT"
																							? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
																							: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]",
																					)}
																				>
																					{student.status.toUpperCase()}
																				</span>
																			</div>
																		</td>
																		<td className="px-8 py-5">
																			<div className="flex flex-col gap-2">
																				<span className="text-base font-black dark:text-white tracking-tight">
																					{student.totalDurationMin.toFixed(1)}{" "}
																					<span className="text-[10px] text-neutral-500 font-bold">
																						MIN
																					</span>
																				</span>
																				{(student.isEarlyLeave || student.isLateJoin) && (
																					<div className="flex gap-1">
																						{student.isLateJoin && (
																							<span className="text-[8px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-black italic">
																								LATE
																							</span>
																						)}
																						{student.isEarlyLeave && (
																							<span className="text-[8px] bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 px-1.5 py-0.5 rounded-md font-black italic">
																								EARLY
																							</span>
																						)}
																					</div>
																				)}
																			</div>
																		</td>
																		<td className="px-8 py-5">
																			<div className="flex justify-center items-center gap-3">
																				{student.status === "ABSENT" && (
																					<Button
																						onClick={(e: React.MouseEvent) => {
																							e.stopPropagation();
																							setAnnouncementTargetName(student.name);
																							setAnnouncementPayload({
																								title: "Missed Class Notification",
																								message: `Hi ${student.name}, you missed the class "${selectedSession.detail}". Please watch the recording and do the homework. Join the next class on time!`,
																								type: AnnouncementType.IMPORTANT,
																								audience: AnnouncementAudience.STUDENTS,
																								scope: AnnouncementScope.INDIVIDUAL,
																								userId: student.studentId,
																							});
																							setIsAnnouncementModalOpen(true);
																						}}
																						variant="outline"
																						size="sm"
																						className="h-8 rounded-xl border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
																					>
																						Notify
																					</Button>
																				)}
																				<div
																					className={cn(
																						"p-2 rounded-xl transition-colors",
																						isExpanded
																							? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
																							: "bg-neutral-100 text-neutral-400 dark:bg-neutral-900/50",
																					)}
																				>
																					{isExpanded ? (
																						<IconChevronUp className="w-5 h-5" />
																					) : (
																						<IconChevronDown className="w-5 h-5" />
																					)}
																				</div>
																			</div>
																		</td>
																	</tr>

																	<AnimatePresence>
																		{isExpanded && (
																			<tr>
																				<td colSpan={5} className="p-0 border-none">
																					<motion.div
																						initial={{ height: 0, opacity: 0 }}
																						animate={{ height: "auto", opacity: 1 }}
																						exit={{ height: 0, opacity: 0 }}
																						transition={{ duration: 0.3, ease: "easeInOut" }}
																						className="overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/20"
																					>
																						<div className="px-12 py-8 space-y-4">
																							<div className="flex items-center justify-between">
																								<h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
																									Attendance Intervals detail
																								</h4>
																								<span className="text-[10px] font-bold text-neutral-500 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
																									{student.intervals.length} Sessions detected
																								</span>
																							</div>

																							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
																								{student.intervals.map((interval, idx) => (
																									<div
																										// biome-ignore lint/suspicious/noArrayIndexKey: <static the index will not change>
																										key={idx}
																										className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
																									>
																										<div className="flex items-center justify-between">
																											<div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
																												<IconClock className="w-4 h-4" />
																											</div>
																											<span className="text-xs font-black text-blue-600 dark:text-blue-400">
																												{interval.durationMin.toFixed(1)} MIN
																											</span>
																										</div>
																										<div className="flex items-center justify-between text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
																											<div className="flex flex-col">
																												<span className="text-[8px] uppercase tracking-widest text-neutral-400 mb-0.5">
																													Joined
																												</span>
																												{formatTime(interval.joinTime)}
																											</div>
																											<div className="w-4 h-px bg-neutral-200 dark:bg-neutral-700" />
																											<div className="flex flex-col items-end">
																												<span className="text-[8px] uppercase tracking-widest text-neutral-400 mb-0.5">
																													Left
																												</span>
																												{formatTime(interval.leaveTime)}
																											</div>
																										</div>
																									</div>
																								))}
																								{student.intervals.length === 0 && (
																									<div className="col-span-full py-8 text-center text-neutral-400 italic text-sm">
																										No specific activity intervals recorded.
																									</div>
																								)}
																							</div>
																						</div>
																					</motion.div>
																				</td>
																			</tr>
																		)}
																	</AnimatePresence>
																</Fragment>
															);
														})}
													</tbody>
												</table>
											</div>
											{filteredStudents?.length === 0 && (
												<div className="p-20 text-center flex flex-col items-center gap-4">
													<div className="p-4 rounded-full bg-neutral-50 dark:bg-neutral-900">
														<IconSearch className="w-12 h-12 text-neutral-300" />
													</div>
													<p className="text-neutral-400 font-medium">
														No students found matching your filters
													</p>
												</div>
											)}
										</div>
									</div>
								)}
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

			<AnnouncementModal
				key={`${isAnnouncementModalOpen}-${announcementTargetName}`}
				isOpen={isAnnouncementModalOpen}
				onClose={() => setIsAnnouncementModalOpen(false)}
				initialPayload={announcementPayload}
				userName={announcementTargetName}
			/>
		</div>
	);
}
