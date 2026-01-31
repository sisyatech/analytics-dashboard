import { IconCalendarEvent, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/analytics";
import { SessionCard } from "./SessionCard";

interface SessionListProps {
	sessionsData?: {
		sessions: Session[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			hasNext: boolean;
		};
	};
	isLoadingSessions: boolean;
	onSessionSelect: (id: number) => void;
	currentPage: number;
	onPageChange: (page: number | ((p: number) => number)) => void;
}

export const SessionList = ({
	sessionsData,
	isLoadingSessions,
	onSessionSelect,
	currentPage,
	onPageChange,
}: SessionListProps) => {
	if (!sessionsData && !isLoadingSessions) return null;

	const totalPages = sessionsData?.pagination
		? Math.ceil(sessionsData.pagination.total / sessionsData.pagination.limit)
		: 0;

	return (
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
						<SessionCard key={session.id} session={session} onSelect={onSessionSelect} />
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
								Page {sessionsData.pagination.page} <span className="mx-2 text-neutral-300">|</span>{" "}
								{sessionsData.pagination.total} sessions total
							</p>
						</div>

						<div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
							<button
								type="button"
								onClick={() => onPageChange((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
								title="Previous Page"
							>
								<IconChevronLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
							</button>

							<div className="flex items-center gap-1 h-9 px-1">
								{Array.from({ length: totalPages }, (_, i) => i + 1)
									.filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
									.map((p, i, arr) => (
										<div key={p} className="flex items-center">
											{i > 0 && arr[i - 1] !== p - 1 && (
												<span className="w-6 text-center text-neutral-300 font-black text-[10px]">
													•••
												</span>
											)}
											<button
												type="button"
												onClick={() => onPageChange(p)}
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
								onClick={() => onPageChange((p) => p + 1)}
								disabled={!sessionsData.pagination.hasNext}
								className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
								title="Next Page"
							>
								<IconChevronRight className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
							</button>
						</div>

						<div className="hidden lg:block text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
							Showing {(sessionsData.pagination.page - 1) * sessionsData.pagination.limit + 1} -{" "}
							{Math.min(
								sessionsData.pagination.page * sessionsData.pagination.limit,
								sessionsData.pagination.total,
							)}
						</div>
					</div>
				)}
		</div>
	);
};
