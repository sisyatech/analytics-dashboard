import {
	IconArrowDownLeft,
	IconArrowUpRight,
	IconCoin,
	IconGift,
	IconLoader,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { MentorRewardTransaction } from "@/types/performance";

interface MentorRewardsViewProps {
	data: {
		spent: MentorRewardTransaction[];
		received: MentorRewardTransaction[];
	};
	totalSpent?: number;
	totalReceived?: number;
	onLoadMoreSpent?: () => void;
	hasMoreSpent?: boolean;
	isFetchingNextPage?: boolean;
}

const TransactionCard = ({
	transaction,
	type,
}: {
	transaction: MentorRewardTransaction;
	type: "SPENT" | "RECEIVED";
}) => {
	const isSpent = type === "SPENT";
	const amount = Math.abs(parseInt(transaction.amount, 10));

	return (
		<div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-xl hover:shadow-sm transition-all group">
			<div className="flex items-center gap-4">
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
						isSpent
							? "bg-red-50 dark:bg-red-900/20 text-red-500"
							: "bg-green-50 dark:bg-green-900/20 text-green-500"
					}`}
				>
					{isSpent ? (
						<IconArrowUpRight className="w-5 h-5" />
					) : (
						<IconArrowDownLeft className="w-5 h-5" />
					)}
				</div>
				<div>
					<div className="flex items-center gap-2 mb-0.5">
						<span className="font-bold text-neutral-900 dark:text-white text-sm">
							{isSpent
								? `Sent to ${transaction.studentName}`
								: `Received from ${transaction.adminName}`}
						</span>
					</div>
					<p
						className="text-xs text-neutral-500 line-clamp-1 max-w-62.5 sm:max-w-md"
						title={transaction.reason}
					>
						{transaction.reason}
					</p>
					<p className="text-[10px] text-neutral-400 mt-1">
						{format(parseISO(transaction.createdAt), "MMM dd, yyyy • HH:mm")}
					</p>
				</div>
			</div>
			<div
				className={`font-bold text-base flex items-center gap-1 ${
					isSpent ? "text-neutral-900 dark:text-white" : "text-green-600 dark:text-green-400"
				}`}
			>
				<span>
					{isSpent ? "-" : "+"}
					{amount}
				</span>
				<IconCoin className="w-4 h-4 text-yellow-500 filled" />
			</div>
		</div>
	);
};

export const MentorRewardsView = ({
	data,
	totalSpent,
	totalReceived,
	onLoadMoreSpent,
	hasMoreSpent,
	isFetchingNextPage,
}: MentorRewardsViewProps) => {
	const { spent = [], received = [] } = data || {};
	const hasTransactions = spent.length > 0 || received.length > 0;
	const loaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMoreSpent && onLoadMoreSpent) {
					onLoadMoreSpent();
				}
			},
			{ threshold: 1.0 },
		);

		if (loaderRef.current) {
			observer.observe(loaderRef.current);
		}

		return () => {
			if (loaderRef.current) {
				observer.unobserve(loaderRef.current);
			}
		};
	}, [hasMoreSpent, onLoadMoreSpent]);

	if (!hasTransactions) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-white dark:bg-neutral-800 rounded-3xl border border-dashed border-neutral-100 dark:border-neutral-700">
				<div className="w-16 h-16 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-4">
					<IconGift className="w-8 h-8 text-yellow-500" />
				</div>
				<p className="font-medium text-lg text-neutral-900 dark:text-white mb-1">
					No Transactions Yet
				</p>
				<p className="text-sm text-neutral-500">
					This mentor hasn't sent or received any rewards yet.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* SPENT COLUMN */}
			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-red-500"></span>
						Sent Rewards
					</h3>
					<span className="text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
						{totalSpent ?? spent.length} transactions
					</span>
				</div>

				<div className="space-y-3">
					{spent.length > 0 ? (
						<>
							{spent.map((transaction) => (
								<motion.div
									key={transaction.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<TransactionCard transaction={transaction} type="SPENT" />
								</motion.div>
							))}
							{hasMoreSpent && (
								<div ref={loaderRef} className="flex justify-center py-4">
									{isFetchingNextPage ? (
										<IconLoader className="w-6 h-6 animate-spin text-neutral-400" />
									) : (
										<div className="h-6" />
									)}
								</div>
							)}
						</>
					) : (
						<div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
							<p className="text-sm text-neutral-500">No rewards sent yet.</p>
						</div>
					)}
				</div>
			</div>

			{/* RECEIVED COLUMN */}
			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-green-500"></span>
						Received Budget
					</h3>
					<span className="text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
						{totalReceived ?? received.length} transactions
					</span>
				</div>

				<div className="space-y-3">
					{received.length > 0 ? (
						received.map((transaction) => (
							<motion.div
								key={transaction.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<TransactionCard transaction={transaction} type="RECEIVED" />
							</motion.div>
						))
					) : (
						<div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
							<p className="text-sm text-neutral-500">No budget received yet.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
