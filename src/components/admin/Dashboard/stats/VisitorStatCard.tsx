import { IconEye } from "@tabler/icons-react";
import { motion } from "motion/react";

interface VisitorStatCardProps {
	uniqueVisitors: number;
	isLoading?: boolean;
}

export function VisitorStatCard({ uniqueVisitors, isLoading }: VisitorStatCardProps) {
	if (isLoading) {
		return (
			<div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm animate-pulse dark:border-neutral-700 dark:bg-neutral-800">
				<div className="h-4 w-24 bg-neutral-200 rounded dark:bg-neutral-700 mb-4" />
				<div className="h-8 w-16 bg-neutral-200 rounded dark:bg-neutral-700" />
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
						Today's Visitors
					</p>
					<motion.p
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white"
					>
						{uniqueVisitors.toLocaleString()}
					</motion.p>
				</div>
				<div className="rounded-lg bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
					<IconEye className="h-6 w-6" />
				</div>
			</div>
		</motion.div>
	);
}
