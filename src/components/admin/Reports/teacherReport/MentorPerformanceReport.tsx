import { IconArrowLeft, IconCoin, IconInfoCircle, IconLoader } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	useAllocateRewardBudget,
	useMentorPerformanceDoubts,
	useMentorPerformanceReviews,
	useMentorPerformanceSessions,
	useMentorPerformanceSummary,
	useMentorRewardTransactions,
} from "@/hooks/analytics/usePerformance";
import type { Mentor } from "@/types/performance";
import { MentorDoubtsView } from "./MentorDoubtsView";
import { MentorReviewsView } from "./MentorReviewsView";
import { MentorRewardsView } from "./MentorRewardsView";
import { MentorSessionsView } from "./MentorSessionsView";
import { MentorSummaryView } from "./MentorSummaryView";

interface MentorPerformanceReportProps {
	mentor: Mentor;
	onBack: () => void;
}

export const MentorPerformanceReport = ({ mentor, onBack }: MentorPerformanceReportProps) => {
	const [activeTab, setActiveTab] = useState<
		"summary" | "sessions" | "reviews" | "doubts" | "rewards"
	>("summary");
	const [isBudgetOpen, setIsBudgetOpen] = useState(false);
	const budgetRef = useRef<HTMLDivElement>(null);

	// Performance Data
	const { data: summaryData, isLoading: isLoadingSummary } = useMentorPerformanceSummary(mentor.id);
	const { data: sessionsData, isLoading: isLoadingSessions } = useMentorPerformanceSessions(
		mentor.id,
	);
	const { data: reviewsData, isLoading: isLoadingReviews } = useMentorPerformanceReviews(mentor.id);
	const { data: doubtsData, isLoading: isLoadingDoubts } = useMentorPerformanceDoubts(mentor.id);
	const {
		data: rewardsData,
		isLoading: isLoadingRewards,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useMentorRewardTransactions(mentor.id);

	const allocateMutation = useAllocateRewardBudget();

	const handleTopUp = async () => {
		if (window.confirm("Are you sure you want to top up the budget by 500?")) {
			try {
				await allocateMutation.mutateAsync({ mentorId: mentor.id, amount: 500 });
			} catch (error) {
				console.error("Failed to top up budget:", error);
				alert("Failed to top up budget. Please try again.");
			}
		}
	};

	const isLoading =
		isLoadingSummary ||
		isLoadingSessions ||
		isLoadingReviews ||
		isLoadingDoubts ||
		isLoadingRewards;

	// Flatten transactions for infinite scroll
	const rewardTransactions = rewardsData?.pages
		? {
				spent: rewardsData.pages.flatMap((page) => page?.data?.spent?.data || []),
				received: rewardsData.pages.flatMap((page) => page?.data?.received?.data || []),
			}
		: { spent: [], received: [] };

	// Close budget dropdown on click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
				setIsBudgetOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="space-y-6">
			{/* Header with Back Button */}
			<div className="flex items-center justify-between">
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

				{/* Reward Budget Header */}
				{summaryData?.summary.rewardBudget && (
					<div className="relative" ref={budgetRef}>
						<button
							type="button"
							onClick={() => setIsBudgetOpen(!isBudgetOpen)}
							className="flex items-center gap-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2 pr-4 hover:shadow-md transition-all cursor-pointer group"
						>
							<div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
								<IconCoin className="w-6 h-6 filled" />
							</div>
							<div className="text-left">
								<p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
									Reward Budget
								</p>
								<p className="text-xl font-bold text-neutral-900 dark:text-white leading-none">
									{summaryData.summary.rewardBudget.balance}
								</p>
							</div>
						</button>

						<AnimatePresence>
							{isBudgetOpen && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.95 }}
									className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50"
								>
									<div className="bg-neutral-50 dark:bg-neutral-900 p-4 border-b border-neutral-100 dark:border-neutral-800">
										<h4 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
											<IconInfoCircle className="w-4 h-4 text-neutral-500" />
											Budget Details
										</h4>
									</div>
									<div className="p-4 space-y-4">
										<div className="space-y-2">
											<p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
												Usage Limits
											</p>
											<div className="flex justify-between items-center text-sm">
												<span className="text-neutral-600 dark:text-neutral-300">Daily Limit</span>
												<span className="font-mono font-bold">
													{summaryData.summary.rewardBudget.limits.daily}
												</span>
											</div>
											<div className="flex justify-between items-center text-sm">
												<span className="text-neutral-600 dark:text-neutral-300">
													Monthly Limit
												</span>
												<span className="font-mono font-bold">
													{summaryData.summary.rewardBudget.limits.monthly || "Unlimited"}
												</span>
											</div>
										</div>
										<div className="space-y-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-700">
											<p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
												Current Usage
											</p>
											<div className="flex justify-between items-center text-sm">
												<span className="text-neutral-600 dark:text-neutral-300">Used Today</span>
												<span className="font-mono font-bold text-red-500">
													{summaryData.summary.rewardBudget.usage.today}
												</span>
											</div>
											<div className="flex justify-between items-center text-sm">
												<span className="text-neutral-600 dark:text-neutral-300">
													Used This Month
												</span>
												<span className="font-mono font-bold text-red-500">
													{summaryData.summary.rewardBudget.usage.thisMonth}
												</span>
											</div>
										</div>

										<div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
											<Button
												onClick={handleTopUp}
												disabled={allocateMutation.isPending}
												className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
											>
												{allocateMutation.isPending ? (
													<IconLoader className="w-4 h-4 animate-spin" />
												) : (
													<>
														<IconCoin className="w-4 h-4" />
														Top-up Budget (+500)
													</>
												)}
											</Button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				)}
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 w-fit overflow-x-auto max-w-full">
				{(["summary", "sessions", "reviews", "doubts", "rewards"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
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
						{activeTab === "rewards" && rewardsData && (
							<MentorRewardsView
								data={rewardTransactions}
								totalSpent={rewardsData.pages[0]?.data?.spent?.pagination?.total}
								totalReceived={rewardsData.pages[0]?.data?.received?.pagination?.total}
								hasMoreSpent={hasNextPage}
								onLoadMoreSpent={fetchNextPage}
								isFetchingNextPage={isFetchingNextPage}
							/>
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
};
