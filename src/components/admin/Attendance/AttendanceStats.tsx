import { IconPercentage, IconUserCheck, IconUsers, IconUserX } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { SessionAttendanceResponse } from "@/types/analytics";

interface AttendanceStatsProps {
	attendanceData: SessionAttendanceResponse;
}

export const AttendanceStats = ({ attendanceData }: AttendanceStatsProps) => {
	const stats = useMemo(() => {
		return [
			{
				label: "Total Enrolled",
				value: attendanceData.totalEnrolled,
				icon: <IconUsers className="w-5 h-5" />,
				color: "text-blue-600 dark:text-blue-400",
				bg: "bg-blue-50 dark:bg-blue-900/20",
			},
			{
				label: "Present",
				value: attendanceData.presentCount,
				icon: <IconUserCheck className="w-5 h-5" />,
				color: "text-emerald-600 dark:text-emerald-400",
				bg: "bg-emerald-50 dark:bg-emerald-900/20",
			},
			{
				label: "Absent",
				value: attendanceData.absentCount,
				icon: <IconUserX className="w-5 h-5" />,
				color: "text-rose-600 dark:text-rose-400",
				bg: "bg-rose-50 dark:bg-rose-900/20",
			},
			{
				label: "Attendance Rate",
				value: `${((attendanceData.presentCount / attendanceData.totalEnrolled) * 100).toFixed(
					1,
				)}%`,
				icon: <IconPercentage className="w-5 h-5" />,
				color: "text-amber-600 dark:text-amber-400",
				bg: "bg-amber-50 dark:bg-amber-900/20",
			},
		];
	}, [attendanceData]);

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat, i) => (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: i * 0.1 }}
					key={stat.label}
					className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm group hover:border-blue-500/30 transition-all duration-300"
				>
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"p-3 rounded-2xl group-hover:rotate-12 transition-transform duration-300",
								stat.bg,
							)}
						>
							<span className={stat.color}>{stat.icon}</span>
						</div>
						<div>
							<h3 className="text-xl font-black dark:text-white tracking-tight leading-none mb-1">
								{stat.value}
							</h3>
							<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
								{stat.label}
							</p>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};
