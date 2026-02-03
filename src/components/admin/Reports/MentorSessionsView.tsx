import {
	IconBook,
	IconCalendar,
	IconClock,
	IconLayoutDashboard,
	IconLoader,
	IconStar,
	IconUsers,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MentorSession } from "@/types/performance";
import { SessionReviewsModal } from "./SessionReviewsModal";
import { StudentListModal } from "./StudentListModal";

interface MentorSessionsViewProps {
	data: MentorSession[];
}

const ITEMS_PER_PAGE = 12;

export const MentorSessionsView = ({ data }: MentorSessionsViewProps) => {
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
	const observerTarget = useRef<HTMLDivElement>(null);

	// Modal State
	const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
	const [isStudentListOpen, setIsStudentListOpen] = useState(false);
	const [isReviewsOpen, setIsReviewsOpen] = useState(false);

	const visibleData = useMemo(
		() => (Array.isArray(data) ? data.slice(0, visibleCount) : []),
		[data, visibleCount],
	);
	const hasMore = visibleCount < (data?.length || 0);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore) {
					// Small delay to show loader and prevent jitter
					setTimeout(() => {
						setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, data.length));
					}, 300);
				}
			},
			{ threshold: 0.1 },
		);

		const currentTarget = observerTarget.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [hasMore, data.length]);

	const handleStudentClick = (sessionId: number) => {
		setSelectedSessionId(sessionId);
		setIsStudentListOpen(true);
	};

	const handleReviewClick = (sessionId: number) => {
		setSelectedSessionId(sessionId);
		setIsReviewsOpen(true);
	};

	if (!data || data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-white dark:bg-neutral-800 rounded-3xl border border-dashed border-neutral-100 dark:border-neutral-700">
				<IconCalendar className="w-12 h-12 mb-4 opacity-20" />
				<p className="font-medium">No sessions found for this mentor.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{visibleData.map((session, index) => (
					<motion.div
						key={session.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: (index % ITEMS_PER_PAGE) * 0.05 }}
						className="bg-white dark:bg-neutral-800 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
					>
						<div className="relative z-10">
							{/* Header: Date Badge & Title */}
							<div className="flex justify-between items-start gap-3 mb-3">
								<div className="space-y-1">
									<h4 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
										{session.title}
									</h4>
									<div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-neutral-500">
										<span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
											{session.subjectName}
										</span>
										<span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
										<span>Grade {session.grade}</span>
										{session.hasHomework && (
											<>
												<span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
												<span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
													<IconBook className="w-3 h-3" />
													HW
												</span>
											</>
										)}
									</div>
								</div>
								<div className="flex flex-col items-center justify-center min-w-14 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-2 border border-neutral-100 dark:border-neutral-700">
									<span className="text-[10px] uppercase font-bold text-neutral-400">
										{session.startTime ? format(parseISO(session.startTime), "MMM") : "-"}
									</span>
									<span className="text-xl font-bold text-neutral-900 dark:text-white leading-none">
										{session.startTime ? format(parseISO(session.startTime), "dd") : "-"}
									</span>
								</div>
							</div>

							{/* Stats Row */}
							<div className="grid grid-cols-3 divide-x divide-neutral-100 dark:divide-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700 mb-4">
								{/* biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for card selection */}
								<div
									className="p-2 flex flex-col items-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors first:rounded-l-xl"
									onClick={() => handleStudentClick(session.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleStudentClick(session.id);
										}
									}}
								>
									<span className="text-[10px] text-neutral-400 mb-0.5">Students</span>
									<div className="flex items-center gap-1 font-bold text-neutral-700 dark:text-neutral-200">
										<IconUsers className="w-3.5 h-3.5 text-blue-500" />
										<span>{session.analytics.totalStudentsJoined}</span>
									</div>
								</div>
								{/* biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for card selection */}
								<div
									className="p-2 flex flex-col items-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
									onClick={() => handleReviewClick(session.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleReviewClick(session.id);
										}
									}}
								>
									<span className="text-[10px] text-neutral-400 mb-0.5">Rating</span>
									<div className="flex items-center gap-1 font-bold text-neutral-700 dark:text-neutral-200">
										<IconStar className="w-3.5 h-3.5 text-amber-500 filled" />
										<span>{session.analytics.avgRating.toFixed(1)}</span>
										<span className="text-[9px] text-neutral-400 font-normal">
											({session.analytics.reviewCount})
										</span>
									</div>
								</div>
								<div className="p-2 flex flex-col items-center">
									<span className="text-[10px] text-neutral-400 mb-0.5">Duration</span>
									<div className="flex items-center gap-1 font-bold text-neutral-700 dark:text-neutral-200">
										<IconClock className="w-3.5 h-3.5 text-purple-500" />
										<span>{session.analytics.actualDuration}m</span>
									</div>
								</div>
							</div>

							{/* Timing List */}
							<div className="space-y-2">
								<div className="flex items-center justify-between text-xs">
									<span className="text-neutral-400 flex items-center gap-1.5">
										<span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
										Scheduled
									</span>
									<span className="font-medium text-neutral-600 dark:text-neutral-400 font-mono">
										{session.startTime ? format(parseISO(session.startTime), "HH:mm") : "--:--"} -{" "}
										{session.endTime ? format(parseISO(session.endTime), "HH:mm") : "--:--"}
									</span>
								</div>
								<div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
									<span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
										Actual Time
									</span>
									<span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
										{session.analytics.actualStartTime
											? format(parseISO(session.analytics.actualStartTime), "HH:mm")
											: "--:--"}{" "}
										-{" "}
										{session.analytics.actualEndTime
											? format(parseISO(session.analytics.actualEndTime), "HH:mm")
											: "--:--"}
									</span>
								</div>
							</div>

							{/* Footer */}
							<div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
								<div className="flex items-center justify-between text-[10px] text-neutral-400">
									<div className="flex items-center gap-1.5">
										<IconLayoutDashboard className="w-3 h-3" />
										<span className="uppercase tracking-wide line-clamp-1 max-w-35">
											{session.courseName}
										</span>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{hasMore && (
				<div ref={observerTarget} className="flex justify-center py-8">
					<div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 text-sm">
						<IconLoader className="w-4 h-4 animate-spin" />
						<span>Loading more sessions...</span>
					</div>
				</div>
			)}

			{/* Modals */}
			<StudentListModal
				sessionId={selectedSessionId}
				isOpen={isStudentListOpen}
				onClose={() => setIsStudentListOpen(false)}
			/>

			<SessionReviewsModal
				sessionId={selectedSessionId}
				isOpen={isReviewsOpen}
				onClose={() => setIsReviewsOpen(false)}
			/>
		</div>
	);
};
