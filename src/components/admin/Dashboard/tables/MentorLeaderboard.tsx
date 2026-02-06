import { IconStar } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMentorPerformance } from "@/hooks/admin/useDashboardStats";

export function MentorLeaderboard() {
	const { data, isLoading } = useMentorPerformance();
	const mentors = data?.data || [];

	// Sort by session count (descending) and take top 5
	const topMentors = [...mentors].sort((a, b) => b.sessionCount - a.sessionCount).slice(0, 5);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Top Mentors</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Highest performing mentors by sessions
				</p>
			</div>

			{isLoading ? (
				<div className="flex h-[300px] items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
				</div>
			) : topMentors.length === 0 ? (
				<div className="flex h-[300px] items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No mentor data available</p>
				</div>
			) : (
				<div className="space-y-4">
					{topMentors.map((mentor, index) => (
						<div
							key={mentor.mentorId}
							className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
						>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
									{index + 1}
								</div>
								<div>
									<p className="font-medium text-neutral-900 dark:text-white">
										{mentor.mentorName}
									</p>
									<p className="text-xs text-neutral-500">{mentor.sessionCount} Sessions</p>
								</div>
							</div>
							<div className="text-right">
								<div className="flex items-center gap-1 text-amber-500">
									<IconStar className="h-4 w-4 fill-current" />
									<span className="font-bold">{mentor.avgSessionRating.toFixed(1)}</span>
								</div>
								<p className="text-xs text-neutral-500">{mentor.doubtCount} Doubts Solved</p>
							</div>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
}
