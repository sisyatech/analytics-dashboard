import {
	IconBook,
	IconCircleCheck,
	IconCircleX,
	IconClock,
	IconHistory,
	IconNotes,
	IconTag,
	IconUser,
	IconUserCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/analytics";
import {
	AnnouncementAudience,
	AnnouncementScope,
	AnnouncementType,
	type CreateAnnouncementPayload,
} from "@/types/announcement";
import { formatDate, formatTime } from "@/utils/date";

interface SessionDetailHeaderProps {
	selectedSession: Session;
	onSendAnnouncement: (payload: Partial<CreateAnnouncementPayload>, targetName: string) => void;
}

export const SessionDetailHeader = ({
	selectedSession,
	onSendAnnouncement,
}: SessionDetailHeaderProps) => {
	return (
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
								<h2 className="text-2xl font-bold dark:text-white">{selectedSession.detail}</h2>
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
															selectedSession.actualTeacher || selectedSession.scheduledTeacher;
														onSendAnnouncement(
															{
																title: "Homework Pending Warning",
																message: `The homework for session "${selectedSession.detail}" has not been uploaded yet. Please upload it as soon as possible.`,
																type: AnnouncementType.ALERT,
																audience: AnnouncementAudience.TEACHERS,
																scope: AnnouncementScope.INDIVIDUAL,
																mentorId: targetTeacher.id,
															},
															targetTeacher.name,
														);
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
											selectedSession.actualTeacher.id !== selectedSession.scheduledTeacher.id && (
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
								<p className="text-[9px] font-bold uppercase tracking-widest">Session Log</p>
							</div>
							<span className="text-[10px] font-black text-neutral-300 dark:text-neutral-600">
								VERIFIED
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
