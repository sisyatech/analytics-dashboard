import { motion } from "motion/react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useEnrollmentTrends } from "@/hooks/admin/useDashboardStats";

export function EnrollmentTrendChart() {
	const { data, isLoading } = useEnrollmentTrends();
	const trendData = data?.data || [];

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
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
					Enrollment Trends
				</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					New student registrations over time
				</p>
			</div>

			{isLoading ? (
				<div className="flex h-[300px] items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
				</div>
			) : trendData.length === 0 ? (
				<div className="flex h-[300px] items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No enrollment data available</p>
				</div>
			) : (
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={formattedData}>
						<defs>
							<linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
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
						<Area
							type="monotone"
							dataKey="count"
							stroke="#3b82f6"
							fillOpacity={1}
							fill="url(#colorEnrollment)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</motion.div>
	);
}
