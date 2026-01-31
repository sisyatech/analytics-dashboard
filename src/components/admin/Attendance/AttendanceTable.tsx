import {
	IconChevronDown,
	IconChevronUp,
	IconClock,
	IconSearch,
	IconUsers,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Session, SessionAttendanceResponse, StudentAttendance } from "@/types/analytics";
import {
	AnnouncementAudience,
	AnnouncementScope,
	AnnouncementType,
	type CreateAnnouncementPayload,
} from "@/types/announcement";
import { formatTime } from "@/utils/date";

interface AttendanceTableProps {
	attendanceData: SessionAttendanceResponse;
	filteredStudents: StudentAttendance[];
	statusFilter: "all" | "present" | "absent";
	setStatusFilter: (filter: "all" | "present" | "absent") => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	expandedStudentId: number | null;
	setExpandedStudentId: (id: number | null) => void;
	selectedSession: Session;
	onSendAnnouncement: (payload: Partial<CreateAnnouncementPayload>, targetName: string) => void;
	setContextMenu: (
		menu: { x: number; y: number; studentId: number; studentName: string } | null,
	) => void;
}

export const AttendanceTable = ({
	attendanceData,
	filteredStudents,
	statusFilter,
	setStatusFilter,
	searchQuery,
	setSearchQuery,
	expandedStudentId,
	setExpandedStudentId,
	selectedSession,
	onSendAnnouncement,
	setContextMenu,
}: AttendanceTableProps) => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
						<IconUsers className="w-6 h-6 text-blue-500" /> Student Roll Call
					</h2>
					<p className="text-sm font-medium text-neutral-500">
						Showing {filteredStudents?.length} of {attendanceData.totalEnrolled} enrolled
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
					<Select
						value={statusFilter}
						onValueChange={(val) => setStatusFilter(val as "all" | "present" | "absent")}
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
											onClick={() => setExpandedStudentId(isExpanded ? null : student.studentId)}
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
													{/* biome-ignore lint/a11y/noStaticElementInteractions: div used as clickable element */}
													<div
														onContextMenu={(e) => {
															e.preventDefault();
															setContextMenu({
																x: e.pageX,
																y: e.pageY,
																studentId: student.studentId,
																studentName: student.name,
															});
														}}
														className="relative"
													>
														<p className="font-bold text-neutral-900 dark:text-white mb-0.5 hover:text-blue-600 transition-colors cursor-context-menu">
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
														<span className="text-[10px] text-neutral-500 font-bold">MIN</span>
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
																onSendAnnouncement(
																	{
																		title: "Missed Class Notification",
																		message: `Hi ${student.name}, you missed the class "${selectedSession.detail}". Please watch the recording and do the homework. Join the next class on time!`,
																		type: AnnouncementType.IMPORTANT,
																		audience: AnnouncementAudience.STUDENTS,
																		scope: AnnouncementScope.INDIVIDUAL,
																		userId: student.studentId,
																	},
																	student.name,
																);
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
						<p className="text-neutral-400 font-medium">No students found matching your filters</p>
					</div>
				)}
			</div>
		</div>
	);
};
