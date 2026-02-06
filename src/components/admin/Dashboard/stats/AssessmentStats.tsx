import { IconClipboardCheck, IconNotebook } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useAssessmentStats } from "@/hooks/admin/useDashboardStats";

export function AssessmentStats() {
	const { data, isLoading } = useAssessmentStats();

	// Default zero values to handle loading/undefined states safely
	const stats = data?.data || {
		tests: { total: 0, totalSubmissions: 0, avgCompletionRate: 0 },
		homework: { total: 0, totalSubmissions: 0, avgCompletionRate: 0 },
	};

	const LoadingSkeleton = () => (
		<div className="h-24 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-700" />
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.3 }}
			className="flex flex-col gap-4"
		>
			{isLoading ? (
				<>
					<LoadingSkeleton />
					<LoadingSkeleton />
				</>
			) : (
				<>
					<div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
									Total Tests
								</p>
								<p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
									{stats.tests.total.toLocaleString()}
								</p>
								<p className="mt-1 text-xs text-neutral-500">
									{stats.tests.totalSubmissions.toLocaleString()} Submissions
								</p>
							</div>
							<div className="rounded-lg bg-pink-100 p-3 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
								<IconClipboardCheck className="h-6 w-6" />
							</div>
						</div>
					</div>

					<div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
									Total Homework
								</p>
								<p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
									{stats.homework.total.toLocaleString()}
								</p>
								<p className="mt-1 text-xs text-neutral-500">
									{stats.homework.totalSubmissions.toLocaleString()} Submissions
								</p>
							</div>
							<div className="rounded-lg bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
								<IconNotebook className="h-6 w-6" />
							</div>
						</div>
					</div>
				</>
			)}
		</motion.div>
	);
}
