import { motion } from "motion/react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useDoubtTrends } from "@/hooks/admin/useDashboardStats";

export function DoubtAnalyticsChart() {
	const { data, isLoading } = useDoubtTrends();
	const doubtData = data?.data || [];

	const formattedData = doubtData.map((item) => ({
		...item,
		displayDate: new Date(item.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
	}));

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.1 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Doubt Resolution</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">Created vs Solved doubts</p>
			</div>

			{isLoading ? (
				<div className="flex h-[300px] items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
				</div>
			) : doubtData.length === 0 ? (
				<div className="flex h-[300px] items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No doubt data available</p>
				</div>
			) : (
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={formattedData}>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-neutral-200 dark:stroke-neutral-700"
						/>
						<XAxis
							dataKey="displayDate"
							className="text-xs text-neutral-600 dark:text-neutral-400"
							tick={{ fill: "currentColor" }}
						/>
						<YAxis
							className="text-xs text-neutral-600 dark:text-neutral-400"
							tick={{ fill: "currentColor" }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "var(--tooltip-bg)",
								border: "1px solid var(--tooltip-border)",
								borderRadius: "8px",
							}}
							labelStyle={{ color: "var(--tooltip-text)" }}
						/>
						<Legend />
						<Bar dataKey="created" name="Created" fill="#f97316" radius={[4, 4, 0, 0]} />
						<Bar dataKey="solved" name="Solved" fill="#22c55e" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</motion.div>
	);
}
