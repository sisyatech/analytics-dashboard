import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AttendancePage() {
	const [viewType, setViewType] = useState<"attendance" | "live">("attendance");

	return (
		<DashboardLayout actor="admin" userName="Admin User">
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{viewType === "attendance" ? "Attendance Analytics" : "Live Session Analytics"}
						</h1>
						<p className="text-gray-500 dark:text-neutral-400 mt-2">
							{viewType === "attendance"
								? "Monitor and manage student attendance records."
								: "Real-time engagement and presence in live sessions."}
						</p>
					</div>
					<Select
						value={viewType}
						onValueChange={(val) => setViewType(val as "attendance" | "live")}
					>
						<SelectTrigger className="w-[180px] bg-white dark:bg-neutral-800">
							<SelectValue placeholder="Select View" />
						</SelectTrigger>
						<SelectContent className="bg-white dark:bg-neutral-800">
							<SelectItem value="attendance">Attendance</SelectItem>
							<SelectItem value="live">Live</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{viewType === "attendance" ? (
					<div className="space-y-6 animate-in fade-in duration-500">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-32 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 animate-pulse"
								/>
							))}
						</div>

						<div className="h-96 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400">
							Attendance Chart Placeholder
						</div>
					</div>
				) : (
					<div className="space-y-6 animate-in fade-in duration-500">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-24 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900 border border-blue-100 dark:border-neutral-700 flex items-center justify-center text-blue-400 dark:text-neutral-500"
								>
									Live Stat {i}
								</div>
							))}
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 h-80 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400">
								Live Participation Map
							</div>
							<div className="h-80 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400">
								Active Teachers
							</div>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
