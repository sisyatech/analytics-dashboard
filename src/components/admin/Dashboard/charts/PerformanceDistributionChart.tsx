import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS, GRADES } from "@/constants";

interface GradeData {
	grade: string;
	students: number;
}

export function PerformanceDistributionChart() {
	const [data, setData] = useState<GradeData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchGradeDistribution = async () => {
			setIsLoading(true);
			try {
				// Fetch courses for first 6 grades
				const gradePromises = GRADES.slice(0, 6).map(async (grade) => {
					try {
						const coursesResponse = await axiosInstance.post(API_ENDPOINTS.GET_COURSES_BY_GRADE, {
							grade,
						});
						const courses = coursesResponse.data?.courses || [];

						if (courses.length === 0) {
							return { grade: `Grade ${grade}`, students: 0 };
						}

						// Get students from first course in grade
						const studentsResponse = await axiosInstance.post(
							API_ENDPOINTS.GET_STUDENTS_BY_COURSE,
							{ bigCourseId: courses[0].id },
						);
						const students = studentsResponse.data?.students || [];

						return {
							grade: `Grade ${grade}`,
							students: students.length,
						};
					} catch (_error) {
						return { grade: `Grade ${grade}`, students: 0 };
					}
				});

				const gradeData = await Promise.all(gradePromises);
				setData(gradeData);
			} catch (_error) {
				//console.error("Error fetching grade distribution:", error);
				setData([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGradeDistribution();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
			className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
					Student Distribution
				</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">Students by grade level</p>
			</div>

			{isLoading ? (
				<div className="flex h-75 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
				</div>
			) : (
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
						<CartesianGrid
							strokeDasharray="3 3"
							className="stroke-neutral-200 dark:stroke-neutral-700"
						/>
						<XAxis
							dataKey="grade"
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
						<Bar dataKey="students" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</motion.div>
	);
}
