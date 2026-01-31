import { IconCalendar, IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";
import { format, isValid, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface SessionFiltersProps {
	search: string;
	onSearchChange: (val: string) => void;
	startDate: string;
	onStartDateChange: (val: string) => void;
	endDate: string;
	onEndDateChange: (val: string) => void;
	onClear: () => void;
}

export const SessionFilters = ({
	search,
	onSearchChange,
	startDate,
	onStartDateChange,
	endDate,
	onEndDateChange,
	onClear,
}: SessionFiltersProps) => {
	const [activePicker, setActivePicker] = useState<"start" | "end" | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const hasActiveFilters = search || startDate || endDate;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setActivePicker(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formatDateDisplay = (dateStr: string) => {
		if (!dateStr) return "Pick a date";
		const date = parseISO(dateStr);
		return isValid(date) ? format(date, "PPP") : "Pick a date";
	};

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;
		const dateStr = format(date, "yyyy-MM-dd");
		if (activePicker === "start") {
			onStartDateChange(dateStr);
		} else {
			onEndDateChange(dateStr);
		}
		setActivePicker(null);
	};

	return (
		<div
			ref={containerRef}
			className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm transition-all duration-300"
		>
			{/* Search Input */}
			<div className="relative flex-1 group">
				<IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
				<Input
					placeholder="Search sessions (detail, subject, mentor)..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-10 h-11 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm"
				/>
			</div>

			{/* Date Range Selectors */}
			<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap relative">
				{/* Start Date */}
				<div className="relative">
					<Button
						variant="outline"
						onClick={() => setActivePicker(activePicker === "start" ? null : "start")}
						className={`h-11 justify-start text-left font-normal w-full sm:w-56 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 gap-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${
							startDate ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500"
						}`}
					>
						<IconCalendar className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
						<span className="truncate flex-1">{formatDateDisplay(startDate)}</span>
						<IconChevronDown
							className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
								activePicker === "start" ? "rotate-180" : ""
							}`}
						/>
					</Button>

					<AnimatePresence>
						{activePicker === "start" && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.95 }}
								className="absolute top-12 left-0 z-50 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl transition-all"
							>
								<Calendar
									mode="single"
									selected={startDate ? parseISO(startDate) : undefined}
									onSelect={handleDateSelect}
									initialFocus
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className="text-neutral-300 dark:text-neutral-600 font-bold px-1">to</div>

				{/* End Date */}
				<div className="relative">
					<Button
						variant="outline"
						onClick={() => setActivePicker(activePicker === "end" ? null : "end")}
						className={`h-11 justify-start text-left font-normal w-full sm:w-56 rounded-xl border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 gap-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${
							endDate ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500"
						}`}
					>
						<IconCalendar className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-colors" />
						<span className="truncate flex-1">{formatDateDisplay(endDate)}</span>
						<IconChevronDown
							className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
								activePicker === "end" ? "rotate-180" : ""
							}`}
						/>
					</Button>

					<AnimatePresence>
						{activePicker === "end" && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.95 }}
								className="absolute top-12 right-0 md:left-0 z-50 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl transition-all"
							>
								<Calendar
									mode="single"
									selected={endDate ? parseISO(endDate) : undefined}
									onSelect={handleDateSelect}
									initialFocus
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Clear Filters */}
				{hasActiveFilters && (
					<Button
						onClick={onClear}
						variant="ghost"
						size="icon"
						className="h-11 w-11 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all flex-shrink-0"
						title="Clear filters"
					>
						<IconX className="w-5 h-5" />
					</Button>
				)}
			</div>
		</div>
	);
};
