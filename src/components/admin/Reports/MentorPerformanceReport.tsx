import { IconArrowLeft, IconLoader } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useState } from "react";
import { MentorDoubtsView } from "@/components/admin/Reports/MentorDoubtsView";
import { MentorReviewsView } from "@/components/admin/Reports/MentorReviewsView";
import { MentorSessionsView } from "@/components/admin/Reports/MentorSessionsView";
import { MentorSummaryView } from "@/components/admin/Reports/MentorSummaryView";
import { Button } from "@/components/ui/button";
import {
	useMentorPerformanceDoubts,
	useMentorPerformanceReviews,
	useMentorPerformanceSessions,
	useMentorPerformanceSummary,
} from "@/hooks/analytics/usePerformance";
import type { Mentor } from "@/types/performance";

interface MentorPerformanceReportProps {
	mentor: Mentor;
	onBack: () => void;
}

export const MentorPerformanceReport = ({ mentor, onBack }: MentorPerformanceReportProps) => {
	const [activeTab, setActiveTab] = useState<"summary" | "sessions" | "reviews" | "doubts">(
		"summary",
	);

	// Performance Data
	const { data: summaryData, isLoading: isLoadingSummary } = useMentorPerformanceSummary(mentor.id);
	const { data: sessionsData, isLoading: isLoadingSessions } = useMentorPerformanceSessions(
		mentor.id,
	);
	const { data: reviewsData, isLoading: isLoadingReviews } = useMentorPerformanceReviews(mentor.id);
	const { data: doubtsData, isLoading: isLoadingDoubts } = useMentorPerformanceDoubts(mentor.id);

	const isLoading = isLoadingSummary || isLoadingSessions || isLoadingReviews || isLoadingDoubts;

	return (
		<div className="space-y-6">
			{/* Header with Back Button */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" onClick={onBack} className="rounded-full shrink-0">
					<IconArrowLeft className="w-5 h-5" />
				</Button>
				<div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white dark:border-neutral-800 shadow-lg shrink-0">
					<img
						src={`https://sisyaclass.xyz/student/thumbs/mentors/${mentor.id}.jpg`}
						alt={mentor.name}
						className="w-full h-full object-cover"
						onError={(e) => {
							const target = e.currentTarget;
							target.style.display = "none";
							const parent = target.parentElement;
							if (parent) {
								parent.classList.add(
									"bg-blue-600",
									"flex",
									"items-center",
									"justify-center",
									"text-white",
									"font-bold",
									"text-2xl",
								);
								parent.innerText = mentor.name.charAt(0);
							}
						}}
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
						{mentor.name}
					</h2>
					<div className="flex items-center gap-3 mt-1">
						<p className="text-sm font-medium text-neutral-500">{mentor.email}</p>
						<span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
						<p className="text-sm text-neutral-400">{mentor.phone}</p>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 w-fit">
				{(["summary", "sessions", "reviews", "doubts"] as const).map((tab) => (
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
							<MentorSummaryView summary={summaryData.summary} />
						)}
						{activeTab === "sessions" && sessionsData && (
							<MentorSessionsView data={sessionsData.sessions} />
						)}
						{activeTab === "reviews" && reviewsData && (
							<MentorReviewsView data={reviewsData.reviewDetails} />
						)}
						{activeTab === "doubts" && doubtsData && (
							<MentorDoubtsView data={doubtsData.doubtDetails} />
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
};
