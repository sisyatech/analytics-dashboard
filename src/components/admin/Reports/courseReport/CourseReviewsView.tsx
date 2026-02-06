import { IconQuote, IconStar } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import type { CourseReview } from "@/types/performance";

interface CourseReviewsViewProps {
	data: CourseReview[];
}

export const CourseReviewsView = ({ data }: CourseReviewsViewProps) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.map((review, index) => (
					<motion.div
						key={review.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
					>
						<div className="flex flex-col h-full relative z-10">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black border border-blue-100 dark:border-blue-900/30">
										{review.studentName.charAt(0)}
									</div>
									<div className="flex flex-col">
										<p className="text-sm font-black text-neutral-900 dark:text-white leading-tight">
											{review.studentName}
										</p>
										<p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tight">
											{format(parseISO(review.createdAt), "MMM dd, yyyy")}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-black text-xs border border-yellow-100 dark:border-yellow-900/30">
									<IconStar className="w-3.5 h-3.5 fill-current" />
									{review.rating.toFixed(1)}
								</div>
							</div>

							<div className="relative mb-4 flex-1">
								<IconQuote className="absolute -top-1 -left-1 w-6 h-6 text-neutral-100 dark:text-neutral-800 -z-10" />
								<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 italic font-medium pt-1">
									{review.comment || "No detailed feedback provided by the student."}
								</p>
							</div>

							<div className="space-y-2 mt-auto">
								<div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
									<span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest truncate max-w-[140px]">
										{review.sessionTitle}
									</span>
									<span className="text-[9px] font-bold text-neutral-500 bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded shadow-xs">
										Session
									</span>
								</div>

								{(review.techIssue || review.sessionIssue) && (
									<div className="flex flex-wrap gap-2 pt-1">
										{review.techIssue && (
											<span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 text-[9px] font-bold border border-red-100 dark:border-red-900/20 uppercase tracking-tighter">
												Tech: {review.techIssue}
											</span>
										)}
										{review.sessionIssue && (
											<span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[9px] font-bold border border-amber-100 dark:border-amber-900/20 uppercase tracking-tighter">
												Topic: {review.sessionIssue}
											</span>
										)}
									</div>
								)}
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};
