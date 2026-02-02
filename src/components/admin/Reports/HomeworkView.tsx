import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { HomeworkDetail } from "@/types/performance";

const chartConfig = {
	score: {
		label: "Score (%)",
		color: "#10b981", // Emerald 500
	},
} satisfies ChartConfig;

interface HomeworkViewProps {
	data: HomeworkDetail[];
}

export const HomeworkView = ({ data }: HomeworkViewProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Filter Data
	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.filter((homework) => {
			if (!homework || !homework.title || !homework.assignedDate) return false;
			try {
				const assignedDate = format(parseISO(homework.assignedDate), "yyyy-MM-dd");
				const matchesSearch = homework.title.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesStartDate = startDate ? assignedDate >= startDate : true;
				const matchesEndDate = endDate ? assignedDate <= endDate : true;

				return matchesSearch && matchesStartDate && matchesEndDate;
			} catch (e) {
				console.error("Error processing homework item:", homework, e);
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

	const chartData = useMemo(() => {
		// Sort by date ascending to show timeline correctly
		const sortedData = [...filteredData].sort(
			(a, b) => new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime(),
		);

		// Take the last 30 items (most recent)
		return sortedData.slice(-30).map((homework) => ({
			name: homework.assignedDate ? format(parseISO(homework.assignedDate), "MMM dd") : "N/A",
			fullTitle: homework.title || "Untitled",
			score: homework.score || 0,
			status: homework.status || "PENDING",
		}));
	}, [filteredData]);

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

	return (
		<div className="space-y-6">
			<div className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
				<h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
					Homework Performance
				</h3>
				<div className="h-75 w-full">
					<ChartContainer config={chartConfig} className="h-full w-full">
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={10}
								domain={[0, 100]}
								label={{
									value: "Score (%)",
									angle: -90,
									position: "insideLeft",
									offset: 10,
									className: "fill-neutral-500 text-xs",
								}}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<ChartLegend content={<ChartLegendContent />} />
							<Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
						</BarChart>
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
							placeholder="Search by title..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
						/>
					</div>
					<div className="flex items-center gap-2 w-full md:w-auto">
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
						/>
						<span className="text-neutral-400">-</span>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
						/>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50">
							<tr>
								<th className="px-6 py-3 font-semibold">Assigned Date</th>
								<th className="px-6 py-3 font-semibold">Title</th>
								<th className="px-6 py-3 font-semibold">Status</th>
								<th className="px-6 py-3 font-semibold">Due Date</th>
								<th className="px-6 py-3 font-semibold">Submitted</th>
								<th className="px-6 py-3 font-semibold text-right">Score</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
							{paginatedData.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
										No homework records found matching your filters.
									</td>
								</tr>
							) : (
								paginatedData.map((homework) => (
									<tr
										key={homework.homeworkId}
										className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
									>
										<td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
											{homework.assignedDate
												? format(parseISO(homework.assignedDate), "MMM dd, yyyy")
												: "-"}
										</td>
										<td
											className="px-6 py-4 text-neutral-600 dark:text-neutral-300 max-w-xs truncate"
											title={homework.title || ""}
										>
											{homework.title || "Untitled"}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2.5 py-1 rounded-full text-xs font-bold ${
													homework.status === "SUBMITTED"
														? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
														: homework.status === "LATE"
															? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
															: homework.status === "MISSED"
																? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
																: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
												}`}
											>
												{homework.status || "UNKNOWN"}
											</span>
										</td>
										<td className="px-6 py-4 text-neutral-500">
											{homework.dueDate ? format(parseISO(homework.dueDate), "MMM dd") : "-"}
										</td>
										<td className="px-6 py-4 text-neutral-500">
											{homework.submittedAt
												? format(parseISO(homework.submittedAt), "MMM dd, HH:mm")
												: "-"}
										</td>
										<td className="px-6 py-4 text-right font-mono font-bold text-neutral-800 dark:text-neutral-200">
											{homework.score ?? 0}%
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
												? "bg-emerald-600 text-white"
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
