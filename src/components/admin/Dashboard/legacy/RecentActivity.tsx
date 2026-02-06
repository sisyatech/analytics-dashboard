import { motion } from "motion/react";

/**
 * @deprecated This component is no longer used in the new dashboard layout.
 * Kept for reference or future reinstatement if needed.
 */
export function RecentActivity() {
	return (
		<motion.div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Activity</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					This component has been deprecated and removed from the view.
				</p>
			</div>
		</motion.div>
	);
}
