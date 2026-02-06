import { motion } from "motion/react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useSessionTrends } from "@/hooks/admin/useDashboardStats";

export function SessionTrendChart() {
	const { data, isLoading } = useSessionTrends();
	const trendData = data?.data || [];

	const formattedData = trendData.map((item) => ({
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
			transition={{ duration: 0.4, delay: 0.4 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
					Session Analytics
				</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Sessions and Attendance Trends
				</p>
			</div>

			{isLoading ? (
				<div className="flex h-[300px] items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
				</div>
			) : trendData.length === 0 ? (
				<div className="flex h-[300px] items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No session data available</p>
				</div>
			) : (
				<ResponsiveContainer width="100%" height={300}>
					<ComposedChart data={formattedData}>
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
							yAxisId="left"
							className="text-xs text-neutral-600 dark:text-neutral-400"
							tick={{ fill: "currentColor" }}
							label={{
								value: "Sessions",
								angle: -90,
								position: "insideLeft",
								style: { fill: "currentColor", fontSize: 10 },
							}}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							className="text-xs text-neutral-600 dark:text-neutral-400"
							tick={{ fill: "currentColor" }}
							label={{
								value: "Avg Attendance",
								angle: 90,
								position: "insideRight",
								style: { fill: "currentColor", fontSize: 10 },
							}}
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
						<Bar
							yAxisId="left"
							dataKey="sessionCount"
							name="Sessions"
							fill="#3b82f6"
							radius={[4, 4, 0, 0]}
							barSize={20}
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="avgAttendance"
							name="Avg Attendance"
							stroke="#10b981"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			)}
		</motion.div>
	);
}
