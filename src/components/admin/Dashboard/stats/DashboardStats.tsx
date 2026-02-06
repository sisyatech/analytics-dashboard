import { IconBooks, IconSchool, IconUsers, IconVideo } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { DashboardOverviewResponse } from "@/types/dashboard";

interface StatCardProps {
	title: string;
	value: number;
	trend: number;
	icon: "students" | "mentors" | "sessions" | "courses";
	delay?: number;
}

const iconMap = {
	students: IconUsers,
	mentors: IconSchool,
	sessions: IconVideo,
	courses: IconBooks,
};

const colorMap = {
	students: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
	mentors: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
	sessions: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
	courses: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

function StatCard({ title, value, icon, delay = 0 }: Omit<StatCardProps, "trend">) {
	const Icon = iconMap[icon];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
					<motion.p
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: delay + 0.2 }}
						className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white"
					>
						{value.toLocaleString()}
					</motion.p>
				</div>
				<div className={`rounded-lg p-3 ${colorMap[icon]}`}>
					<Icon className="h-6 w-6" />
				</div>
			</div>
		</motion.div>
	);
}

interface DashboardStatsCardsProps {
	stats: DashboardOverviewResponse["data"];
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<StatCard title="Total Students" value={stats.totalStudents} icon="students" delay={0} />
			<StatCard title="Total Courses" value={stats.totalCourses} icon="courses" delay={0.1} />
			<StatCard title="Total Sessions" value={stats.totalSessions} icon="sessions" delay={0.2} />
			<StatCard title="Doubts Resolved" value={stats.doubts.solved} icon="mentors" delay={0.3} />
		</div>
	);
}
