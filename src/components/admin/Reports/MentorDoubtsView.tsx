import {
	IconCalendar,
	IconCircleCheck,
	IconCircleDashed,
	IconClock,
	IconHelpCircle,
	IconMessage2,
	IconSearch,
	IconStar,
} from "@tabler/icons-react";
import { format, isAfter, parseISO, startOfDay, subDays } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { MentorDoubtItem } from "@/types/performance";

interface MentorDoubtsViewProps {
	data: MentorDoubtItem[];
}

type DateRange = "7" | "30" | "90" | "all";

const chartConfig = {
	doubts: {
		label: "Doubts Asked",
		color: "#3b82f6",
	},
	resolved: {
		label: "Doubts Resolved",
		color: "#10b981",
	},
} satisfies ChartConfig;

export const MentorDoubtsView = ({ data }: MentorDoubtsViewProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [chartRange, setChartRange] = useState<DateRange>("7");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	const chartFilteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		if (chartRange === "all") return data;
		const rangeValue = parseInt(chartRange, 10);
		// biome-ignore lint/suspicious/noGlobalIsNan: any used to avoid complex type issues
		if (isNaN(rangeValue)) return data;
		const cutoff = startOfDay(subDays(new Date(), rangeValue));
		return data.filter((item) => isAfter(parseISO(item.createdAt), cutoff));
	}, [data, chartRange]);

	const listDateFilteredData = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.filter((item) => {
			const itemDate = format(parseISO(item.createdAt), "yyyy-MM-dd");
			if (startDate && itemDate < startDate) return false;
			if (endDate && itemDate > endDate) return false;
			return true;
		});
	}, [data, startDate, endDate]);

	const filteredListData = useMemo(() => {
		return listDateFilteredData.filter((item) => {
			const matchesSearch =
				item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.subject.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus = statusFilter === "all" ? true : item.status.toString() === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [listDateFilteredData, searchQuery, statusFilter]);

	const trendData = useMemo(() => {
		const rangeInDays = parseInt(chartRange, 10) || 7; // Default to 7 if "all" or NaN
		const days = Array.from({ length: rangeInDays }, (_, i) => {
			const date = subDays(new Date(), rangeInDays - 1 - i);
			return {
				date: format(date, "MMM dd"),
				displayDate: format(date, "dd/MM"),
				dataDate: startOfDay(date).getTime(),
				doubts: 0,
				resolved: 0,
			};
		});

		for (const item of chartFilteredData) {
			const itemDate = startOfDay(parseISO(item.createdAt)).getTime();
			const dayEntry = days.find((d) => d.dataDate === itemDate);
			if (dayEntry) {
				dayEntry.doubts++;
				if (item.status === 2) dayEntry.resolved++;
			}
		}
		return days;
	}, [chartFilteredData, chartRange]);

	const getStatusConfig = (status: number) => {
		switch (status) {
			case 2:
				return {
					text: "Resolved",
					icon: IconCircleCheck,
					color: "text-emerald-500",
					bg: "bg-emerald-50 dark:bg-emerald-900/20",
				};
			case 1:
				return {
					text: "In Progress",
					icon: IconClock,
					color: "text-amber-500",
					bg: "bg-amber-50 dark:bg-amber-900/20",
				};
			default:
				return {
					text: "Not Responded",
					icon: IconCircleDashed,
					color: "text-neutral-400",
					bg: "bg-neutral-50 dark:bg-neutral-900/20",
				};
		}
	};

	return (
		<div className="space-y-6">
			{/* Trend Chart Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm"
			>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-bold text-neutral-900 dark:text-white">Doubt Trends</h3>
						<p className="text-sm text-neutral-400">Activity visualizer</p>
					</div>
					<Select value={chartRange} onValueChange={(v) => setChartRange(v as DateRange)}>
						<SelectTrigger className="w-40 h-10 bg-neutral-50 dark:bg-neutral-900/50 border-none rounded-xl font-bold text-neutral-700 dark:text-neutral-200 shadow-none text-xs px-4">
							<div className="flex items-center gap-2">
								<IconCalendar className="w-4 h-4 text-blue-500" />
								<SelectValue />
							</div>
						</SelectTrigger>
						<SelectContent className="rounded-xl border-neutral-100 dark:border-neutral-700">
							<SelectItem value="7">Last 7 Days</SelectItem>
							<SelectItem value="30">Last 30 Days</SelectItem>
							<SelectItem value="90">Last 90 Days</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="h-64 w-full">
					<ChartContainer config={chartConfig} className="h-full w-full">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={trendData}>
								<defs>
									<linearGradient id="colorDoubts" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="var(--color-doubts)" stopOpacity={0.1} />
										<stop offset="95%" stopColor="var(--color-doubts)" stopOpacity={0} />
									</linearGradient>
									<linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.1} />
										<stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid
									vertical={false}
									strokeDasharray="3 3"
									className="stroke-neutral-100 dark:stroke-neutral-800"
								/>
								<XAxis
									dataKey="date"
									tickLine={false}
									axisLine={false}
									tick={{ fill: "#888888", fontSize: 10 }}
									tickMargin={10}
									minTickGap={30}
								/>
								<YAxis hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Area
									type="monotone"
									dataKey="doubts"
									stroke="var(--color-doubts)"
									strokeWidth={2.5}
									fillOpacity={1}
									fill="url(#colorDoubts)"
								/>
								<Area
									type="monotone"
									dataKey="resolved"
									stroke="var(--color-resolved)"
									strokeWidth={2.5}
									fillOpacity={1}
									fill="url(#colorResolved)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</ChartContainer>
				</div>
			</motion.div>

			{/* Separate List Date Filter & Search Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
				<div className="flex-1 flex flex-col md:flex-row gap-3">
					<div className="relative flex-1 group">
						<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
						<Input
							placeholder="Search records..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-11 bg-neutral-50 dark:bg-neutral-900/50 border-none rounded-2xl focus:ring-blue-500/10 transition-all text-sm"
						/>
					</div>
					<div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900/50 p-1 px-3 rounded-2xl border border-transparent focus-within:border-blue-500/20 transition-all">
						<IconCalendar className="w-4 h-4 text-blue-500 shrink-0" />
						<div className="flex items-center gap-1.5">
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="bg-transparent border-none text-[11px] font-bold text-neutral-600 dark:text-neutral-300 focus:outline-none focus:ring-0 p-0 w-23.75"
							/>
							<span className="text-neutral-300 dark:text-neutral-600 font-bold">-</span>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="bg-transparent border-none text-[11px] font-bold text-neutral-600 dark:text-neutral-300 focus:outline-none focus:ring-0 p-0 w-23.75"
							/>
						</div>
					</div>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full md:w-56 h-11 bg-neutral-50 dark:bg-neutral-900/50 border-none rounded-2xl font-bold text-neutral-700 dark:text-neutral-200 shadow-none">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent className="rounded-2xl border-neutral-100 dark:border-neutral-700">
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="0">Not Responded</SelectItem>
						<SelectItem value="1">In Progress</SelectItem>
						<SelectItem value="2">Resolved</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{!filteredListData || filteredListData.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-white dark:bg-neutral-800 rounded-3xl border border-dashed border-neutral-100 dark:border-neutral-700">
					<IconHelpCircle className="w-12 h-12 mb-4 opacity-20" />
					<p className="font-medium">No doubts found in this range.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<AnimatePresence mode="popLayout">
						{filteredListData.map((doubt, index) => {
							const status = getStatusConfig(doubt.status);
							return (
								<motion.div
									key={doubt.doubtId}
									initial={{ opacity: 0, scale: 0.98 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ delay: index * 0.05 }}
									className="bg-white dark:bg-neutral-800 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
								>
									<IconMessage2 className="absolute -right-2 -top-2 w-20 h-20 text-neutral-50 dark:text-neutral-900/30 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
									<div className="relative z-10 flex flex-col h-full">
										<div className="flex items-start justify-between mb-4">
											<div className="flex flex-wrap gap-2">
												<span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
													{doubt.subject}
												</span>
												<span
													className={`px-3 py-1 rounded-xl ${status.bg} text-[10px] font-bold ${status.color} uppercase tracking-wider flex items-center gap-1.5`}
												>
													<status.icon className="w-3.5 h-3.5" />
													{status.text}
												</span>
											</div>
											{doubt.rating && (
												<div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
													<IconStar className="w-3.5 h-3.5 fill-current" />
													<span className="text-xs font-bold">{doubt.rating}</span>
												</div>
											)}
										</div>
										<h4 className="text-base font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 pr-10">
											{doubt.description}
										</h4>
										<div className="mt-auto pt-4 flex flex-col gap-3">
											<div className="flex items-center justify-between text-xs">
												<p className="text-neutral-400">
													Requested by{" "}
													<span className="font-bold text-neutral-700 dark:text-neutral-300">
														{doubt.studentName}
													</span>
												</p>
												<p className="text-neutral-400 font-mono">
													{format(parseISO(doubt.createdAt), "MMM dd")}
												</p>
											</div>
											{doubt.reviewComment && (
												<div className="p-3 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700/50 text-xs text-neutral-600 dark:text-neutral-400 italic">
													{doubt.reviewComment}
												</div>
											)}
										</div>
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
};
