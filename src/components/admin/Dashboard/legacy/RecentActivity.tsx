import { IconClipboardCheck, IconNotebook, IconUserPlus, IconVideo } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { useRecentActivity } from "@/hooks/admin/useDashboardStats";
import type { RecentActivityItem } from "@/types/dashboard";

const getActivityIcon = (type: RecentActivityItem["type"]) => {
	switch (type) {
		case "HOMEWORK_CREATED":
			return {
				icon: IconNotebook,
				color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
			};
		case "HOMEWORK_SUBMITTED":
			return {
				icon: IconClipboardCheck,
				color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
			};
		case "USER_SIGNUP":
			return {
				icon: IconUserPlus,
				color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
			};
		case "SESSION_COMPLETED":
			return {
				icon: IconVideo,
				color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
			};
		default:
			return {
				icon: IconNotebook,
				color: "text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800",
			};
	}
};

export function RecentActivity() {
	const { data, isLoading } = useRecentActivity();
	const activities = data?.data || [];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.6 }}
			className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Activity</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Latest updates from across the platform
				</p>
			</div>

			<div className="h-75 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden scrollbar-none">
				{isLoading ? (
					<div className="space-y-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="flex gap-4 animate-pulse">
								<div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-700" />
								<div className="flex-1 space-y-2">
									<div className="h-4 w-3/4 rounded bg-neutral-100 dark:bg-neutral-700" />
									<div className="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-700" />
								</div>
							</div>
						))}
					</div>
				) : activities.length === 0 ? (
					<p className="text-center text-neutral-500 py-8">No recent activity</p>
				) : (
					<div className="space-y-6">
						{activities.map((activity, index) => {
							const { icon: Icon, color } = getActivityIcon(activity.type);
							return (
								<>
									{/* biome-ignore lint/suspicious: div used as clickable element */}
									<div key={index} className="relative flex gap-4">
										{/* Vertical connector line */}
										{index !== activities.length - 1 && (
											<div className="absolute left-4.75 top-10 h-full w-0.5 bg-neutral-100 dark:bg-neutral-700" />
										)}

										<div
											className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color}`}
										>
											<Icon className="h-5 w-5" />
										</div>

										<div className="flex-1 pt-1">
											<p className="text-sm font-medium text-neutral-900 dark:text-white">
												{activity.description}
											</p>
											<p className="mt-1 text-xs text-neutral-500">
												{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
											</p>
										</div>
									</div>
								</>
							);
						})}
					</div>
				)}
			</div>
		</motion.div>
	);
}
