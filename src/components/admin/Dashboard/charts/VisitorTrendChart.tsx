import { motion } from "motion/react";
import { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useVisitorStats } from "@/hooks/admin/useDashboardStats";

export function VisitorTrendChart() {
	const [days, setDays] = useState(30);
	const { data, isLoading } = useVisitorStats(days);
	const trendData = data?.data?.history || [];

	// Format date for display
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
			transition={{ duration: 0.4 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Visitor Trends</h3>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Unique visitors over time
					</p>
				</div>
				<div className="flex gap-2">
					{[30, 60, 90].map((range) => (
						<button
							type="button"
							key={range}
							onClick={() => setDays(range)}
							className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
								days === range
									? "bg-blue-600 text-white"
									: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
							}`}
						>
							{range} Days
						</button>
					))}
				</div>
			</div>

			{isLoading ? (
				<div className="flex h-[300px] items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
				</div>
			) : trendData.length === 0 ? (
				<div className="flex h-[300px] items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No visitor data available</p>
				</div>
			) : (
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={formattedData}>
						<defs>
							<linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-neutral-200 dark:stroke-neutral-700"
						/>
						<XAxis
							dataKey="displayDate"
							className="text-xs text-neutral-600 dark:text-neutral-400"
							tick={{ fill: "currentColor" }}
							minTickGap={30}
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
							itemStyle={{ fontSize: "12px" }}
							labelStyle={{ color: "var(--tooltip-text)", fontWeight: "bold", marginBottom: "4px" }}
						/>
						<Area
							type="monotone"
							dataKey="uniqueVisitors"
							name="Unique Visitors"
							stroke="#3b82f6"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorVisitors)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</motion.div>
	);
}
