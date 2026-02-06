import { IconStar } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useCoursePerformance } from "@/hooks/admin/useDashboardStats";

export function CoursePerformanceTable() {
	const { data, isLoading } = useCoursePerformance();
	const courses = data?.data || [];

	// Sort by enrollment count
	const sortedCourses = [...courses].sort((a, b) => b.enrollmentCount - a.enrollmentCount);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
			className="col-span-1 lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
		>
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
					Course Performance
				</h3>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Overview of courses by enrollment and rating
				</p>
			</div>

			{isLoading ? (
				<div className="flex h-[300px] items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
				</div>
			) : courses.length === 0 ? (
				<div className="flex h-[300px] items-center justify-center">
					<p className="text-neutral-500 dark:text-neutral-400">No course data available</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
							<tr>
								<th className="px-4 py-3 font-medium">Course Name</th>
								<th className="px-4 py-3 font-medium">Grade</th>
								<th className="px-4 py-3 font-medium text-center">Students</th>
								<th className="px-4 py-3 font-medium text-center">Sessions</th>
								<th className="px-4 py-3 font-medium text-right">Rating</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
							{sortedCourses.map((course) => (
								<tr
									key={course.courseId}
									className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
								>
									<td
										className="px-4 py-3 font-medium text-neutral-900 dark:text-white max-w-xs truncate"
										title={course.courseName}
									>
										{course.courseName}
									</td>
									<td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
										<span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
											Grade {course.grade}
										</span>
									</td>
									<td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">
										{course.enrollmentCount}
									</td>
									<td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-400">
										{course.sessionCount}
									</td>
									<td className="px-4 py-3 text-right">
										<div className="flex items-center justify-end gap-1 text-amber-500">
											<IconStar className="h-4 w-4 fill-current" />
											<span className="font-semibold">{course.avgRating.toFixed(1)}</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</motion.div>
	);
}
