import { IconBooks, IconChevronRight, IconLoader, IconSearch } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { CoursePerformanceReport } from "@/components/admin/Reports/courseReport/CoursePerformanceReport";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GRADES } from "@/constants";
import { useCoursesByGrade } from "@/hooks/analytics/useAttendance";
import type { Course } from "@/types/analytics";

const CourseReport = () => {
	const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: coursesData, isLoading: isLoadingCourses } = useCoursesByGrade(selectedGrade);

	const handleGradeChange = (grade: string) => {
		setSelectedGrade(grade);
		setSelectedCourseId(null);
		setSearchQuery("");
	};

	const filteredCourses = useMemo(() => {
		if (!coursesData?.courses) return [];
		return coursesData.courses.filter((c: Course) =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [coursesData, searchQuery]);

	if (selectedCourseId) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className="pb-10"
			>
				<CoursePerformanceReport
					bigCourseId={selectedCourseId}
					onBack={() => setSelectedCourseId(null)}
				/>
			</motion.div>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
					<IconBooks className="w-8 h-8 text-blue-600 dark:text-blue-400" />
					Course Report
				</h1>
				<p className="text-gray-500 dark:text-neutral-400 mt-1">
					Select a grade to see available courses and view their performance reports.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Grade</div>
					<Select value={selectedGrade || ""} onValueChange={handleGradeChange}>
						<SelectTrigger className="w-full h-11 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
							<SelectValue placeholder="Select Grade" />
						</SelectTrigger>
						<SelectContent>
							{GRADES.map((g) => (
								<SelectItem key={g} value={g}>
									Grade {g}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-inner min-h-125">
				<div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-neutral-800 sticky top-0 z-10">
					<h3 className="font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-2">
						<IconBooks className="w-5 h-5 text-blue-500" />
						Courses
						{coursesData && (
							<span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
								{filteredCourses.length}
							</span>
						)}
					</h3>
					<div className="relative w-full sm:w-72 group">
						<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
						<Input
							placeholder="Search courses..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
							disabled={!selectedGrade}
						/>
					</div>
				</div>

				<div className="p-4 sm:p-6">
					{isLoadingCourses ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
							<IconLoader className="w-10 h-10 animate-spin mb-4 text-blue-500" />
							<p className="font-medium animate-pulse">Loading courses...</p>
						</div>
					) : !selectedGrade ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
							<div className="p-6 bg-white dark:bg-neutral-800 rounded-full shadow-sm mb-6 border border-neutral-100 dark:border-neutral-700">
								<IconBooks className="w-12 h-12 text-blue-200 dark:text-blue-800" />
							</div>
							<p className="font-medium text-lg text-neutral-600 dark:text-neutral-300">
								No Grade Selected
							</p>
							<p className="text-sm">Select a grade to view available courses.</p>
						</div>
					) : filteredCourses.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
							<p className="font-medium">No courses found matching your search.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
							{filteredCourses.map((course: Course, index: number) => (
								<motion.div
									key={course.id}
									initial={{ opacity: 0, y: 15 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.03 }}
									whileHover={{ y: -5, scale: 1.02 }}
									onClick={() => setSelectedCourseId(course.id)}
									className="group relative bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 cursor-pointer transition-all duration-300 overflow-hidden"
								>
									{/* Decorative background accent */}
									<div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-blue-500/10 transition-colors" />

									<div className="relative flex flex-col h-full">
										<div className="flex items-start justify-between gap-4 mb-4">
											<div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
												<IconBooks className="w-5 h-5" />
											</div>
											<div className="flex flex-wrap gap-1.5 justify-end">
												{course.isLongTerm && (
													<span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
														Long Term
													</span>
												)}
												{course.isFree && (
													<span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
														Free
													</span>
												)}
											</div>
										</div>

										<div className="space-y-1.5 flex-1">
											<h4 className="text-lg font-black text-neutral-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize leading-tight">
												{course.name}
											</h4>
											<div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 group-hover:text-neutral-500 transition-colors">
												<span className="bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded uppercase tracking-wider">
													ID: {course.id}
												</span>
												<span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
												<span>Click to view report</span>
											</div>
										</div>

										<div className="mt-6 pt-4 border-t border-neutral-50 dark:border-neutral-700/50 flex items-center justify-between text-blue-600 dark:text-blue-400">
											<span className="text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
												View analytics
											</span>
											<IconChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
										</div>
									</div>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CourseReport;
