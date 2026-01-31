import { IconArrowLeft, IconSchool, IconUserCheck } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { AnnouncementModal } from "@/components/admin/Attendance/AnnouncementModal";
import { AttendanceFilters } from "@/components/admin/Attendance/AttendanceFilters";
import { AttendanceStats } from "@/components/admin/Attendance/AttendanceStats";
import { AttendanceTable } from "@/components/admin/Attendance/AttendanceTable";
import { LiveAnalytics } from "@/components/admin/Attendance/LiveAnalytics";
import { SessionDetailHeader } from "@/components/admin/Attendance/SessionDetailHeader";
import { SessionFilters } from "@/components/admin/Attendance/SessionFilters";
import { SessionList } from "@/components/admin/Attendance/SessionList";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCoursesByGrade,
	useMarkAsSisyaEmp,
	useSessionAttendance,
	useSessionsByCourse,
} from "@/hooks/analytics/useAttendance";
import type { CreateAnnouncementPayload } from "@/types/announcement";

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
	const [sessionSearch, setSessionSearch] = useState("");
	const [sessionStartDate, setSessionStartDate] = useState("");
	const [sessionEndDate, setSessionEndDate] = useState("");

	// Context Menu & Confirmation State
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		studentId: number;
		studentName: string;
	} | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [selectedStudentForEmp, setSelectedStudentForEmp] = useState<{
		id: number;
		name: string;
	} | null>(null);

	const { mutate: markAsEmp, isPending: isMarkingEmp } = useMarkAsSisyaEmp();

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
		sessionStartDate,
		sessionEndDate,
		sessionSearch,
	);
	const { data: attendanceData } = useSessionAttendance(selectedSessionId);

	const selectedSession = useMemo(() => {
		return sessionsData?.sessions.find((s) => s.id === selectedSessionId);
	}, [sessionsData, selectedSessionId]);

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

	const handleSendAnnouncement = (
		payload: Partial<CreateAnnouncementPayload>,
		targetName: string,
	) => {
		setAnnouncementPayload(payload);
		setAnnouncementTargetName(targetName);
		setIsAnnouncementModalOpen(true);
	};

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
						{!selectedSessionId ? (
							<>
								<AttendanceFilters
									selectedGrade={selectedGrade}
									onGradeChange={(val) => {
										setSelectedGrade(val);
										setSelectedCourseId(null);
										setCurrentPage(1);
									}}
									selectedCourseId={selectedCourseId}
									onCourseChange={(val) => {
										setSelectedCourseId(val);
										setCurrentPage(1);
									}}
									coursesData={coursesData}
									isLoadingCourses={isLoadingCourses}
								/>

								{selectedCourseId ? (
									<div className="space-y-6">
										<SessionFilters
											search={sessionSearch}
											onSearchChange={(val) => {
												setSessionSearch(val);
												setCurrentPage(1);
											}}
											startDate={sessionStartDate}
											onStartDateChange={(val) => {
												setSessionStartDate(val);
												setCurrentPage(1);
											}}
											endDate={sessionEndDate}
											onEndDateChange={(val) => {
												setSessionEndDate(val);
												setCurrentPage(1);
											}}
											onClear={() => {
												setSessionSearch("");
												setSessionStartDate("");
												setSessionEndDate("");
												setCurrentPage(1);
											}}
										/>
										<SessionList
											sessionsData={sessionsData}
											isLoadingSessions={isLoadingSessions}
											onSessionSelect={setSelectedSessionId}
											currentPage={currentPage}
											onPageChange={setCurrentPage}
										/>
									</div>
								) : (
									!selectedGrade && (
										<div className="h-64 flex flex-col items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/20 transition-colors">
											<IconSchool className="w-16 h-16 mb-4 opacity-10" />
											<p className="font-medium">Select a grade and course to browse sessions</p>
										</div>
									)
								)}
							</>
						) : (
							selectedSession && (
								<div className="space-y-8">
									<SessionDetailHeader
										selectedSession={selectedSession}
										onSendAnnouncement={handleSendAnnouncement}
									/>

									{attendanceData && (
										<>
											<AttendanceStats attendanceData={attendanceData} />
											<AttendanceTable
												attendanceData={attendanceData}
												filteredStudents={filteredStudents}
												statusFilter={statusFilter}
												setStatusFilter={setStatusFilter}
												searchQuery={searchQuery}
												setSearchQuery={setSearchQuery}
												expandedStudentId={expandedStudentId}
												setExpandedStudentId={setExpandedStudentId}
												selectedSession={selectedSession}
												onSendAnnouncement={handleSendAnnouncement}
												setContextMenu={setContextMenu}
											/>
										</>
									)}
								</div>
							)
						)}
					</motion.div>
				) : (
					<LiveAnalytics />
				)}
			</AnimatePresence>

			<AnnouncementModal
				key={`${isAnnouncementModalOpen}-${announcementTargetName}`}
				isOpen={isAnnouncementModalOpen}
				onClose={() => setIsAnnouncementModalOpen(false)}
				initialPayload={announcementPayload}
				userName={announcementTargetName}
			/>

			{/* Context Menu */}
			<AnimatePresence>
				{contextMenu && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						style={{ top: contextMenu.y, left: contextMenu.x }}
						className="fixed z-100 min-w-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 p-1.5 shadow-2xl backdrop-blur-xl dark:border-neutral-700 dark:bg-neutral-800/80"
					>
						<button
							type="button"
							onClick={() => {
								setSelectedStudentForEmp({
									id: contextMenu.studentId,
									name: contextMenu.studentName,
								});
								setIsConfirmModalOpen(true);
								setContextMenu(null);
							}}
							className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/50"
						>
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
								<IconUserCheck className="h-4 w-4" />
							</div>
							Mark as Sisya Employee
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			<ConfirmationModal
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				onConfirm={() => {
					if (selectedStudentForEmp) {
						markAsEmp(selectedStudentForEmp.id, {
							onSuccess: () => {
								setIsConfirmModalOpen(false);
								setSelectedStudentForEmp(null);
							},
						});
					}
				}}
				isLoading={isMarkingEmp}
				title="Mark as Sisya Employee"
				message={`Are you sure you want to mark ${selectedStudentForEmp?.name} as a Sisya employee? Once marked, they will not appear in any grade roll call.`}
				confirmText="Mark as Employee"
				variant="info"
			/>

			{/* Close context menu on click outside */}
			{contextMenu && (
				<button
					type="button"
					aria-label="Close context menu"
					className="fixed inset-0 z-50"
					onClick={() => setContextMenu(null)}
					onContextMenu={(e) => {
						e.preventDefault();
						setContextMenu(null);
					}}
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === "Enter" || e.key === " " || e.key === "Spacebar" || e.key === "Escape") {
							e.preventDefault();
							setContextMenu(null);
						}
					}}
				/>
			)}
		</div>
	);
}
