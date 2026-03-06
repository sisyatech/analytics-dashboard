import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";

interface MentorActivityData {
	name: string;
	value: number;
	color: string;
}

export function MentorActivityChart() {
	const [data, setData] = useState<MentorActivityData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalMentors, setTotalMentors] = useState(0);

	useEffect(() => {
		const fetchMentorActivity = async () => {
			setIsLoading(true);
			try {
				const mentorsResponse = await axiosInstance.post(API_ENDPOINTS.GET_ACTIVE_MENTORS);
				const mentors = mentorsResponse.data?.mentors || [];

				setTotalMentors(mentors.length);

				// For now, we'll show a simple active/total breakdown
				// In the future, this could show mentors by subject, grade, etc.
				const activityData: MentorActivityData[] = [
					{
						name: "Active Mentors",
						value: mentors.length,
						color: "#8b5cf6",
					},
				];

				setData(activityData);
			} catch (_error) {
				//console.error("Error fetching mentor activity:", error);
				setData([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMentorActivity();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Mentor Overview</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Active mentors in the system
				</p>
			</div>

			{isLoading ? (
				<div className="flex h-75 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
				</div>
			) : data.length === 0 ? (
				<div className="flex h-75 items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No mentor data available</p>
				</div>
			) : (
				<div className="flex flex-col items-center">
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={5}
								dataKey="value"
							>
								{data.map((entry, index) => {
									return (
										<>
											{/* biome-ignore lint/suspicious: not dynamic nature index can be used here */}
											<Cell key={`cell-${index}`} fill={entry.color} />
										</>
									);
								})}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--tooltip-bg)",
									border: "1px solid var(--tooltip-border)",
									borderRadius: "8px",
								}}
								labelStyle={{ color: "var(--tooltip-text)" }}
							/>
						</PieChart>
					</ResponsiveContainer>
					<div className="mt-4 text-center">
						<p className="text-3xl font-bold text-neutral-900 dark:text-white">{totalMentors}</p>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">Total Active Mentors</p>
					</div>
				</div>
			)}
		</motion.div>
	);
}
