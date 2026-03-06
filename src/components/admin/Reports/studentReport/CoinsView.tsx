import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { CoinTransaction } from "@/types/performance";

interface CoinsViewProps {
	data: CoinTransaction[];
}

const chartConfig = {
	earnings: {
		label: "Earnings",
		color: "#10b981", // Green
	},
	expenditure: {
		label: "Expenditure",
		color: "#f59e0b", // Amber
	},
} satisfies ChartConfig;

export const CoinsView = ({ data }: CoinsViewProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [timePeriod, setTimePeriod] = useState<"7d" | "1m" | "3m">("1m");
	const itemsPerPage = 10;

	// Filter Data
	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.filter((transaction) => {
			if (!transaction || !transaction.createdAt) return false;
			try {
				const transactionDate = format(parseISO(transaction.createdAt), "yyyy-MM-dd");
				const matchesSearch =
					transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
					transaction.metadata.reason.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesStartDate = startDate ? transactionDate >= startDate : true;
				const matchesEndDate = endDate ? transactionDate <= endDate : true;

				return matchesSearch && matchesStartDate && matchesEndDate;
			} catch (_e) {
				//console.error("Error processing transaction item:", transaction, e);
				return false;
			}
		});
	}, [data, searchQuery, startDate, endDate]);

	// Pagination Logic
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredData.slice(start, start + itemsPerPage);
	}, [filteredData, currentPage]);

	// Reset page on filter change
	//biome-ignore lint/correctness/useExhaustiveDependencies: This hook specifies more dependencies than necessary: searchQuery, startDate, endDate.
	useMemo(() => {
		setCurrentPage(1);
	}, [searchQuery, startDate, endDate]);

	// Trend Data for Chart
	const trendData = useMemo(() => {
		if (!Array.isArray(data)) return [];

		// Calculate date range based on time period
		const now = new Date();
		const startDate = new Date();

		switch (timePeriod) {
			case "7d":
				startDate.setDate(now.getDate() - 7);
				break;
			case "1m":
				startDate.setMonth(now.getMonth() - 1);
				break;
			case "3m":
				startDate.setMonth(now.getMonth() - 3);
				break;
		}

		// Filter transactions within date range
		const filteredTransactions = data.filter(
			(t) => t.createdAt && new Date(t.createdAt) >= startDate,
		);

		// Group by date and aggregate earnings/expenditure
		const groupedByDate = new Map<string, { earnings: number; expenditure: number }>();

		for (const transaction of filteredTransactions) {
			if (!transaction.createdAt) continue;

			const date = format(parseISO(transaction.createdAt), "yyyy-MM-dd");
			const amount = Number.parseInt(transaction.amount, 10);

			if (!groupedByDate.has(date)) {
				groupedByDate.set(date, { earnings: 0, expenditure: 0 });
			}

			const entry = groupedByDate.get(date);
			if (entry) {
				if (amount > 0) {
					entry.earnings += amount;
				} else {
					entry.expenditure += Math.abs(amount);
				}
			}
		}

		// Convert to array and sort by date
		return Array.from(groupedByDate.entries())
			.map(([date, values]) => ({
				date: format(parseISO(date), "MMM dd"),
				fullDate: date,
				earnings: values.earnings,
				expenditure: values.expenditure,
			}))
			.sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
	}, [data, timePeriod]);

	// Icons
	const IconSearch = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2"
		>
			<title>Search</title>
			<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
			<path d="M21 21l-6 -6" />
		</svg>
	);

	const IconChevronLeft = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4"
		>
			<title>Previous Page</title>
			<path d="M15 6l-6 6l6 6" />
		</svg>
	);

	const IconChevronRight = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4"
		>
			<title>Next Page</title>
			<path d="M9 6l6 6l-6 6" />
		</svg>
	);

	const getTransactionTypeColor = (type: string) => {
		switch (type) {
			case "TASK_REWARD":
				return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
			case "PURCHASE":
				return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
			case "REFUND":
				return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
			default:
				return "bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
			case "PENDING":
				return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
			case "FAILED":
				return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
			default:
				return "bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400";
		}
	};

	return (
		<div className="space-y-6">
			{/* Trend Graph */}
			<div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-bold text-neutral-900 dark:text-white">Coins Trend</h3>

					{/* Time Period Filters */}
					<div className="flex items-center gap-2 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
						{(["7d", "1m", "3m"] as const).map((period) => (
							<button
								key={period}
								type="button"
								onClick={() => setTimePeriod(period)}
								className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
									timePeriod === period
										? "bg-yellow-600 text-white shadow-sm"
										: "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
								}`}
							>
								{period === "7d" ? "7 Days" : period === "1m" ? "1 Month" : "3 Months"}
							</button>
						))}
					</div>
				</div>

				<div className="h-75 w-full">
					<ChartContainer config={chartConfig} className="h-full w-full">
						<LineChart accessibilityLayer data={trendData}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={10}
								label={{
									value: "Coins",
									angle: -90,
									position: "insideLeft",
									offset: 10,
									className: "fill-neutral-500 text-xs",
								}}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<ChartLegend content={<ChartLegendContent />} />
							<Line
								dataKey="earnings"
								stroke="var(--color-earnings)"
								strokeWidth={2}
								dot={{ fill: "var(--color-earnings)" }}
							/>
							<Line
								dataKey="expenditure"
								stroke="var(--color-expenditure)"
								strokeWidth={2}
								dot={{ fill: "var(--color-expenditure)" }}
							/>
						</LineChart>
					</ChartContainer>
				</div>
			</div>

			<div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden">
				{/* Controls */}
				<div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
					<div className="relative w-full md:w-64">
						<IconSearch />
						<input
							type="text"
							placeholder="Search by type or reason..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
						/>
					</div>
					<div className="flex items-center gap-2 w-full md:w-auto">
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
						/>
						<span className="text-neutral-400">-</span>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
						/>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50">
							<tr>
								<th className="px-6 py-3 font-semibold">Date</th>
								<th className="px-6 py-3 font-semibold">Type</th>
								<th className="px-6 py-3 font-semibold">Reason</th>
								<th className="px-6 py-3 font-semibold text-right">Amount</th>
								<th className="px-6 py-3 font-semibold text-right">Balance After</th>
								<th className="px-6 py-3 font-semibold">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
							{paginatedData.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
										No coin transactions found matching your filters.
									</td>
								</tr>
							) : (
								paginatedData.map((transaction) => (
									<tr
										key={transaction.id}
										className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
									>
										<td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
											{transaction.createdAt
												? format(parseISO(transaction.createdAt), "MMM dd, yyyy HH:mm")
												: "-"}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2.5 py-1 rounded-full text-xs font-bold ${getTransactionTypeColor(
													transaction.type,
												)}`}
											>
												{transaction.type.replace(/_/g, " ")}
											</span>
										</td>
										<td
											className="px-6 py-4 text-neutral-600 dark:text-neutral-300 max-w-xs truncate"
											title={transaction.metadata.reason || ""}
										>
											{transaction.metadata.reason || "-"}
										</td>
										<td className="px-6 py-4 text-right font-mono font-bold text-neutral-800 dark:text-neutral-200">
											<span
												className={
													Number.parseInt(transaction.amount, 10) > 0
														? "text-green-600 dark:text-green-400"
														: "text-red-600 dark:text-red-400"
												}
											>
												{Number.parseInt(transaction.amount, 10) > 0 ? "+" : ""}
												{transaction.amount}
											</span>
										</td>
										<td className="px-6 py-4 text-right font-mono text-neutral-600 dark:text-neutral-400">
											{transaction.balanceAfter}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(
													transaction.status,
												)}`}
											>
												{transaction.status}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination Controls */}
				{totalPages > 1 && (
					<div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center bg-white dark:bg-neutral-800">
						<p className="text-sm text-neutral-500">
							Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
							{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}{" "}
							entries
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								<IconChevronLeft />
							</button>
							<div className="flex items-center gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									let pageNum = i + 1;
									if (totalPages > 5) {
										if (currentPage > 3) {
											pageNum = currentPage - 3 + i;
										}
										if (pageNum > totalPages) {
											pageNum = totalPages - (4 - i);
										}
									}
									return pageNum;
								}).map((pageNum) => (
									<button
										type="button"
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
											currentPage === pageNum
												? "bg-yellow-600 text-white"
												: "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700"
										}`}
									>
										{pageNum}
									</button>
								))}
							</div>
							<button
								type="button"
								onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								<IconChevronRight />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
