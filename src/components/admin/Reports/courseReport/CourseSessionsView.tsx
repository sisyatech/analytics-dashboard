import {
	IconClock,
	IconHistory,
	IconLoader,
	IconSearch,
	IconStar,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { CourseSession } from "@/types/performance";
import { SessionReviewsModal } from "../shared/SessionReviewsModal";
import { StudentListModal } from "../shared/StudentListModal";

interface CourseSessionsViewProps {
	sessions: CourseSession[];
	fetchNextPage: () => void;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
}

export const CourseSessionsView = ({
	sessions,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
}: CourseSessionsViewProps) => {
	const [search, setSearch] = useState("");
	const observerTarget = useRef<HTMLDivElement>(null);

	const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
	const [isStudentListOpen, setIsStudentListOpen] = useState(false);
	const [isReviewsOpen, setIsReviewsOpen] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{
				threshold: 0.5,
				rootMargin: "100px",
			},
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
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const filteredSessions = sessions.filter((s) =>
		s.title.toLowerCase().includes(search.toLowerCase()),
	);

	const handleStudentClick = (sessionId: number) => {
		setSelectedSessionId(sessionId);
		setIsStudentListOpen(true);
	};

	const handleReviewClick = (sessionId: number) => {
		setSelectedSessionId(sessionId);
		setIsReviewsOpen(true);
	};

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="relative">
				<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
				<Input
					placeholder="Search sessions..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-10 h-11 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl"
				/>
			</div>

			{/* List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredSessions.map((session, index) => (
					<motion.div
						key={session.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
					>
						<div className="relative z-10 flex flex-col h-full">
							{/* Header */}
							<div className="flex justify-between items-start gap-3 mb-4">
								<div className="space-y-1">
									<h4 className="text-base font-black text-neutral-900 dark:text-white leading-tight line-clamp-2">
										{session.title}
									</h4>
									<div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
										<span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
											{session.subjectName}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-center justify-center min-w-14 bg-neutral-50 dark:bg-neutral-800 rounded-xl p-2 border border-neutral-100 dark:border-neutral-700">
									<span className="text-[10px] uppercase font-black text-neutral-400">
										{format(parseISO(session.startTime), "MMM")}
									</span>
									<span className="text-xl font-black text-neutral-900 dark:text-white leading-none">
										{format(parseISO(session.startTime), "dd")}
									</span>
								</div>
							</div>

							{/* Teachers Info */}
							<div className="space-y-2 mb-4">
								<div className="flex items-center justify-between text-xs">
									<span className="text-neutral-400 font-medium">Allocated:</span>
									<span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
										<IconUser className="w-3 h-3" />
										{session.allocatedTeacher.name}
									</span>
								</div>
								{session.actualTeacher &&
								session.actualTeacher.id !== session.allocatedTeacher.id ? (
									<div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20">
										<span className="text-amber-600 dark:text-amber-400 font-bold">
											Substitute:
										</span>
										<span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
											<IconUser className="w-3 h-3" />
											{session.actualTeacher.name}
										</span>
									</div>
								) : (
									<div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/20">
										<span className="text-green-600 dark:text-green-400 font-bold">
											Conducted by:
										</span>
										<span className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
											<IconUser className="w-3 h-3" />
											{session.allocatedTeacher.name}
										</span>
									</div>
								)}
							</div>

							{/* Stats Row */}
							<div className="grid grid-cols-3 divide-x divide-neutral-100 dark:divide-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-800 mb-4 mt-auto">
								{/* biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for student list */}
								<div
									className="p-2.5 flex flex-col items-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
									onClick={() => handleStudentClick(session.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleStudentClick(session.id);
										}
									}}
								>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
										Students
									</span>
									<div className="flex items-center gap-1.5 font-black text-neutral-800 dark:text-neutral-200">
										<IconUsers className="w-4 h-4 text-blue-500" />
										<span>{session.analytics.totalStudentsJoined}</span>
									</div>
								</div>
								{/* biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for review modal */}
								<div
									className="p-2.5 flex flex-col items-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
									onClick={() => handleReviewClick(session.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleReviewClick(session.id);
										}
									}}
								>
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
										Rating
									</span>
									<div className="flex items-center gap-1.5 font-black text-neutral-800 dark:text-neutral-200">
										<IconStar className="w-4 h-4 text-amber-500" />
										<span>{session.analytics.avgRating.toFixed(1)}</span>
									</div>
								</div>
								<div className="p-2.5 flex flex-col items-center">
									<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
										Duration
									</span>
									<div className="flex items-center gap-1.5 font-black text-neutral-800 dark:text-neutral-200">
										<IconHistory className="w-4 h-4 text-green-500" />
										<span>{session.analytics.actualDuration}m</span>
									</div>
								</div>
							</div>

							{/* Footer Timeline */}
							<div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
								<div className="flex items-center justify-between text-[11px]">
									<div className="flex items-center gap-1.5 text-neutral-500">
										<IconClock className="w-3.5 h-3.5" />
										<span className="font-mono">
											{format(parseISO(session.startTime), "HH:mm")} -{" "}
											{format(parseISO(session.endTime), "HH:mm")}
										</span>
									</div>
									<span className="text-neutral-400 font-bold uppercase tracking-tighter">
										Scheduled
									</span>
								</div>

								{session.analytics.actualStartTime && (
									<div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20">
										<div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
											<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
											<span className="font-mono">
												{format(parseISO(session.analytics.actualStartTime), "HH:mm")} -{" "}
												{session.analytics.actualEndTime
													? format(parseISO(session.analytics.actualEndTime), "HH:mm")
													: "--:--"}
											</span>
										</div>
										<span className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-tight">
											Actual Time
										</span>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Infinite Scroll Trigger */}
			{(hasNextPage || isFetchingNextPage) && (
				<div ref={observerTarget} className="flex justify-center py-8">
					{isFetchingNextPage && (
						<div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 text-sm">
							<IconLoader className="w-4 h-4 animate-spin" />
							<span>Loading more sessions...</span>
						</div>
					)}
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
