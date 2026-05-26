// biome-ignore-all lint/suspicious/noExplicitAny: used

import {
	IconArrowLeft,
	IconBook,
	IconBroadcast,
	IconChevronDown,
	IconChevronRight,
	IconClock,
	IconExternalLink,
	IconMessageCircle,
	IconRadio,
	IconRefresh,
	IconSchool,
	IconUsers,
	IconUserX,
	IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { LiveChat } from "@/components/admin/Attendance/LiveChat";
import { PiPWindow } from "@/components/shared/PiPWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GRADES } from "@/constants";
import {
	useCoursesByGrade,
	useEnrolledStudentsByCourse,
	useLiveSessionStudents,
} from "@/hooks/analytics/useAttendance";
import { useAttendanceWasm } from "@/hooks/analytics/useAttendanceWasm";
import { type ChatMessage, useLiveAttendance } from "@/hooks/analytics/useLiveAttendance";
import { useOngoingSessionsByCourse } from "@/hooks/analytics/useOngoingSessions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import type { LiveSessionStudent, OngoingSessionByCourse, Student } from "@/types/performance";

const STORAGE_KEY = "live-status-state";

const SyncStudentItem = ({
	student,
	isExpanded,
	onToggle,
	isLeft = false,
	lastLeft,
}: {
	student: LiveSessionStudent & { lastLeft?: number };
	isExpanded: boolean;
	onToggle: () => void;
	isLeft?: boolean;
	lastLeft?: number;
}) => {
	const lastLeftDate = lastLeft ? new Date(lastLeft) : null;

	return (
		<>
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
			>
				<div className="flex items-center gap-4">
					<div
						className={cn(
							"w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border",
							isLeft
								? "bg-rose-50 dark:bg-rose-900/20 text-rose-500 border-rose-100/50 dark:border-rose-800/30"
								: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 border-emerald-100/50 dark:border-emerald-800/30",
						)}
					>
						{student.userName.charAt(0).toUpperCase()}
					</div>
					<div className="flex flex-col text-left">
						<span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
							{student.userName}
						</span>
						<div className="flex items-center gap-2 mt-0.5">
							<span
								className={cn(
									"text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1",
									isLeft ? "text-rose-500" : "text-emerald-500",
								)}
							>
								<div
									className={cn(
										"w-1.5 h-1.5 rounded-full",
										isLeft ? "bg-rose-500" : "bg-emerald-500",
									)}
								/>{" "}
								{isLeft ? "Disconnected" : "Synced"}
							</span>
							{isLeft && lastLeftDate && (
								<span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
									<IconClock className="w-2.5 h-2.5" />
									Left:{" "}
									{lastLeftDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
								</span>
							)}
							{!isLeft && student.intervalCount > 1 && (
								<span className="text-[10px] text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
									{student.intervalCount} Sessions
								</span>
							)}
							{student.homeworkDone && (
								<span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded flex items-center gap-1">
									<IconBook className="w-3 h-3" /> HW
								</span>
							)}
						</div>
					</div>
				</div>
				<IconChevronDown
					className={cn(
						"w-5 h-5 text-neutral-400 transition-transform duration-300",
						isExpanded && "rotate-180",
					)}
				/>
			</button>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50"
					>
						<div className="p-4 space-y-3">
							<span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1">
								Connection History
							</span>
							<div className="space-y-2">
								{[...student.intervals].reverse().map((interval, idx) => {
									const joinDate = new Date(interval.joinTime);
									const leaveDate = interval.leaveTime ? new Date(interval.leaveTime) : null;

									return (
										<div
											key={`${student.userID}-${idx}`}
											className="flex items-center justify-between bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-sm"
										>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
													<IconClock className="w-4 h-4 text-neutral-500" />
												</div>
												<div className="flex flex-col">
													<span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
														Session {student.intervals.length - idx}
													</span>
													<div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
														<span className="text-emerald-600 dark:text-emerald-400">
															{joinDate.toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</span>
														<span>→</span>
														{leaveDate ? (
															<span className="text-rose-500 dark:text-rose-400">
																{leaveDate.toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit",
																})}
															</span>
														) : (
															<span className="text-emerald-500 italic">Active</span>
														)}
													</div>
												</div>
											</div>
											{leaveDate && (
												<span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-500 px-2 py-1 rounded-md">
													{Math.round((leaveDate.getTime() - interval.joinTime) / 60000)}m
												</span>
											)}
										</div>
									);
								})}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

const loadPersistedState = () => {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch {}
	return null;
};

const persistState = (state: {
	grade?: string | null;
	courseId?: number | null;
	session?: OngoingSessionByCourse | null;
}) => {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
};

export const LiveStatus = () => {
	const saved = loadPersistedState();
	const [selectedGrade, setSelectedGrade] = useState<string | null>(saved?.grade || null);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(saved?.courseId || null);
	const [activeSession, setActiveSession] = useState<OngoingSessionByCourse | null>(
		saved?.session || null,
	);

	const { role, gradePermissions } = useAuthStore();

	const filteredGrades =
		role === "subadmin" && gradePermissions
			? GRADES.filter((g) => gradePermissions.includes(Number.parseInt(g, 10)))
			: GRADES;

	// Data Fetching
	const { data: coursesData, isLoading: isLoadingCourses } = useCoursesByGrade(selectedGrade);
	const { data: ongoingSessions, isLoading: isLoadingSessions } =
		useOngoingSessionsByCourse(selectedCourseId);

	// Persist on changes
	useEffect(() => {
		persistState({ grade: selectedGrade, courseId: selectedCourseId, session: activeSession });
	}, [selectedGrade, selectedCourseId, activeSession]);

	const handleBack = () => {
		setActiveSession(null);
	};

	return (
		<div className="space-y-8">
			<AnimatePresence mode="wait">
				{activeSession ? (
					<LiveSessionMonitoring key="details" session={activeSession} onBack={handleBack} />
				) : (
					<motion.div
						key="selection"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="space-y-8"
					>
						{/* Selection Bar */}
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
									}}
								>
									<SelectTrigger className="w-full h-12 rounded-xl">
										<SelectValue placeholder="Which grade?" />
									</SelectTrigger>
									<SelectContent>
										{filteredGrades.map((g) => (
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
									onValueChange={(val) => setSelectedCourseId(Number(val))}
								>
									<SelectTrigger className="w-full h-12 rounded-xl">
										<SelectValue placeholder={isLoadingCourses ? "Loading..." : "Which course?"} />
									</SelectTrigger>
									<SelectContent>
										{coursesData?.courses.map((course) => (
											<SelectItem key={course.id} value={course.id.toString()}>
												{course.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Ongoing Sessions List */}
						<div className="space-y-4">
							<div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
								<h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
									<IconBroadcast className="w-6 h-6 text-rose-500" /> Active in Selected Course
								</h2>
								<span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 rounded-full">
									{ongoingSessions?.length || 0} active
								</span>
							</div>

							{!selectedCourseId ? (
								<div className="h-64 rounded-[40px] bg-neutral-50/30 dark:bg-neutral-900/10 border-2 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center text-center p-12 gap-4">
									<IconBook className="w-12 h-12 text-neutral-300" />
									<p className="text-neutral-500 font-medium max-w-xs">
										Please select a grade and course to monitor live classroom sessions.
									</p>
								</div>
							) : isLoadingSessions ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="h-48 rounded-3xl bg-neutral-50 dark:bg-neutral-800 animate-pulse border border-neutral-100 dark:border-neutral-700"
										/>
									))}
								</div>
							) : !ongoingSessions || ongoingSessions.length === 0 ? (
								<div className="h-80 rounded-[40px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center p-12 gap-6 group shadow-lg shadow-neutral-500/5">
									<div className="w-20 h-20 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
										<IconBroadcast className="w-10 h-10 text-neutral-200" />
									</div>
									<div>
										<h3 className="text-xl font-bold dark:text-white mb-2">No Ongoing Classes</h3>
										<p className="text-neutral-500 max-w-sm">
											There are currently no active sessions for this course. Try selecting another
											course or grade.
										</p>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{ongoingSessions?.map((session) => (
										<motion.button
											key={session.id}
											whileHover={{ y: -8, scale: 1.01 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setActiveSession(session)}
											className="group relative flex flex-col p-8 rounded-[36px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 text-left"
										>
											<div className="flex justify-between items-start mb-6">
												<div className="flex flex-col gap-1">
													<p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-rose-500 transition-colors">
														Session Active
													</p>
													<h3 className="text-xl font-bold dark:text-white leading-tight">
														{session.detail}
													</h3>
												</div>
												<div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 group-hover:rotate-12 transition-transform duration-500">
													<IconRadio className="w-6 h-6 animate-pulse" />
												</div>
											</div>

											<div className="space-y-4 mb-8">
												<div className="flex items-center gap-3 text-neutral-500">
													<IconSchool className="w-4 h-4" />
													<span className="text-sm font-medium">{session.mentor.name}</span>
												</div>
												<div className="flex items-center gap-3 text-neutral-500">
													<IconUsers className="w-4 h-4" />
													<span className="text-sm font-medium">Live Monitoring</span>
												</div>
											</div>

											<div className="mt-auto pt-6 border-t border-neutral-50 dark:border-neutral-700/50 flex items-center justify-between">
												<span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
													Ref ID: #{session.id}
												</span>
												<div className="px-4 py-2 rounded-xl bg-rose-500 text-sm font-bold text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
													Monitor <IconChevronRight className="w-4 h-4" />
												</div>
											</div>
										</motion.button>
									))}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const LiveSessionMonitoring = ({
	session,
	onBack,
}: {
	session: OngoingSessionByCourse;
	onBack: () => void;
}) => {
	const { students, isConnected, status, messages, sendMessage } = useLiveAttendance(
		session.id,
		session.vmIp || undefined,
	);
	console.log(students);
	const { data: polledData, refetch, isRefetching } = useLiveSessionStudents(session.id);
	const { processStudents, computeAbsentStudents } = useAttendanceWasm();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [syncTab, setSyncTab] = useState<"joined" | "left" | "absent">("joined");
	const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
	const [isPipOpen, setIsPipOpen] = useState(false);
	const [selectedCourseId] = useState<number | null>(() => {
		const raw = sessionStorage.getItem("live-status-state");
		return raw ? JSON.parse(raw).courseId : null;
	});

	const { joinedStudents, leftStudents } = useMemo(() => {
		const result = processStudents(polledData?.students);
		return {
			joinedStudents: result.joinedStudents,
			leftStudents: [...result.leftStudents].sort((a, b) => b.lastLeft - a.lastLeft),
		};
	}, [polledData?.students, processStudents]);

	const { data: enrolledData } = useEnrolledStudentsByCourse(
		session.id > 0 ? selectedCourseId : null,
	);

	// Compute absent students: enrolled list minus joined (present) students — via WASM memory buffers
	const { absentStudents } = useMemo(
		() => computeAbsentStudents(enrolledData?.students, joinedStudents),
		[enrolledData?.students, joinedStudents, computeAbsentStudents],
	);

	const toggleStudent = (id: string) => {
		setExpandedStudentId((prev) => (prev === id ? null : id));
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6"
		>
			{/* Compact Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onBack}
						className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
					>
						<IconArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
					</button>
					<div>
						<h2 className="text-lg font-bold dark:text-white leading-tight">{session.detail}</h2>
						<p className="text-xs text-neutral-400 mt-0.5">
							{session.subject.name} · {session.mentor.name} · #{session.id}
						</p>
					</div>
				</div>
				<div className="flex flex-col items-end gap-2">
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
						<div
							className={cn(
								"w-2 h-2 rounded-full",
								isConnected ? "bg-emerald-500 animate-pulse" : "bg-neutral-300",
							)}
						/>
						<span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
							{isConnected
								? "Connected"
								: status === "connecting"
									? "Connecting..."
									: "Disconnected"}
						</span>
					</div>
					<button
						type="button"
						onClick={() => setIsPipOpen(true)}
						className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
					>
						<IconExternalLink className="w-3.5 h-3.5" />
						Pop-out PIP Monitor
					</button>
				</div>
			</div>

			<PiPWindow isOpen={isPipOpen} onClose={() => setIsPipOpen(false)}>
				<PiPView
					students={students.map((s) => ({ ...s, id: s.id.toString() }))}
					messages={messages}
					sendMessage={sendMessage}
					isConnected={isConnected}
					joinedStudents={joinedStudents}
					leftStudents={leftStudents}
					absentStudents={absentStudents}
					refetch={refetch}
					isRefetching={isRefetching}
					sessionDetail={session.detail}
				/>
			</PiPWindow>

			{/* Two Column: Participants + Chat */}
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				{/* Participants — wider */}
				<div className="lg:col-span-3">
					<div className="rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
						<div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
							<div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
								<IconUsers className="w-4 h-4 text-blue-500" /> Participants
							</div>
							<div className="flex items-center gap-3">
								<span className="text-xs font-medium text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 rounded-md">
									{students.length}
								</span>
								<button
									type="button"
									onClick={() => setIsSheetOpen(true)}
									className="text-xs font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
								>
									<IconRefresh className="w-3.5 h-3.5" />
									View Server Sync
									{absentStudents.length > 0 && (
										<span className="ml-1 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-black">
											{absentStudents.length} absent
										</span>
									)}
								</button>
							</div>
						</div>
						<div className="max-h-[520px] overflow-y-auto">
							{students.length === 0 ? (
								<div className="py-20 flex flex-col items-center justify-center text-center gap-2">
									<IconUsers className="w-10 h-10 text-neutral-200 dark:text-neutral-600" />
									<p className="text-sm text-neutral-400">Waiting for participants...</p>
								</div>
							) : (
								<div className="divide-y divide-neutral-50 dark:divide-neutral-700/30">
									{students.map((student) => (
										<div
											key={student.id}
											className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/20 transition-colors"
										>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-sm font-bold">
													{student.name.charAt(0).toUpperCase()}
												</div>
												<span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
													{student.name}
												</span>
											</div>
											<div className="flex items-center gap-1.5">
												<div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
												<span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
													Online
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Live Attendance Sheet overlay */}
				<AnimatePresence>
					{isSheetOpen && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setIsSheetOpen(false)}
								className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
							/>
							<motion.div
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}
								transition={{ type: "spring", damping: 25, stiffness: 200 }}
								className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 flex flex-col"
							>
								<div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
											<IconUsers className="w-5 h-5 text-emerald-500" />
										</div>
										<div>
											<h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 leading-none mb-1">
												Live Server Sync
											</h3>
											<p className="text-xs text-neutral-500">Polled backend attendance</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => refetch()}
											disabled={isRefetching}
											className={cn(
												"p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-sm",
												isRefetching && "opacity-50",
											)}
										>
											<IconRefresh
												className={cn(
													"w-4 h-4 text-neutral-600 dark:text-neutral-300",
													isRefetching && "animate-spin",
												)}
											/>
										</button>
										<button
											type="button"
											onClick={() => setIsSheetOpen(false)}
											className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-colors bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-sm"
										>
											<IconX className="w-4 h-4" />
										</button>
									</div>
								</div>

								<div className="flex-1 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-900/30 flex flex-col">
									{/* Tab Switcher */}
									<div className="px-4 pt-4 shrink-0">
										<div className="flex p-1 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm relative overflow-hidden">
											<button
												type="button"
												onClick={() => setSyncTab("joined")}
												className={cn(
													"flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-all relative z-10",
													syncTab === "joined"
														? "text-blue-600 dark:text-blue-400"
														: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
												)}
											>
												<IconUsers className="w-4 h-4" />
												Joined
												<span
													className={cn(
														"px-1.5 py-0.5 rounded-md text-[10px]",
														syncTab === "joined"
															? "bg-blue-100 dark:bg-blue-900/40"
															: "bg-neutral-100 dark:bg-neutral-900",
													)}
												>
													{joinedStudents.length}
												</span>
											</button>
											<button
												type="button"
												onClick={() => setSyncTab("left")}
												className={cn(
													"flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-all relative z-10",
													syncTab === "left"
														? "text-rose-500 dark:text-rose-400"
														: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
												)}
											>
												<IconClock className="w-4 h-4" />
												Left
												<span
													className={cn(
														"px-1.5 py-0.5 rounded-md text-[10px]",
														syncTab === "left"
															? "bg-rose-100 dark:bg-rose-900/40"
															: "bg-neutral-100 dark:bg-neutral-900",
													)}
												>
													{leftStudents.length}
												</span>
											</button>
											<button
												type="button"
												onClick={() => setSyncTab("absent")}
												className={cn(
													"flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-all relative z-10",
													syncTab === "absent"
														? "text-amber-600 dark:text-amber-400"
														: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
												)}
											>
												<IconUserX className="w-4 h-4" />
												Absent
												<span
													className={cn(
														"px-1.5 py-0.5 rounded-md text-[10px]",
														syncTab === "absent"
															? "bg-amber-100 dark:bg-amber-900/40"
															: "bg-neutral-100 dark:bg-neutral-900",
													)}
												>
													{absentStudents.length}
												</span>
											</button>
											<motion.div
												layoutId="syncTabIndicator"
												className={cn(
													"absolute inset-y-1 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700 shadow-sm",
													syncTab === "joined"
														? "left-1"
														: syncTab === "left"
															? "left-1/3"
															: "left-2/3",
												)}
												style={{ width: "calc(33.333% - 4px)" }}
												transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
											/>
										</div>
									</div>

									<div className="flex-1 overflow-y-auto p-4 space-y-2">
										<div className="flex items-center justify-between mb-2">
											<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
												{syncTab === "joined"
													? "Synced Students"
													: syncTab === "left"
														? "Disconnected Students"
														: "Absent Students"}
											</span>
											<button
												type="button"
												onClick={() => refetch()}
												disabled={isRefetching}
												className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md"
											>
												<IconRefresh
													className={cn("w-3 h-3 text-neutral-500", isRefetching && "animate-spin")}
												/>
											</button>
										</div>

										{syncTab === "absent" ? (
											absentStudents.length === 0 ? (
												<div className="py-12 flex flex-col items-center text-center opacity-50">
													<IconUserX className="w-8 h-8 text-amber-400 mb-2" />
													<p className="text-xs font-medium">All students present!</p>
												</div>
											) : (
												<div className="space-y-2">
													{absentStudents.map((student) => (
														<div
															key={student.id}
															className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-xl border border-amber-100 dark:border-amber-900/30"
														>
															<div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
																{student.name.charAt(0).toUpperCase()}
															</div>
															<div className="flex flex-col flex-1 min-w-0">
																<span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
																	{student.name}
																</span>
																<span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
																	Phone Number: {student.phone}
																</span>
															</div>
														</div>
													))}
												</div>
											)
										) : (syncTab === "joined" ? joinedStudents : leftStudents).length === 0 ? (
											<div className="py-12 flex flex-col items-center text-center opacity-50">
												{syncTab === "joined" ? (
													<IconUsers className="w-8 h-8 text-neutral-400 mb-2" />
												) : (
													<IconClock className="w-8 h-8 text-neutral-400 mb-2" />
												)}
												<p className="text-xs font-medium">
													{syncTab === "joined" ? "No server data" : "No students left"}
												</p>
											</div>
										) : (
											<div className="space-y-2">
												{(syncTab === "joined" ? joinedStudents : leftStudents).map((student) => {
													const isExpanded = expandedStudentId === student.userID;
													return (
														<div
															key={student.userID}
															className={cn(
																"bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden",
																syncTab === "left" && "opacity-80 grayscale",
															)}
														>
															<SyncStudentItem
																student={student}
																isExpanded={isExpanded}
																onToggle={() => toggleStudent(student.userID)}
																isLeft={syncTab === "left"}
																lastLeft={(student as any).lastLeft}
															/>
														</div>
													);
												})}
											</div>
										)}
									</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>

				{/* Chat — narrower */}
				<div className="lg:col-span-2">
					<LiveChat messages={messages} onSend={sendMessage} isConnected={isConnected} />
				</div>
			</div>
		</motion.div>
	);
};

interface PiPViewProps {
	students: { id: string; name: string }[];
	messages: ChatMessage[];
	sendMessage: (msg: string) => void;
	isConnected: boolean;
	joinedStudents: LiveSessionStudent[];
	leftStudents: (LiveSessionStudent & { lastLeft: number })[];
	absentStudents: Student[];
	refetch: () => void;
	isRefetching: boolean;
	sessionDetail: string;
}

const PiPView = ({
	students,
	messages,
	sendMessage,
	isConnected,
	joinedStudents,
	leftStudents,
	absentStudents,
	refetch,
	isRefetching,
	sessionDetail,
}: PiPViewProps) => {
	const [activeTab, setActiveTab] = useState<"participants" | "chat" | "server">("participants");
	const [syncTab, setSyncTab] = useState<"joined" | "left" | "absent">("joined");
	const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

	const toggleStudent = (id: string) => {
		setExpandedStudentId((prev) => (prev === id ? null : id));
	};

	return (
		<div className="flex flex-col h-[100vh] bg-neutral-50 dark:bg-neutral-900 border-none">
			{/* Top Bar */}
			<div className="px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
				<h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate">
					{sessionDetail}
				</h3>
				<div className="flex items-center gap-2 mt-1">
					<div
						className={cn(
							"w-1.5 h-1.5 rounded-full",
							isConnected ? "bg-emerald-500 animate-pulse" : "bg-neutral-300",
						)}
					/>
					<span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
						{isConnected ? "Live Connected" : "Connecting..."}
					</span>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex px-2 pt-2 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 gap-1 shrink-0 overflow-x-auto">
				<button
					type="button"
					onClick={() => setActiveTab("participants")}
					className={cn(
						"px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap",
						activeTab === "participants"
							? "border-blue-500 text-blue-600 dark:text-blue-400"
							: "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
					)}
				>
					<IconUsers className="w-4 h-4" /> Participants ({students.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("chat")}
					className={cn(
						"px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap",
						activeTab === "chat"
							? "border-blue-500 text-blue-600 dark:text-blue-400"
							: "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
					)}
				>
					<IconMessageCircle className="w-4 h-4" /> Chat
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("server")}
					className={cn(
						"px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap",
						activeTab === "server"
							? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
							: "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
					)}
				>
					<IconRefresh className="w-4 h-4" /> Server Sync
					{absentStudents.length > 0 && (
						<span className="ml-0.5 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-black">
							{absentStudents.length}
						</span>
					)}
				</button>
			</div>

			{/* Content Area */}
			<div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-900/50">
				{activeTab === "participants" && (
					<div className="h-full overflow-y-auto p-4">
						{students.length === 0 ? (
							<div className="py-12 flex flex-col items-center text-center opacity-50">
								<IconUsers className="w-8 h-8 text-neutral-400 mb-2" />
								<p className="text-sm font-medium">No participants yet</p>
							</div>
						) : (
							<div className="space-y-2">
								{students.map((student) => (
									<div
										key={student.id}
										className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-sm font-bold">
												{student.name.charAt(0).toUpperCase()}
											</div>
											<span className="text-sm font-medium dark:text-neutral-200">
												{student.name}
											</span>
										</div>
										<div className="flex items-center gap-1.5">
											<div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
											<span className="text-[10px] text-emerald-600">Active</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "chat" && (
					<div className="h-full relative overflow-hidden flex flex-col [&>div]:h-full [&>div]:shadow-none [&>div]:border-none [&>div]:rounded-none">
						<LiveChat messages={messages} onSend={sendMessage} isConnected={isConnected} />
					</div>
				)}

				{activeTab === "server" && (
					<div className="h-full overflow-y-auto flex flex-col">
						<div className="px-4 pt-4 shrink-0">
							<div className="flex p-1 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm relative overflow-hidden">
								<button
									type="button"
									onClick={() => setSyncTab("joined")}
									className={cn(
										"flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold transition-all relative z-10",
										syncTab === "joined"
											? "text-blue-600 dark:text-blue-400"
											: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
									)}
								>
									Joined ({joinedStudents.length})
								</button>
								<button
									type="button"
									onClick={() => setSyncTab("left")}
									className={cn(
										"flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold transition-all relative z-10",
										syncTab === "left"
											? "text-rose-500 dark:text-rose-400"
											: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
									)}
								>
									Left ({leftStudents.length})
								</button>
								<button
									type="button"
									onClick={() => setSyncTab("absent")}
									className={cn(
										"flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold transition-all relative z-10",
										syncTab === "absent"
											? "text-amber-600 dark:text-amber-400"
											: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
									)}
								>
									Absent ({absentStudents.length})
								</button>
								<motion.div
									className={cn(
										"absolute inset-y-1 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700 shadow-sm",
										syncTab === "joined" ? "left-1" : syncTab === "left" ? "left-1/3" : "left-2/3",
									)}
									style={{ width: "calc(33.333% - 4px)" }}
								/>
							</div>
						</div>

						<div className="flex-1 overflow-y-auto p-4 space-y-2">
							<div className="flex items-center justify-between mb-2">
								<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
									{syncTab === "joined"
										? "Synced Students"
										: syncTab === "left"
											? "Disconnected Students"
											: "Absent Students"}
								</span>
								<button
									type="button"
									onClick={() => refetch()}
									disabled={isRefetching}
									className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md"
								>
									<IconRefresh
										className={cn("w-3 h-3 text-neutral-500", isRefetching && "animate-spin")}
									/>
								</button>
							</div>

							{syncTab === "absent" ? (
								absentStudents.length === 0 ? (
									<div className="py-12 flex flex-col items-center text-center opacity-50">
										<IconUserX className="w-8 h-8 text-amber-400 mb-2" />
										<p className="text-xs font-medium">All students present!</p>
									</div>
								) : (
									<div className="space-y-2">
										{absentStudents.map((student) => (
											<div
												key={student.id}
												className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-xl border border-amber-100 dark:border-amber-900/30"
											>
												<div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
													{student.name.charAt(0).toUpperCase()}
												</div>
												<div className="flex flex-col flex-1 min-w-0">
													<span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
														{student.name}
													</span>
													<span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
														Phone Number: {student.phone}
													</span>
												</div>
											</div>
										))}
									</div>
								)
							) : (syncTab === "joined" ? joinedStudents : leftStudents).length === 0 ? (
								<div className="py-12 flex flex-col items-center text-center opacity-50">
									{syncTab === "joined" ? (
										<IconUsers className="w-8 h-8 text-neutral-400 mb-2" />
									) : (
										<IconClock className="w-8 h-8 text-neutral-400 mb-2" />
									)}
									<p className="text-xs font-medium">
										{syncTab === "joined" ? "No server data" : "No students left"}
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{(syncTab === "joined" ? joinedStudents : leftStudents).map((student) => {
										const isExpanded = expandedStudentId === student.userID;
										return (
											<div
												key={student.userID}
												className={cn(
													"bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden",
													syncTab === "left" && "opacity-80 grayscale",
												)}
											>
												<SyncStudentItem
													student={student}
													isExpanded={isExpanded}
													onToggle={() => toggleStudent(student.userID)}
													isLeft={syncTab === "left"}
													lastLeft={(student as any).lastLeft}
												/>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
