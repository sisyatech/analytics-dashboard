import {
	IconCheck,
	IconClipboardCheck,
	IconCoins,
	IconDeviceLaptop,
	IconPencil,
	IconStar,
	IconTrophy,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type { PerformanceSummary as PerformanceSummaryType } from "@/types/performance";

interface PerformanceSummaryProps {
	summary: PerformanceSummaryType;
}

export const PerformanceSummary = ({ summary }: PerformanceSummaryProps) => {
	const cards = [
		{
			title: "Attendance",
			value: `${(summary.attendance.attendanceRate * 100).toFixed(0)}%`,
			label: "Attendance Rate",
			subValue: `${summary.attendance.presentCount} / ${summary.attendance.totalSessions} Sessions`,
			icon: IconClipboardCheck,
			color: "text-blue-500",
			bg: "bg-blue-50 dark:bg-blue-900/20",
			footer: `Class Avg: ${(summary.attendance.classAvgRate * 100).toFixed(0)}%`,
		},
		{
			title: "Quizzes",
			value: `${(summary.quizzes.accuracy * 100).toFixed(0)}%`,
			label: "Accuracy",
			subValue: `${summary.quizzes.correct} / ${summary.quizzes.attempted} Correct`,
			icon: IconTrophy,
			color: "text-amber-500",
			bg: "bg-amber-50 dark:bg-amber-900/20",
			footer: `Participation: ${(summary.quizzes.participationRate * 100).toFixed(0)}%`,
		},
		{
			title: "Tests",
			value: `${summary.tests.attempted} / ${summary.tests.total}`,
			label: "Tests Completed",
			subValue: `Rate: ${(summary.tests.completionRate * 100).toFixed(0)}%`,
			icon: IconPencil,
			color: "text-emerald-500",
			bg: "bg-emerald-50 dark:bg-emerald-900/20",
			footer: `Avg Comp: ${(summary.tests.classAvgCompletion * 100).toFixed(0)}%`,
		},
		{
			title: "Homework",
			value: `${(summary.homework.attemptRate * 100).toFixed(0)}%`,
			label: "Submission Rate",
			subValue: `${summary.homework.attempted} / ${summary.homework.total} Assigned`,
			icon: IconDeviceLaptop,
			color: "text-purple-500",
			bg: "bg-purple-50 dark:bg-purple-900/20",
			footer: `${summary.homework.totalCorrect} Correct Answers`,
		},
		{
			title: "Coins",
			value: summary.coins.balance.toLocaleString(),
			label: "Current Balance",
			subValue: `Earned: ${summary.coins.totalEarned} | Spent: ${summary.coins.totalSpent}`,
			icon: IconCoins,
			color: "text-yellow-500",
			bg: "bg-yellow-50 dark:bg-yellow-900/20",
			footer: `Total Earned: ${summary.coins.totalEarned}`,
		},
		{
			title: "Reviews",
			value: (
				(summary.reviews.totalSessionFeedbacks +
					summary.reviews.totalDoubtReviews +
					summary.reviews.totalMentorReviews +
					summary.reviews.totalAIRatings) /
				4
			).toFixed(1),
			label: "Avg Rating",
			subValue: `${summary.reviews.totalSessionFeedbacks} Session | ${summary.reviews.totalDoubtReviews} Doubt`,
			icon: IconStar,
			color: "text-orange-500",
			bg: "bg-orange-50 dark:bg-orange-900/20",
			footer: `${summary.reviews.totalMentorReviews} Mentor | ${summary.reviews.totalAIRatings} AI Ratings`,
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
			{cards.map((card, index) => (
				<motion.div
					key={card.title}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
					className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="flex items-start justify-between mb-4">
						<div className={`p-3 rounded-xl ${card.bg}`}>
							<card.icon className={`w-6 h-6 ${card.color}`} />
						</div>
						<span className="text-xs font-semibold px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
							{card.title}
						</span>
					</div>
					<div>
						<h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</h3>
						<p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
							{card.label}
						</p>
						<p className="text-xs text-neutral-400 mt-1">{card.subValue}</p>
					</div>
					<div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-700">
						<p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
							<IconCheck className="w-3 h-3" />
							{card.footer}
						</p>
					</div>
				</motion.div>
			))}
		</div>
	);
};
