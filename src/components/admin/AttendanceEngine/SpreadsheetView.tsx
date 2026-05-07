import { IconEdit, IconHistory, IconUserPlus, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import type { AttendanceEngineSheet, EngagementLog } from "@/api/attendanceEngine";
import { Button } from "@/components/ui/button";
import {
	useAddEngagementLog,
	useEngagementLogs,
	useUpdateAttendanceRemarks,
	useUpdateStudentOnboarding,
} from "@/hooks/admin/useAttendanceEngine";
import { cn } from "@/lib/utils";

type Student = AttendanceEngineSheet["students"][number];
type Session = Student["sessions"][number];

interface SpreadsheetViewProps {
	sheet: AttendanceEngineSheet;
	sessionOrder: "newest" | "oldest";
	searchQuery: string;
	currentMatch: { studentId: number; type: "name" | "phone" } | null;
	targetDate: string | null;
}

export const SpreadsheetView = ({
	sheet,
	sessionOrder,
	searchQuery,
	currentMatch,
	targetDate,
}: SpreadsheetViewProps) => {
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [selectedSession, setSelectedSession] = useState<Session | null>(null);
	const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
	const [isLogModalOpen, setIsLogModalOpen] = useState(false);
	const [isLogsViewModalOpen, setIsLogsViewModalOpen] = useState(false);

	const updateRemarks = useUpdateAttendanceRemarks();
	const updateOnboarding = useUpdateStudentOnboarding();
	const addLog = useAddEngagementLog();

	const isMatching = (text: string) => {
		if (!searchQuery) return false;
		return text.toLowerCase().includes(searchQuery.toLowerCase());
	};

	const isActiveMatch = (studentId: number, type: "name" | "phone") => {
		return currentMatch?.studentId === studentId && currentMatch?.type === type;
	};

	// Scroll active match into view
	useEffect(() => {
		if (currentMatch) {
			// Small delay to ensure DOM is updated with highlight classes
			const timer = setTimeout(() => {
				const activeElement = document.querySelector(".ae-active-match");
				if (activeElement) {
					activeElement.scrollIntoView({
						behavior: "smooth",
						block: "nearest",
					});
				}
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [currentMatch]);

	// Scroll target date into view
	useEffect(() => {
		if (targetDate) {
			const dateStr = new Date(targetDate).toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
			});
			const dateHeaders = document.querySelectorAll(".ae-date-header");
			const targetHeader = Array.from(dateHeaders).find((h) => h.textContent?.trim() === dateStr);

			if (targetHeader) {
				targetHeader.scrollIntoView({
					behavior: "smooth",
					inline: "center",
					block: "nearest",
				});
			}
		}
	}, [targetDate]);

	// Sort sessions once for reuse in headers and body
	const sortedSessions = React.useMemo(() => {
		const sessions = [...sheet.sessions];
		if (sessionOrder === "newest") {
			return sessions.reverse();
		}
		return sessions;
	}, [sheet.sessions, sessionOrder]);

	const handleCellClick = (student: Student, session: Session) => {
		setSelectedStudent(student);
		setSelectedSession(session);
		setIsRemarksModalOpen(true);
	};

	const handleOnboardingToggle = (student: Student) => {
		updateOnboarding.mutate({
			studentId: student.id,
			bigCourseId: sheet.courseId,
			onboardingDone: !student.onboarding.done,
			remarks: student.onboarding.remarks,
		});
	};

	return (
		<div className="h-full w-full overflow-auto bg-white border-t border-neutral-300 scrollbar-hide">
			<table className="border-collapse text-[11px] w-max min-w-full table-fixed">
				<thead className="sticky top-0 z-30 bg-[#f8f9fa]">
					{/* Row 1: Headers */}
					<tr className="border-b border-neutral-300 bg-[#f8f9fa]">
						<th
							rowSpan={2}
							className="sticky left-0 z-50 bg-[#e8eaed] border-r border-b border-neutral-300 px-2 text-center font-bold text-neutral-800 w-48"
						>
							Name
						</th>
						<th
							rowSpan={2}
							className="sticky left-48 z-50 bg-[#e8eaed] border-r border-b border-neutral-300 px-2 text-center font-bold text-neutral-800 w-32"
						>
							Number
						</th>
						<th
							rowSpan={2}
							className="sticky left-80 z-50 bg-[#e8eaed] border-r border-b border-neutral-300 px-2 text-center font-bold text-neutral-800 w-24"
						>
							Onboarding
						</th>
						{sortedSessions.map((session) => (
							<th
								key={`date-${session.id}`}
								colSpan={4}
								className="border-r border-b border-neutral-300 p-1 text-center bg-[#e2f3e7] text-neutral-800 font-bold ae-date-header"
							>
								{new Date(session.date).toLocaleDateString("en-GB", {
									day: "2-digit",
									month: "2-digit",
									year: "2-digit",
								})}
							</th>
						))}
					</tr>
					{/* Row 2: Sub-headers */}
					<tr className="border-b border-neutral-300 bg-[#f8f9fa] shadow-sm">
						{sortedSessions.map((session) => (
							<React.Fragment key={`sub-${session.id}`}>
								<th className="border-r border-neutral-300 p-1 w-16 text-neutral-600 font-medium">
									Att
								</th>
								<th className="border-r border-neutral-300 p-1 w-12 text-neutral-600 font-medium">
									Time
								</th>
								<th className="border-r border-neutral-300 p-1 w-12 text-neutral-600 font-medium">
									HW
								</th>
								<th className="border-r border-neutral-300 p-1 w-48 text-neutral-600 font-medium text-left px-2">
									Remark
								</th>
							</React.Fragment>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-neutral-300 border-b border-neutral-300">
					{sheet.students.map((student) => (
						<tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
							{/* Name */}
							<td
								className={cn(
									"sticky left-0 z-20 border-r border-neutral-300 px-2 py-1 font-medium text-neutral-900 truncate transition-colors duration-200",
									isActiveMatch(student.id, "name")
										? "bg-[#ff9900] text-white ae-active-match"
										: isMatching(student.name)
											? "bg-[#fff2cc]"
											: "bg-white",
								)}
							>
								<div className="flex items-center justify-between gap-1">
									<span className="truncate flex-1">{student.name}</span>
									<button
										type="button"
										onClick={() => {
											setSelectedStudent(student);
											setIsLogsViewModalOpen(true);
										}}
										className={cn(
											"opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-100 rounded transition-all",
											isActiveMatch(student.id, "name")
												? "text-white"
												: "text-neutral-400 hover:text-emerald-600",
										)}
										title="View Engagement Logs"
									>
										<IconHistory className="w-3 h-3" />
									</button>
								</div>
							</td>
							{/* Number */}
							<td
								className={cn(
									"sticky left-48 z-20 border-r border-neutral-300 px-2 py-1 text-neutral-500 font-mono text-center text-[10px] transition-colors duration-200",
									isActiveMatch(student.id, "phone")
										? "bg-[#ff9900] text-white ae-active-match"
										: isMatching(student.phone)
											? "bg-[#fff2cc]"
											: "bg-white",
								)}
							>
								<div className="flex items-center justify-between gap-1">
									<span
										className={cn(
											"flex-1",
											isActiveMatch(student.id, "phone") ? "text-white" : "text-neutral-500",
										)}
									>
										{student.phone.replace(/\s/g, "")}
									</span>
									<button
										type="button"
										onClick={() => {
											setSelectedStudent(student);
											setIsLogModalOpen(true);
										}}
										className={cn(
											"opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-100 rounded transition-opacity",
											isActiveMatch(student.id, "phone") ? "text-white" : "text-blue-500",
										)}
										title="Add Log"
									>
										<IconUserPlus className="w-3 h-3" />
									</button>
								</div>
							</td>
							{/* Onboarding */}
							<td className="sticky left-80 z-20 bg-white border-r border-neutral-300 px-1 py-1 text-center">
								<button
									type="button"
									onClick={() => handleOnboardingToggle(student)}
									className={cn(
										"w-full py-0.5 rounded text-[9px] font-bold transition-all",
										student.onboarding.done
											? "bg-emerald-100 text-emerald-700"
											: "bg-neutral-100 text-neutral-400 hover:bg-neutral-200",
									)}
								>
									{student.onboarding.done ? "DONE" : "PENDING"}
								</button>
							</td>
							{/* Session Data */}
							{sortedSessions.map((sessionHeader) => {
								const session = student.sessions.find((s) => s.sessionId === sessionHeader.id);
								if (!session)
									return (
										<React.Fragment key={`empty-${sessionHeader.id}`}>
											<td className="border-r border-neutral-300 bg-neutral-50" />
											<td className="border-r border-neutral-300 bg-neutral-50" />
											<td className="border-r border-neutral-300 bg-neutral-50" />
											<td className="border-r border-neutral-300 bg-neutral-50" />
										</React.Fragment>
									);

								return (
									<React.Fragment key={session.sessionId}>
										{/* Attendance */}
										<td
											className={cn(
												"border-r border-neutral-300 text-center font-bold relative group/cell",
												session.att === "P"
													? "bg-[#c6efce] text-[#006100]"
													: "bg-[#ffc7ce] text-[#9c0006]",
											)}
										>
											<button
												type="button"
												onClick={() => handleCellClick(student, session)}
												className="w-full h-full py-1 cursor-cell focus:outline-none"
											>
												{session.att}
											</button>
										</td>
										{/* Time */}
										<td className="border-r border-neutral-300 text-center text-neutral-600 bg-white py-1">
											{session.time || 0}
										</td>
										{/* HW */}
										<td className="border-r border-neutral-300 text-center text-neutral-500 bg-white py-1">
											{session.hw?.toUpperCase() === "DONE" ? "Done" : "-"}
										</td>
										{/* Remark */}
										<td className="border-r border-neutral-300 px-2 py-1 text-neutral-700 bg-white truncate group/remark relative">
											<div className="flex items-center justify-between gap-1 w-full h-full">
												<span className="truncate flex-1">{session.connectRemarks || "-"}</span>
												<button
													type="button"
													onClick={() => handleCellClick(student, session)}
													className="opacity-0 group-hover/remark:opacity-100 p-0.5 hover:bg-neutral-100 rounded transition-opacity"
												>
													<IconEdit className="w-3 h-3 text-neutral-400 hover:text-blue-500" />
												</button>
											</div>
										</td>
									</React.Fragment>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>

			{/* Modals */}
			{isRemarksModalOpen && selectedStudent && selectedSession && (
				<EditRemarksModal
					student={selectedStudent}
					session={selectedSession}
					onClose={() => setIsRemarksModalOpen(false)}
					onSave={(data: { connectRemarks: string }) => {
						updateRemarks.mutate({
							studentId: selectedStudent.id,
							sessionId: selectedSession.sessionId,
							bigCourseId: sheet.courseId,
							...data,
						});
						setIsRemarksModalOpen(false);
					}}
					isLoading={updateRemarks.isPending}
				/>
			)}

			{isLogModalOpen && selectedStudent && (
				<LogTouchpointModal
					student={selectedStudent}
					onClose={() => setIsLogModalOpen(false)}
					onSave={(data: { type: string; remarks: string }) => {
						addLog.mutate({
							studentId: selectedStudent.id,
							bigCourseId: sheet.courseId,
							...data,
						});
						setIsLogModalOpen(false);
					}}
					isLoading={addLog.isPending}
				/>
			)}

			{isLogsViewModalOpen && selectedStudent && (
				<ViewEngagementLogsModal
					student={selectedStudent}
					bigCourseId={sheet.courseId}
					onClose={() => setIsLogsViewModalOpen(false)}
				/>
			)}
		</div>
	);
};

// --- Sub-components (Modals) ---

const ViewEngagementLogsModal = ({
	student,
	bigCourseId,
	onClose,
}: {
	student: Student;
	bigCourseId: number;
	onClose: () => void;
}) => {
	const { data, isLoading } = useEngagementLogs(student.id, bigCourseId);
	const logs = data?.logs || [];

	return (
		<div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
			{/* Overlay click to close */}
			<button
				type="button"
				className="absolute inset-0 w-full h-full cursor-default"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Enter" && onClose()}
				aria-label="Close sheet"
			/>

			{/* Sheet Content */}
			<div className="relative bg-white w-full max-w-md h-full shadow-2xl border-l border-neutral-300 flex flex-col animate-in slide-in-from-right duration-500 ease-out">
				<div className="p-6 border-b border-neutral-200 bg-[#f8f9fa]">
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
								<IconHistory className="w-5 h-5 text-emerald-600" />
								Engagement History
							</h3>
							<p className="text-sm text-neutral-500">Touchpoints for {student.name}</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1.5 hover:bg-neutral-200 rounded-full transition-colors group"
						>
							<IconX className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-20 gap-3">
							<div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
							<span className="text-sm text-neutral-400 font-medium italic">
								Fetching history...
							</span>
						</div>
					) : logs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-2">
							<IconHistory className="w-12 h-12 opacity-20" />
							<span className="text-sm font-medium italic">No logs found for this student.</span>
						</div>
					) : (
						logs.map((log: EngagementLog) => (
							<div
								key={log.id}
								className="p-4 rounded-xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group/log"
							>
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<span
											className={cn(
												"px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
												log.type === "CALL"
													? "bg-blue-100 text-blue-700"
													: log.type === "WHATSAPP"
														? "bg-emerald-100 text-emerald-700"
														: "bg-neutral-100 text-neutral-600",
											)}
										>
											{log.type}
										</span>
									</div>
									<span className="text-[10px] text-neutral-400 font-medium bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
										{new Date(log.createdAt).toLocaleString("en-GB", {
											day: "2-digit",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
								<p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-neutral-100 group-hover/log:border-emerald-200 transition-colors">
									{log.remarks}
								</p>
							</div>
						))
					)}
				</div>

				<div className="px-6 py-4 bg-[#f8f9fa] border-t border-neutral-200 flex flex-col gap-2">
					<p className="text-[10px] text-neutral-400 text-center italic">
						Showing latest engagement records first
					</p>
					<Button
						onClick={onClose}
						className="w-full rounded-lg h-10 text-sm font-bold bg-neutral-900 hover:bg-black text-white shadow-lg transition-all"
					>
						Close History
					</Button>
				</div>
			</div>
		</div>
	);
};

const EditRemarksModal = ({
	student,
	session,
	onClose,
	onSave,
	isLoading,
}: {
	student: Student;
	session: Session;
	onClose: () => void;
	onSave: (data: { connectRemarks: string }) => void;
	isLoading: boolean;
}) => {
	const [connectRemarks, setConnectRemarks] = useState(session.connectRemarks || "");

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden border border-neutral-300">
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-lg font-bold text-neutral-900">Update Remarks</h3>
							<p className="text-sm text-neutral-500">
								{student.name} · {session.topic || "Session"}
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1 hover:bg-neutral-100 rounded transition-colors"
						>
							<IconX className="w-5 h-5 text-neutral-400" />
						</button>
					</div>

					<div className="space-y-4">
						<div className="space-y-1">
							<label
								htmlFor="connect-remarks"
								className="text-[11px] font-bold uppercase text-neutral-500"
							>
								Remarks
							</label>
							<textarea
								id="connect-remarks"
								value={connectRemarks}
								onChange={(e) => setConnectRemarks(e.target.value)}
								className="w-full h-32 p-3 rounded bg-neutral-50 border border-neutral-300 outline-none focus:border-emerald-500 text-sm transition-all resize-none"
								placeholder="Enter remarks..."
							/>
						</div>
					</div>
				</div>

				<div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
					<Button variant="outline" onClick={onClose} className="rounded px-4 h-9 text-sm">
						Cancel
					</Button>
					<Button
						onClick={() => onSave({ connectRemarks })}
						disabled={isLoading}
						className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-6 h-9 text-sm"
					>
						{isLoading ? "Saving..." : "Save Remarks"}
					</Button>
				</div>
			</div>
		</div>
	);
};

const LogTouchpointModal = ({
	student,
	onClose,
	onSave,
	isLoading,
}: {
	student: Student;
	onClose: () => void;
	onSave: (data: { type: string; remarks: string }) => void;
	isLoading: boolean;
}) => {
	const [type, setType] = useState("CALL");
	const [remarks, setRemarks] = useState("");

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden border border-neutral-300">
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-lg font-bold text-neutral-900">Log Touchpoint</h3>
							<p className="text-sm text-neutral-500">Interaction log for {student.name}</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1 hover:bg-neutral-100 rounded transition-colors"
						>
							<IconX className="w-5 h-5 text-neutral-400" />
						</button>
					</div>

					<div className="space-y-4">
						<div className="space-y-1">
							<label
								htmlFor="log-type"
								className="text-[11px] font-bold uppercase text-neutral-500"
							>
								Type
							</label>
							<select
								id="log-type"
								value={type}
								onChange={(e) => setType(e.target.value)}
								className="w-full p-2.5 rounded bg-neutral-50 border border-neutral-300 outline-none focus:border-emerald-500 text-sm font-medium"
							>
								<option value="CALL">Phone Call</option>
								<option value="WHATSAPP">WhatsApp</option>
								<option value="EMAIL">Email</option>
								<option value="OTHER">Other</option>
							</select>
						</div>
						<div className="space-y-1">
							<label
								htmlFor="log-details"
								className="text-[11px] font-bold uppercase text-neutral-500"
							>
								Log Details
							</label>
							<textarea
								id="log-details"
								value={remarks}
								onChange={(e) => setRemarks(e.target.value)}
								className="w-full h-32 p-3 rounded bg-neutral-50 border border-neutral-300 outline-none focus:border-emerald-500 text-sm transition-all resize-none"
								placeholder="Enter interaction details..."
							/>
						</div>
					</div>
				</div>

				<div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
					<Button variant="outline" onClick={onClose} className="rounded px-4 h-9 text-sm">
						Cancel
					</Button>
					<Button
						onClick={() => onSave({ type, remarks })}
						disabled={isLoading || !remarks}
						className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-6 h-9 text-sm"
					>
						{isLoading ? "Logging..." : "Log Interaction"}
					</Button>
				</div>
			</div>
		</div>
	);
};
