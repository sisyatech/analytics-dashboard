import {
	IconCalendarMonth,
	IconChevronLeft,
	IconChevronRight,
	IconMessage2,
	IconQuestionMark,
	IconStar,
	IconUser,
	IconUserCheck,
	IconX,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { MentorReviewItem } from "@/types/performance";

interface MentorReviewsViewProps {
	data: {
		sessionFeedbacks: MentorReviewItem[];
		doubtReviews: MentorReviewItem[];
		mentorRatings: MentorReviewItem[];
	};
}

type ReviewType = "mentor" | "session" | "doubt";

export const MentorReviewsView = ({ data }: MentorReviewsViewProps) => {
	const [selectedType, setSelectedType] = useState<ReviewType>("mentor");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedReview, setSelectedReview] = useState<MentorReviewItem | null>(null);
	const itemsPerPage = 10;

	const summary = useMemo(() => {
		const calculateAvg = (items: MentorReviewItem[]) =>
			items.length > 0 ? items.reduce((acc, i) => acc + i.rating, 0) / items.length : 0;

		return {
			avgMentorRating: calculateAvg(data.mentorRatings),
			avgSessionRating: calculateAvg(data.sessionFeedbacks),
			avgDoubtRating: calculateAvg(data.doubtReviews),
			totalMentorReviews: data.mentorRatings.length,
			totalSessionFeedbacks: data.sessionFeedbacks.length,
			totalDoubtReviews: data.doubtReviews.length,
		};
	}, [data]);

	const currentData = useMemo(() => {
		switch (selectedType) {
			case "mentor":
				return data.mentorRatings;
			case "session":
				return data.sessionFeedbacks;
			case "doubt":
				return data.doubtReviews;
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

	const renderRating = (rating: number, size = "w-4 h-4") => {
		return (
			<div className="flex items-center gap-0.5">
				{[1, 2, 3, 4, 5].map((star) => (
					<IconStar
						key={star}
						className={`${size} ${
							star <= rating
								? "fill-yellow-400 text-yellow-400"
								: "text-neutral-200 dark:text-neutral-700"
						}`}
					/>
				))}
			</div>
		);
	};

	const SummaryCard = ({
		title,
		value,
		count,
		icon: Icon,
		color,
		isSelected,
		onClick,
	}: {
		title: string;
		value: number;
		count: number;
		icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		color: string;
		isSelected: boolean;
		onClick: () => void;
	}) => (
		//biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for card selection
		<div
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClick();
				}
			}}
			className={`p-5 rounded-2xl bg-white dark:bg-neutral-800 border transition-all cursor-pointer ${
				isSelected
					? "border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
					: "border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md"
			}`}
		>
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
		<div className="space-y-6 relative">
			{/* Summary Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<SummaryCard
						title="Overall Average"
						value={
							(summary.avgSessionRating + summary.avgDoubtRating + summary.avgMentorRating) / 3
						}
						count={
							summary.totalSessionFeedbacks + summary.totalDoubtReviews + summary.totalMentorReviews
						}
						icon={IconStar}
						color="text-yellow-500"
						isSelected={false}
						onClick={() => {}}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<SummaryCard
						title="Direct Teacher"
						value={summary.avgMentorRating}
						count={summary.totalMentorReviews}
						icon={IconUserCheck}
						color="text-purple-500"
						isSelected={selectedType === "mentor"}
						onClick={() => handleTypeChange("mentor")}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<SummaryCard
						title="Session Feedback"
						value={summary.avgSessionRating}
						count={summary.totalSessionFeedbacks}
						icon={IconMessage2}
						color="text-blue-500"
						isSelected={selectedType === "session"}
						onClick={() => handleTypeChange("session")}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<SummaryCard
						title="Doubt Reviews"
						value={summary.avgDoubtRating}
						count={summary.totalDoubtReviews}
						icon={IconQuestionMark}
						color="text-emerald-500"
						isSelected={selectedType === "doubt"}
						onClick={() => handleTypeChange("doubt")}
					/>
				</motion.div>
			</div>

			{/* Main Content Card */}
			<div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden">
				<div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
					<h3 className="text-lg font-bold text-neutral-900 dark:text-white">Detailed Reviews</h3>

					<Select value={selectedType} onValueChange={handleTypeChange}>
						<SelectTrigger className="w-full md:w-56 bg-white dark:bg-neutral-800">
							<SelectValue placeholder="Select review type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="mentor">Direct Feedback</SelectItem>
							<SelectItem value="session">Session Feedback</SelectItem>
							<SelectItem value="doubt">Doubt Reviews</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50">
							<tr>
								<th className="px-6 py-4">Student</th>
								<th className="px-6 py-4">Rating</th>
								<th className="px-6 py-4">Context</th>
								<th className="px-6 py-4">Comment</th>
								<th className="px-6 py-4 text-right">Date</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
							{paginatedData.length > 0 ? (
								paginatedData.map((item) => (
									<motion.tr
										key={`${item.type}-${item.id}`}
										layoutId={selectedReview ? undefined : `card-${item.type}-${item.id}`}
										onClick={() => setSelectedReview(item)}
										className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer group"
									>
										<td className="px-6 py-4 font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">
											{item.studentName}
										</td>
										<td className="px-6 py-4">{renderRating(item.rating)}</td>
										<td className="px-6 py-4 text-neutral-500 text-xs">
											{item.sessionTitle || item.doubtDescription || "General Feedback"}
										</td>
										<td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate italic">
											{item.comment || "No comment provided"}
										</td>
										<td className="px-6 py-4 text-neutral-400 font-mono text-[10px] text-right">
											{format(parseISO(item.date), "MMM dd, yyyy")}
										</td>
									</motion.tr>
								))
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

			{/* Compact Refined Modal */}
			<AnimatePresence>
				{selectedReview && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedReview(null)}
						className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-white dark:bg-neutral-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-neutral-100 dark:border-neutral-700 p-8"
						>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSelectedReview(null)}
								className="absolute top-6 right-6 rounded-full bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 z-10"
							>
								<IconX className="w-4 h-4 text-neutral-500" />
							</Button>

							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
										<IconUser className="w-6 h-6" />
									</div>
									<div>
										<h2 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">
											{selectedReview.studentName}
										</h2>
										<div className="flex items-center gap-1.5 text-neutral-400">
											<IconCalendarMonth className="w-3.5 h-3.5" />
											<span className="text-[11px] font-bold">
												{format(parseISO(selectedReview.date), "MMM dd, yyyy")}
											</span>
										</div>
									</div>
								</div>

								<div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-100 dark:border-neutral-700/50">
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
										Source
									</p>
									<p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
										{selectedReview.sessionTitle ||
											selectedReview.doubtDescription ||
											"General Feedback"}
									</p>
								</div>

								<div className="flex items-center justify-between p-4 bg-yellow-50/30 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100/50">
									<span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">
										Rating Provided
									</span>
									<div className="flex items-center gap-2">
										{renderRating(selectedReview.rating, "w-5 h-5")}
										<span className="text-lg font-bold text-neutral-900 dark:text-white">
											{selectedReview.rating.toFixed(1)}
										</span>
									</div>
								</div>

								<div className="relative pt-2">
									<IconMessage2 className="absolute -left-2 -top-2 w-10 h-10 text-blue-500/5" />
									<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 relative z-10">
										Review Content
									</p>
									<div className="p-5 bg-blue-50/20 dark:bg-neutral-900/20 rounded-2xl italic text-neutral-700 dark:text-neutral-300 border border-blue-100/30 dark:border-neutral-700/30 text-sm leading-relaxed">
										"
										{selectedReview.comment ||
											"The student didn't leave a specific comment for this review."}
										"
									</div>
								</div>

								<Button
									onClick={() => setSelectedReview(null)}
									className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold h-12 rounded-2xl hover:scale-[0.98] transition-all"
								>
									Close Details
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
