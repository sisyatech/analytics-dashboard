import { motion } from "motion/react";

export const LiveAnalytics = () => {
	return (
		<motion.div
			key="live-view"
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.98 }}
			className="space-y-6"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="h-24 rounded-2xl bg-linear-to-br from-blue-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-blue-50 dark:border-neutral-700 flex items-center justify-center text-blue-400 dark:text-neutral-500 font-medium"
					>
						Live Stat {i} (Placeholder)
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 h-100 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400">
					<div className="animate-pulse space-y-4 w-full px-8">
						<div className="h-4 bg-neutral-100 dark:bg-neutral-700 rounded w-1/4" />
						<div className="h-64 bg-neutral-50 dark:bg-neutral-800 rounded-xl" />
					</div>
					<p className="mt-4">Live Participation Map (Coming Soon)</p>
				</div>
				<div className="h-100 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400">
					Active Teachers List
				</div>
			</div>
		</motion.div>
	);
};
