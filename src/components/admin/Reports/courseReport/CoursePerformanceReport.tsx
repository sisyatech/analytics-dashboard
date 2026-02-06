import { IconArrowLeft, IconBooks, IconLoader } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	useCourseHomework,
	useCourseReviews,
	useCourseSummary,
	useCourseTests,
	useInfiniteCourseSessions,
} from "@/hooks/analytics/useCoursePerformance";
import { CourseHomeworkView } from "./CourseHomeworkView";
import { CourseReviewsView } from "./CourseReviewsView";
import { CourseSessionsView } from "./CourseSessionsView";
import { CourseSummaryView } from "./CourseSummaryView";
import { CourseTestsView } from "./CourseTestsView";

interface CoursePerformanceReportProps {
	bigCourseId: number;
	onBack: () => void;
}

export const CoursePerformanceReport = ({ bigCourseId, onBack }: CoursePerformanceReportProps) => {
	const [activeTab, setActiveTab] = useState<
		"summary" | "sessions" | "homework" | "reviews" | "tests"
	>("summary");

	const { data: summaryData, isLoading: isLoadingSummary } = useCourseSummary(bigCourseId);
	const {
		data: sessionsData,
		isLoading: isLoadingSessions,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteCourseSessions({ bigCourseId, limit: 21 });
	const { data: homeworkData, isLoading: isLoadingHomework } = useCourseHomework(bigCourseId);
	const { data: reviewsData, isLoading: isLoadingReviews } = useCourseReviews(bigCourseId);
	const { data: testsData, isLoading: isLoadingTests } = useCourseTests(bigCourseId);

	const tabs = [
		{ id: "summary", label: "Summary" },
		{ id: "sessions", label: "Sessions" },
		{ id: "homework", label: "Homework" },
		{ id: "reviews", label: "Reviews" },
		{ id: "tests", label: "Tests" },
	] as const;

	return (
		<div className="space-y-6">
			{/* Header with Back Button */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" onClick={onBack} className="rounded-full shrink-0">
					<IconArrowLeft className="w-5 h-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
						<IconBooks className="w-6 h-6 text-blue-500" />
						Course Performance Report
					</h2>
					<p className="text-neutral-500 text-sm mt-1">
						Analyzing metrics for Course ID #{bigCourseId}
					</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 w-fit">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
							activeTab === tab.id
								? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
								: "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Content */}
			<div className="min-h-125">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					{activeTab === "summary" &&
						(isLoadingSummary ? (
							<TabLoader label="summary" />
						) : (
							summaryData && <CourseSummaryView summary={summaryData.summary} />
						))}
					{activeTab === "sessions" &&
						(isLoadingSessions && !sessionsData ? (
							<TabLoader label="sessions" />
						) : (
							sessionsData && (
								<CourseSessionsView
									sessions={sessionsData.pages.flatMap((page) => page.sessions)}
									fetchNextPage={fetchNextPage}
									hasNextPage={!!hasNextPage}
									isFetchingNextPage={isFetchingNextPage}
								/>
							)
						))}
					{activeTab === "homework" &&
						(isLoadingHomework ? (
							<TabLoader label="homework" />
						) : (
							homeworkData && <CourseHomeworkView data={homeworkData.homeworkDetails} />
						))}
					{activeTab === "reviews" &&
						(isLoadingReviews ? (
							<TabLoader label="reviews" />
						) : (
							reviewsData && <CourseReviewsView data={reviewsData.reviewDetails} />
						))}
					{activeTab === "tests" &&
						(isLoadingTests ? (
							<TabLoader label="tests" />
						) : (
							testsData && <CourseTestsView data={testsData.testDetails} />
						))}
				</motion.div>
			</div>
		</div>
	);
};

const TabLoader = ({ label }: { label: string }) => (
	<div className="flex flex-col items-center justify-center py-32 text-neutral-400 bg-white dark:bg-neutral-900/50 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 shadow-inner">
		<IconLoader className="w-10 h-10 animate-spin mb-4 text-blue-500" />
		<p className="font-medium animate-pulse uppercase tracking-widest text-xs">
			Loading {label} data...
		</p>
	</div>
);
