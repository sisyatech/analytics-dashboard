import {
	IconChevronLeft,
	IconChevronRight,
	IconMessage2,
	IconQuestionMark,
	IconRobot,
	IconStar,
	IconUserCheck,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	AIRating,
	DoubtReview,
	MentorReview,
	ReviewDetailsResponse,
	SessionFeedback,
} from "@/types/reviews";

interface ReviewsViewProps {
	data: ReviewDetailsResponse["reviewDetails"];
}

type ReviewType = "session" | "doubt" | "mentor" | "ai";
type ReviewItem = SessionFeedback | DoubtReview | MentorReview | AIRating;

export const ReviewsView = ({ data }: ReviewsViewProps) => {
	const [selectedType, setSelectedType] = useState<ReviewType>("session");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const summary = data.summary;

	const currentData = useMemo(() => {
		switch (selectedType) {
			case "session":
				return data.sessionFeedbacks;
			case "doubt":
				return data.doubtReviews;
			case "mentor":
				return data.mentorReviews;
			case "ai":
				return data.aiRatings;
			default:
				return [];
		}
	}, [selectedType, data]);

	const totalPages = Math.ceil(currentData.length / itemsPerPage);
	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return currentData.slice(start, start + itemsPerPage);
	}, [currentData, currentPage]);

	const handleTypeChange = (value: string) => {
		setSelectedType(value as ReviewType);
		setCurrentPage(1);
	};

	const renderRating = (rating: number) => {
		return (
			<div className="flex items-center gap-0.5">
				{[1, 2, 3, 4, 5].map((star) => (
					<IconStar
						key={star}
						className={`w-4 h-4 ${
							star <= rating
								? "fill-yellow-400 text-yellow-400"
								: "text-neutral-200 dark:text-neutral-700"
						}`}
					/>
				))}
				<span className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
					{rating.toFixed(1)}
				</span>
			</div>
		);
	};

	const SummaryCard = ({
		title,
		value,
		count,
		icon: Icon,
		color,
	}: {
		title: string;
		value: number;
		count: number;
		icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		color: string;
	}) => (
		<div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between mb-4">
				<div
					className={`p-3 rounded-xl ${color.replace("text-", "bg-").replace("500", "50").replace("text-", "dark:bg-").replace("500", "900/20")}`}
				>
					<Icon className={`w-6 h-6 ${color}`} />
				</div>
				<span className="text-[10px] font-bold px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
					{count} Reviews
				</span>
			</div>
			<div>
				<h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-baseline gap-1">
					{value.toFixed(1)}
					<span className="text-xs font-medium text-neutral-400">/ 5.0</span>
				</h3>
				<p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			{/* Summary Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<SummaryCard
						title="Overall Average"
						value={
							(summary.avgSessionRating +
								summary.avgDoubtRating +
								summary.avgMentorRating +
								summary.avgAIRating) /
							4
						}
						count={
							summary.totalSessionFeedbacks +
							summary.totalDoubtReviews +
							summary.totalMentorReviews +
							summary.totalAIRatings
						}
						icon={IconStar}
						color="text-yellow-500"
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<SummaryCard
						title="Session Feedback"
						value={summary.avgSessionRating}
						count={summary.totalSessionFeedbacks}
						icon={IconMessage2}
						color="text-blue-500"
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<SummaryCard
						title="Doubt Reviews"
						value={summary.avgDoubtRating}
						count={summary.totalDoubtReviews}
						icon={IconQuestionMark}
						color="text-emerald-500"
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<SummaryCard
						title="Mentor Reviews"
						value={summary.avgMentorRating}
						count={summary.totalMentorReviews}
						icon={IconUserCheck}
						color="text-purple-500"
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<SummaryCard
						title="AI Ratings"
						value={summary.avgAIRating}
						count={summary.totalAIRatings}
						icon={IconRobot}
						color="text-orange-500"
					/>
				</motion.div>
			</div>

			{/* Main Content Card */}
			<div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden">
				<div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
					<h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
						Detailed Reviews
					</h3>

					<Select value={selectedType} onValueChange={handleTypeChange}>
						<SelectTrigger className="w-full md:w-50 bg-white dark:bg-neutral-800">
							<SelectValue placeholder="Select review type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="session">Session Feedback</SelectItem>
							<SelectItem value="doubt">Doubt Reviews</SelectItem>
							<SelectItem value="mentor">Mentor Reviews</SelectItem>
							<SelectItem value="ai">AI Ratings</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50">
							<tr>
								{selectedType === "session" && (
									<>
										<th className="px-6 py-4">Session</th>
										<th className="px-6 py-4">Rating</th>
										<th className="px-6 py-4">Issues</th>
										<th className="px-6 py-4">Comment</th>
										<th className="px-6 py-4">Date</th>
									</>
								)}
								{selectedType === "doubt" && (
									<>
										<th className="px-6 py-4">Subject/Topic</th>
										<th className="px-6 py-4">Mentor</th>
										<th className="px-6 py-4">Rating</th>
										<th className="px-6 py-4">Comment</th>
										<th className="px-6 py-4">Date</th>
									</>
								)}
								{selectedType === "mentor" && (
									<>
										<th className="px-6 py-4">Mentor</th>
										<th className="px-6 py-4">Rating</th>
										<th className="px-6 py-4">Comment</th>
										<th className="px-6 py-4">Date</th>
									</>
								)}
								{selectedType === "ai" && (
									<>
										<th className="px-6 py-4">Rating</th>
										<th className="px-6 py-4">Review</th>
										<th className="px-6 py-4">Status</th>
										<th className="px-6 py-4">Date</th>
									</>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
							{paginatedData.length > 0 ? (
								paginatedData.map((item: ReviewItem) => {
									// biome-ignore lint/suspicious/noExplicitAny: Union property access handled via conditional branches
									const anyItem = item as any;
									return (
										<tr
											key={anyItem.id}
											className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors"
										>
											{selectedType === "session" && (
												<>
													<td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
														{anyItem.sessionTitle}
													</td>
													<td className="px-6 py-4">{renderRating(anyItem.rating)}</td>
													<td className="px-6 py-4">
														<div className="flex flex-col gap-1">
															{anyItem.techIssue && (
																<span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 w-fit">
																	Tech: {anyItem.techIssue}
																</span>
															)}
															{anyItem.sessionIssue && (
																<span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 w-fit">
																	Session: {anyItem.sessionIssue}
																</span>
															)}
														</div>
													</td>
													<td className="px-6 py-4 text-neutral-500 max-w-xs truncate">
														{anyItem.general || "No comment"}
													</td>
													<td className="px-6 py-4 text-neutral-400 font-mono">
														{format(parseISO(anyItem.createdAt), "MMM dd, yyyy")}
													</td>
												</>
											)}
											{selectedType === "doubt" && (
												<>
													<td className="px-6 py-4">
														<div className="flex flex-col">
															<span className="font-medium text-neutral-900 dark:text-white">
																{anyItem.subject}
															</span>
															<span className="text-xs text-neutral-400">{anyItem.topic}</span>
														</div>
													</td>
													<td className="px-6 py-4 text-neutral-600 dark:text-neutral-300">
														{anyItem.mentorName}
													</td>
													<td className="px-6 py-4">{renderRating(anyItem.rating)}</td>
													<td className="px-6 py-4 text-neutral-500 max-w-xs truncate">
														{anyItem.comment || "No comment"}
													</td>
													<td className="px-6 py-4 text-neutral-400 font-mono">
														{format(parseISO(anyItem.createdOn), "MMM dd, yyyy")}
													</td>
												</>
											)}
											{selectedType === "mentor" && (
												<>
													<td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
														{anyItem.mentorName}
													</td>
													<td className="px-6 py-4">{renderRating(anyItem.rating)}</td>
													<td className="px-6 py-4 text-neutral-500 max-w-xs truncate">
														{anyItem.comment || "No comment"}
													</td>
													<td className="px-6 py-4 text-neutral-400 font-mono">
														{format(parseISO(anyItem.createdOn), "MMM dd, yyyy")}
													</td>
												</>
											)}
											{selectedType === "ai" && (
												<>
													<td className="px-6 py-4">{renderRating(anyItem.rating)}</td>
													<td className="px-6 py-4 text-neutral-500 max-w-xs truncate">
														{anyItem.review}
													</td>
													<td className="px-6 py-4">
														<span
															className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
																anyItem.isVisible
																	? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
																	: "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
															}`}
														>
															{anyItem.isVisible ? "Visible" : "Hidden"}
														</span>
													</td>
													<td className="px-6 py-4 text-neutral-400 font-mono">
														{format(parseISO(anyItem.createdAt), "MMM dd, yyyy")}
													</td>
												</>
											)}
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
										No reviews found for this category
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
						<p className="text-xs text-neutral-500">
							Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
							<span className="font-medium">
								{Math.min(currentPage * itemsPerPage, currentData.length)}
							</span>{" "}
							of <span className="font-medium">{currentData.length}</span> reviews
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							>
								<IconChevronLeft className="w-4 h-4" />
							</button>
							<span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
								Page {currentPage} of {totalPages}
							</span>
							<button
								type="button"
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							>
								<IconChevronRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
