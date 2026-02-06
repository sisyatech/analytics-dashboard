import { IconChecks, IconClock, IconMessages, IconStar, IconUsers } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { MentorSummary } from "@/types/performance";

interface MentorSummaryViewProps {
	summary: MentorSummary;
}

export const MentorSummaryView = ({ summary }: MentorSummaryViewProps) => {
	const totalHours = Math.floor(summary.sessions.totalDurationMinutes / 60);
	const remainingMinutes = summary.sessions.totalDurationMinutes % 60;

	const stats = [
		{
			label: "Total Sessions",
			value: summary.sessions.total,
			subValue: `${summary.sessions.avgRating} Avg Rating`,
			icon: IconUsers,
			color: "blue",
		},
		{
			label: "Total Duration",
			value: `${summary.sessions.totalDurationMinutes}m`,
			subValue: `${totalHours}h ${remainingMinutes}m Total`,
			icon: IconClock,
			color: "emerald",
		},
		{
			label: "Doubts Solved",
			value: summary.doubts.solved,
			subValue: `${(summary.doubts.solveRate * 100).toFixed(1)}% Solve Rate`,
			icon: IconChecks,
			color: "green",
		},
		{
			label: "Mentor Rating",
			value: summary.ratings.mentorAvgRating.toFixed(2),
			subValue: "Out of 5",
			icon: IconStar,
			color: "yellow",
		},
		{
			label: "Total Reviews",
			value: summary.ratings.totalReviews,
			subValue: `${summary.ratings.overallAvgRating} Overall Avg`,
			icon: IconMessages,
			color: "purple",
		},
	];

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{stats.map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm"
					>
						<div className="flex items-center gap-4">
							<div
								className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}
							>
								<stat.icon className="w-6 h-6" />
							</div>
							<div>
								<p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
									{stat.label}
								</p>
								<h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-0.5">
									{stat.value}
								</h4>
							</div>
						</div>
						<div className="mt-4 pt-4 border-t border-neutral-50 dark:border-neutral-700/50">
							<p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
								{stat.subValue}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};
