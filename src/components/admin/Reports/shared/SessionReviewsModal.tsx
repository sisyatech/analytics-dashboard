import { IconAlertTriangle, IconSettings, IconStar, IconX } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getSessionReviews } from "@/api/performance";
import type { SessionReview } from "@/types/performance";

interface SessionReviewsModalProps {
	sessionId: number | null;
	isOpen: boolean;
	onClose: () => void;
}

export const SessionReviewsModal = ({ sessionId, isOpen, onClose }: SessionReviewsModalProps) => {
	const [reviews, setReviews] = useState<SessionReview[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && sessionId) {
			const fetchReviews = async () => {
				setIsLoading(true);
				try {
					const response = await getSessionReviews(sessionId);
					if (response.success) {
						setReviews(response.reviews);
					}
				} catch (_error) {
					//console.error("Failed to fetch session reviews", error);
				} finally {
					setIsLoading(false);
				}
			};
			fetchReviews();
		} else {
			setReviews([]);
		}
	}, [isOpen, sessionId]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for card selection */}
			<div
				className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onClose();
					}
				}}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
						<h3 className="text-lg font-bold text-neutral-900 dark:text-white">Session Reviews</h3>
						<button
							type="button"
							onClick={onClose}
							className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
						>
							<IconX className="w-5 h-5 text-neutral-500" />
						</button>
					</div>

					<div className="max-h-[60vh] overflow-y-auto p-4">
						{isLoading ? (
							<div className="text-center py-8 text-neutral-500">Loading...</div>
						) : reviews.length > 0 ? (
							<div className="space-y-4">
								{reviews.map((review) => (
									<div
										key={review.id}
										className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800"
									>
										<div className="flex justify-between items-start mb-2">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-bold text-xs uppercase">
													{review.student.name.charAt(0)}
												</div>
												<div>
													<p className="text-sm font-bold text-neutral-900 dark:text-white">
														{review.student.name}
													</p>
													<p className="text-[10px] text-neutral-400">
														{format(parseISO(review.createdAt), "MMM dd, yyyy • HH:mm")}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
												<IconStar className="w-3.5 h-3.5 text-amber-500 filled" />
												<span className="text-xs font-bold text-amber-700 dark:text-amber-400">
													{review.rating}
												</span>
											</div>
										</div>

										{review.general && (
											<p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 ml-10">
												"{review.general}"
											</p>
										)}

										<div className="flex flex-wrap gap-2 ml-10">
											{review.techIssue && (
												<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-medium border border-red-100 dark:border-red-900/30">
													<IconSettings className="w-3 h-3" />
													Tech: {review.techIssue}
												</span>
											)}
											{review.sessionIssue && (
												<span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-medium border border-orange-100 dark:border-orange-900/30">
													<IconAlertTriangle className="w-3 h-3" />
													Issue: {review.sessionIssue}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-neutral-500">No reviews found.</div>
						)}
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};
