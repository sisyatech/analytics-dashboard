import { IconArrowLeft, IconLoader, IconUser } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AssessmentsView } from "@/components/admin/Reports/AssessmentsView";
import { AttendanceView } from "@/components/admin/Reports/AttendanceView";
import { CoinsView } from "@/components/admin/Reports/CoinsView";
import { HomeworkView } from "@/components/admin/Reports/HomeworkView";
import { PerformanceSummary } from "@/components/admin/Reports/PerformanceSummary";
import { Button } from "@/components/ui/button";
import {
	usePerformanceAttendance,
	usePerformanceCoins,
	usePerformanceHomework,
	usePerformanceQuizzes,
	usePerformanceSummary,
	usePerformanceTests,
} from "@/hooks/analytics/usePerformance";
import type { Student } from "@/types/performance";

interface StudentPerformanceReportProps {
	student: Student;
	courseId: number;
	onBack: () => void;
}

export const StudentPerformanceReport = ({
	student,
	courseId,
	onBack,
}: StudentPerformanceReportProps) => {
	const [activeTab, setActiveTab] = useState<
		"summary" | "attendance" | "assessments" | "homework" | "coins"
	>("summary");

	// Performance Data
	const { data: summaryData, isLoading: isLoadingSummary } = usePerformanceSummary(
		student.id,
		courseId,
	);
	const { data: attendanceData, isLoading: isLoadingAttendance } = usePerformanceAttendance(
		student.id,
		courseId,
	);
	const { data: quizData, isLoading: isLoadingQuizzes } = usePerformanceQuizzes(
		student.id,
		courseId,
	);
	const { data: testData, isLoading: isLoadingTests } = usePerformanceTests(student.id, courseId);
	const { data: homeworkData, isLoading: isLoadingHomework } = usePerformanceHomework(
		student.id,
		courseId,
	);
	const { data: coinsData, isLoading: isLoadingCoins } = usePerformanceCoins(student.id);

	const isLoading =
		isLoadingSummary ||
		isLoadingAttendance ||
		isLoadingQuizzes ||
		isLoadingTests ||
		isLoadingHomework ||
		isLoadingCoins;

	return (
		<div className="space-y-6">
			{/* Header with Back Button */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" onClick={onBack} className="rounded-full shrink-0">
					<IconArrowLeft className="w-5 h-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
						<IconUser className="w-6 h-6 text-blue-500" />
						{student.name}
					</h2>
					<p className="text-sm text-neutral-500">Results for Grade {student.grade}</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 w-fit">
				{(["summary", "attendance", "assessments", "homework", "coins"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
							activeTab === tab
								? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
								: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
						}`}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				))}
			</div>

			{/* Content */}
			<div className="min-h-100">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-20 text-neutral-400">
						<IconLoader className="w-8 h-8 animate-spin mb-4" />
						<p>Loading performance data...</p>
					</div>
				) : (
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
					>
						{activeTab === "summary" && summaryData && (
							<PerformanceSummary summary={summaryData.summary} />
						)}
						{activeTab === "attendance" && attendanceData && (
							<AttendanceView data={attendanceData.attendanceDetails} />
						)}
						{activeTab === "assessments" && quizData && testData && (
							<AssessmentsView quizData={quizData} testData={testData} />
						)}
						{activeTab === "homework" && homeworkData && (
							<HomeworkView data={homeworkData.homeworkDetails} />
						)}
						{activeTab === "coins" && coinsData && <CoinsView data={coinsData.data} />}
					</motion.div>
				)}
			</div>
		</div>
	);
};
