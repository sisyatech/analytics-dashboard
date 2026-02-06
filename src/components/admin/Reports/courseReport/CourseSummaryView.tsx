import {
	IconBadge,
	IconBooks,
	IconCalendar,
	IconCheck,
	IconStar,
	IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import type { CourseSummary } from "@/types/performance";

interface CourseSummaryViewProps {
	summary: CourseSummary;
}

export const CourseSummaryView = ({ summary }: CourseSummaryViewProps) => {
	const cards = [
		{
			title: "Students",
			label: "Total Enrolled",
			value: summary.enrolledStudents.toLocaleString(),
			subValue: "Active Learners",
			icon: IconUsers,
			color: "text-blue-500",
			bg: "bg-blue-50 dark:bg-blue-900/20",
			footer: "Latest Enrollment Stats",
		},
		{
			title: "Sessions",
			label: "Completed",
			value: summary.sessions.totalDone,
			subValue: `${Math.floor(summary.sessions.totalDurationMinutes / 60)}h Learning Time`,
			icon: IconCalendar,
			color: "text-green-500",
			bg: "bg-green-50 dark:bg-green-900/20",
			footer: `${summary.sessions.avgRating.toFixed(1)} Avg Session Rating`,
		},
		{
			title: "Homework",
			label: "Assigned",
			value: summary.homework.totalAssigned,
			subValue: "Curriculum Tasks",
			icon: IconBooks,
			color: "text-purple-500",
			bg: "bg-purple-50 dark:bg-purple-900/20",
			footer: "Overall Submission Stats",
		},
		{
			title: "Assessments",
			label: "Tests Assigned",
			value: summary.tests.totalAssigned,
			subValue: "Performance Checks",
			icon: IconBadge,
			color: "text-orange-500",
			bg: "bg-orange-50 dark:bg-orange-900/20",
			footer: "Latest Test Results",
		},
	];

	return (
		<div className="space-y-8">
			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{cards.map((card, index) => (
					<motion.div
						key={card.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow group"
					>
						<div className="flex items-start justify-between mb-4">
							<div className={`p-3 rounded-xl ${card.bg}`}>
								<card.icon className={`w-6 h-6 ${card.color}`} />
							</div>
							<span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
								{card.title}
							</span>
						</div>
						<div>
							<h3 className="text-3xl font-black text-neutral-900 dark:text-white leading-tight">
								{card.value}
							</h3>
							<p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
								{card.label}
							</p>
							<p className="text-xs text-neutral-400 mt-1 font-medium">{card.subValue}</p>
						</div>
						<div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
							<p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 uppercase tracking-tight">
								<IconCheck className="w-3.5 h-3.5 text-green-500" />
								{card.footer}
							</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Featured Rating Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="p-8 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden group"
			>
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
				<div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700" />

				<div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
						<span className="text-blue-100 text-xs font-black uppercase tracking-[0.2em]">
							Overall Satisfaction
						</span>
						<div className="flex items-center gap-4">
							<div className="text-6xl font-black tabular-nums tracking-tighter">
								{summary.courseRating.toFixed(2)}
							</div>
							<div className="flex flex-col items-start gap-1">
								<div className="flex text-yellow-400">
									{[...Array(5)].map((_, i) => (
										<IconStar
											// biome-ignore lint/suspicious/noArrayIndexKey: <index is safe here>
											key={i}
											className={`w-6 h-6 ${
												i < Math.round(summary.courseRating) ? "fill-current" : "opacity-30"
											}`}
										/>
									))}
								</div>
								<span className="text-blue-50 text-sm font-bold">Course Quality Score</span>
							</div>
						</div>
					</div>

					<div className="h-20 w-px bg-white/20 hidden md:block" />

					<div className="flex flex-col items-center md:items-end text-center md:text-right gap-1">
						<span className="text-blue-100 text-xs font-black uppercase tracking-[0.2em]">
							Total Learning Value
						</span>
						<div className="text-4xl font-black">
							{Math.floor(summary.sessions.totalDurationMinutes / 60)}h{" "}
							{summary.sessions.totalDurationMinutes % 60}m
						</div>
						<p className="text-blue-200 text-sm font-medium">Accumulated Study Hours</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
};
