import {
	IconChevronRight,
	IconLoader,
	IconReportAnalytics,
	IconSearch,
	IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { StudentAvatar } from "@/components/admin/Reports/shared/StudentAvatar";
import { StudentPerformanceReport } from "@/components/admin/Reports/studentReport/StudentPerformanceReport";
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
import { useStudentsByCourse } from "@/hooks/analytics/usePerformance";
import { useAuthStore } from "@/store/useAuthStore";
import type { Course } from "@/types/analytics";
import type { Student } from "@/types/performance";

const StudentReport = () => {
	// Selection State
	const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { role, gradePermissions } = useAuthStore();

	const filteredGrades =
		role === "subadmin" && gradePermissions
			? GRADES.filter((g) => gradePermissions.includes(Number.parseInt(g, 10)))
			: GRADES;

	// Data Fetching
	const { data: coursesData, isLoading: isLoadingCourses } = useCoursesByGrade(selectedGrade);
	const { data: studentsData, isLoading: isLoadingStudents } =
		useStudentsByCourse(selectedCourseId);

	const handleGradeChange = (grade: string) => {
		setSelectedGrade(grade);
		setSelectedCourseId(null);
		setSelectedStudent(null);
		setSearchQuery("");
	};

	const handleCourseChange = (courseId: string) => {
		setSelectedCourseId(Number(courseId));
		setSelectedStudent(null);
		setSearchQuery("");
	};

	// Filter students
	const filteredStudents = useMemo(() => {
		if (!studentsData?.students) return [];
		return studentsData.students.filter(
			(s) =>
				s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.phone.includes(searchQuery) ||
				s.email.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [studentsData, searchQuery]);

	// View: Full Report
	if (selectedStudent && selectedCourseId) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className="h-full"
			>
				<StudentPerformanceReport
					student={selectedStudent}
					courseId={selectedCourseId}
					onBack={() => setSelectedStudent(null)}
				/>
			</motion.div>
		);
	}

	// View: Filter & List
	return (
		<div className="space-y-8 pb-10">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
					<IconReportAnalytics className="w-8 h-8 text-blue-600 dark:text-blue-400" />
					Student Report
				</h1>
				<p className="text-gray-500 dark:text-neutral-400 mt-1">
					Select a grade and course to view the student list.
				</p>
			</div>

			{/* Filters Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Grade Selection */}
				<div className="space-y-2">
					<div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Grade</div>
					<Select value={selectedGrade || ""} onValueChange={handleGradeChange}>
						<SelectTrigger className="w-full h-11 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
							<SelectValue placeholder="Select Grade" />
						</SelectTrigger>
						<SelectContent>
							{filteredGrades.map((g) => (
								<SelectItem key={g} value={g}>
									Grade {g}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Course Selection */}
				<div className="space-y-2">
					<div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Course</div>
					<Select
						disabled={!selectedGrade || isLoadingCourses}
						value={selectedCourseId?.toString() || ""}
						onValueChange={handleCourseChange}
					>
						<SelectTrigger className="w-full h-11 rounded-xl bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
							<SelectValue placeholder={isLoadingCourses ? "Loading..." : "Select Course"} />
						</SelectTrigger>
						<SelectContent>
							{coursesData?.courses.map((c: Course) => (
								<SelectItem key={c.id} value={c.id.toString()}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Student List Section */}
			<div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-inner min-h-125">
				{/* List Header & Search */}
				<div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-neutral-800 sticky top-0 z-10">
					<h3 className="font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-2">
						<IconUser className="w-5 h-5 text-blue-500" />
						Students
						{studentsData && (
							<span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
								{filteredStudents.length}
							</span>
						)}
					</h3>
					<div className="relative w-full sm:w-72 group">
						<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
						<Input
							placeholder="Search students..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
							disabled={!selectedCourseId}
						/>
					</div>
				</div>

				{/* List Content */}
				<div className="p-4 sm:p-6">
					{isLoadingStudents ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
							<IconLoader className="w-10 h-10 animate-spin mb-4 text-blue-500" />
							<p className="font-medium animate-pulse">Loading students...</p>
						</div>
					) : !selectedCourseId ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
							<div className="p-6 bg-white dark:bg-neutral-800 rounded-full shadow-sm mb-6 border border-neutral-100 dark:border-neutral-700">
								<IconReportAnalytics className="w-12 h-12 text-blue-200 dark:text-blue-800" />
							</div>
							<p className="font-medium text-lg text-neutral-600 dark:text-neutral-300">
								No Course Selected
							</p>
							<p className="text-sm">Select a grade and course to view the student list.</p>
						</div>
					) : filteredStudents.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
							<p className="font-medium">No students found matching your search.</p>
						</div>
					) : (
						<motion.div
							initial="hidden"
							animate="show"
							variants={{
								hidden: { opacity: 0 },
								show: {
									opacity: 1,
									transition: {
										staggerChildren: 0.05,
									},
								},
							}}
							className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
						>
							{filteredStudents.map((student) => {
								return (
									<motion.div
										key={student.id}
										variants={{
											hidden: { opacity: 0, y: 20 },
											show: { opacity: 1, y: 0 },
										}}
										whileHover={{ y: -4, scale: 1.01 }}
										onClick={() => setSelectedStudent(student)}
										className="group relative bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 cursor-pointer transition-all duration-300 overflow-hidden"
									>
										{/* Hover Gradient Overlay */}
										<div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										<div className="relative flex items-center gap-4">
											{/* Avatar */}
											<StudentAvatar student={student} />

											{/* Info */}
											<div className="flex-1 min-w-0">
												<h4 className="font-bold text-neutral-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
													{student.name}
												</h4>
												<p className="text-sm text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1.5">
													<IconUser className="w-3.5 h-3.5" />
													{student.email || "No email"}
												</p>
											</div>

											{/* Action Icon */}
											<div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
												<IconChevronRight className="w-5 h-5" />
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudentReport;
