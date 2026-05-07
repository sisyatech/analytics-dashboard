import {
	IconCalendar,
	IconChevronDown,
	IconChevronUp,
	IconDatabase,
	IconRefresh,
	IconReload,
	IconSortAscending,
	IconSortDescending,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SpreadsheetView } from "@/components/admin/AttendanceEngine/SpreadsheetView";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAttendanceEngineReport, useSyncAttendance } from "@/hooks/admin/useAttendanceEngine";
import { cn } from "@/lib/utils";

const COURSE_IDS = [302, 303, 304, 305, 306, 307, 308, 309, 310, 311];

export default function AttendanceEnginePage() {
	const [activeCourseId, setActiveCourseId] = useState<string>(COURSE_IDS[0].toString());
	const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
	const [targetDate, setTargetDate] = useState<string | null>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [sessionOrder, setSessionOrder] = useState<"newest" | "oldest">(() => {
		const saved = localStorage.getItem("ae_session_order");
		return (saved as "newest" | "oldest") || "oldest";
	});

	const { data, isLoading, isError, refetch } = useAttendanceEngineReport(COURSE_IDS);
	const syncMutation = useSyncAttendance();

	// Active dates for the calendar
	const activeDates = useMemo(() => {
		if (!data?.sheets) return [];
		const activeSheet = data.sheets.find((s) => s.courseId.toString() === activeCourseId);
		if (!activeSheet) return [];
		return activeSheet.sessions.map((s) => new Date(s.date));
	}, [data, activeCourseId]);

	// Calculate matches for navigation
	const matches = useMemo(() => {
		if (!searchQuery || !data?.sheets) return [];
		const activeSheet = data.sheets.find((s) => s.courseId.toString() === activeCourseId);
		if (!activeSheet) return [];

		const results: { studentId: number; type: "name" | "phone" }[] = [];
		activeSheet.students.forEach((student) => {
			if (student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push({ studentId: student.id, type: "name" });
			}
			if (student.phone.toLowerCase().includes(searchQuery.toLowerCase())) {
				results.push({ studentId: student.id, type: "phone" });
			}
		});
		return results;
	}, [searchQuery, data, activeCourseId]);

	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	useEffect(() => {
		if (matches.length > 0) {
			setCurrentMatchIndex(0);
		} else {
			setCurrentMatchIndex(-1);
		}
	}, [matches.length]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "f") {
				e.preventDefault();
				setIsSearchVisible(true);
				setTimeout(() => searchInputRef.current?.focus(), 50);
			}
			if (e.key === "Escape") {
				setIsSearchVisible(false);
				setIsDatePickerOpen(false);
				setSearchQuery("");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		localStorage.setItem("ae_session_order", sessionOrder);
	}, [sessionOrder]);

	const handleNextMatch = () => {
		if (matches.length === 0) return;
		setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
	};

	const handlePrevMatch = () => {
		if (matches.length === 0) return;
		setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
	};

	const handleDateClick = (date: Date) => {
		setTargetDate(date.toISOString());
		setIsDatePickerOpen(false);
		// Reset targetDate after a short delay to allow re-triggering
		setTimeout(() => setTargetDate(null), 1000);
	};

	const handleSyncAll = async () => {
		try {
			// Sync all courses in parallel as requested
			await Promise.all(COURSE_IDS.map((id) => syncMutation.mutateAsync({ courseId: id })));
			setLastSync(new Date().toLocaleTimeString());
			refetch();
		} catch (error) {
			console.error("Sync failed", error);
		}
	};

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center bg-white flex-col gap-4">
				<div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
				<div className="flex flex-col items-center">
					<p className="text-emerald-800 font-bold text-xl animate-pulse">
						Initializing Attendance Engine
					</p>
					<p className="text-neutral-400 text-sm">
						Crunching data for {COURSE_IDS.length} grades...
					</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<p className="text-rose-500 font-bold">Failed to load spreadsheet.</p>
				<Button onClick={() => refetch()} variant="outline">
					<IconReload className="w-4 h-4 mr-2" /> Retry
				</Button>
			</div>
		);
	}

	const sheets = data?.sheets || [];

	return (
		<div className="h-screen flex flex-col bg-[#f8f9fa] -m-4 md:-m-8">
			{/* Top Bar - Mini */}
			<div className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 relative">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
						<IconDatabase className="w-5 h-5 text-white" />
					</div>
					<h1 className="text-lg font-medium text-neutral-700">
						Attendance Engine - Summer Camp 2024
					</h1>
				</div>

				{/* Floating Google Sheets Style Search Box */}
				{isSearchVisible && (
					<div className="absolute top-14 right-4 z-100 bg-white shadow-2xl border border-neutral-200 rounded-lg p-2 flex items-center gap-1 animate-in slide-in-from-top-2 duration-200">
						<div className="flex items-center border border-emerald-500 rounded px-2 bg-white h-9 min-w-[200px]">
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Find in sheet"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 outline-none text-sm h-full"
							/>
							{searchQuery && (
								<span className="text-[11px] text-neutral-400 font-medium px-2 border-l border-neutral-200 ml-2">
									{matches.length > 0 ? `${currentMatchIndex + 1} of ${matches.length}` : "0 of 0"}
								</span>
							)}
						</div>
						<div className="flex items-center relative">
							<button
								type="button"
								onClick={handlePrevMatch}
								className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
								title="Previous match"
							>
								<IconChevronUp className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={handleNextMatch}
								className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
								title="Next match"
							>
								<IconChevronDown className="w-4 h-4" />
							</button>
							<div className="w-px h-6 bg-neutral-200 mx-1" />

							{/* Date Selector Popover */}
							<div className="relative">
								<button
									type="button"
									onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
									className={cn(
										"p-1.5 rounded transition-colors",
										isDatePickerOpen
											? "bg-emerald-50 text-emerald-600"
											: "hover:bg-neutral-100 text-neutral-600",
									)}
									title="Go to date"
								>
									<IconCalendar className="w-4 h-4" />
								</button>

								{isDatePickerOpen && (
									<div className="absolute top-full right-0 mt-2 bg-white shadow-2xl border border-neutral-200 rounded-xl overflow-hidden z-110 animate-in fade-in slide-in-from-top-2 duration-200">
										<div className="p-3 bg-[#f8f9fa] border-b border-neutral-200 flex items-center justify-between">
											<span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
												Session Calendar
											</span>
											<IconCalendar className="w-3.5 h-3.5 text-emerald-600" />
										</div>
										<div className="p-2">
											<Calendar
												mode="single"
												selected={targetDate ? new Date(targetDate) : undefined}
												onSelect={(date) => date && handleDateClick(date)}
												disabled={(date) =>
													!activeDates.some((ad) => ad.toDateString() === date.toDateString())
												}
												modifiers={{
													session: (date) =>
														activeDates.some((ad) => ad.toDateString() === date.toDateString()),
												}}
												modifiersClassNames={{
													session: "bg-emerald-50 text-emerald-700 font-bold border-emerald-200",
												}}
												className="rounded-md border-none"
												showOutsideDays={false}
											/>
										</div>
										<div className="p-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-center">
											<p className="text-[9px] text-neutral-400 italic font-medium">
												Only active session dates are selectable
											</p>
										</div>
									</div>
								)}
							</div>

							<button
								type="button"
								onClick={() => {
									setIsSearchVisible(false);
									setIsDatePickerOpen(false);
									setSearchQuery("");
								}}
								className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600"
							>
								<IconX className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}

				<div className="flex items-center gap-2">
					<span className="text-[11px] text-neutral-400 font-medium mr-1">
						Last sync: {lastSync}
					</span>

					{/* Session Sort Order Toggle */}
					<Button
						onClick={() => setSessionOrder((prev) => (prev === "oldest" ? "newest" : "oldest"))}
						variant="outline"
						size="sm"
						className="h-8 border-neutral-300 hover:bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-bold px-3 transition-all"
						title={sessionOrder === "oldest" ? "Sort by: Oldest First" : "Sort by: Newest First"}
					>
						{sessionOrder === "oldest" ? (
							<>
								<IconSortAscending className="w-3.5 h-3.5 mr-1.5" /> Oldest First
							</>
						) : (
							<>
								<IconSortDescending className="w-3.5 h-3.5 mr-1.5" /> Newest First
							</>
						)}
					</Button>

					<Button
						onClick={handleSyncAll}
						disabled={syncMutation.isPending}
						variant="outline"
						size="sm"
						className="h-8 border-neutral-300 hover:bg-neutral-100 text-neutral-600 rounded-lg text-[11px] font-bold px-3 transition-all"
					>
						<IconRefresh
							className={cn("w-3.5 h-3.5 mr-1.5", syncMutation.isPending && "animate-spin")}
						/>
						{syncMutation.isPending ? "Syncing..." : "Sync Data"}
					</Button>
				</div>
			</div>

			{/* Main Spreadsheet Area */}
			<div className="flex-1 min-h-0 overflow-hidden relative">
				{sheets.map(
					(sheet) =>
						activeCourseId === sheet.courseId.toString() && (
							<SpreadsheetView
								key={sheet.courseId}
								sheet={sheet}
								sessionOrder={sessionOrder}
								searchQuery={searchQuery}
								currentMatch={matches[currentMatchIndex] || null}
								targetDate={targetDate}
							/>
						),
				)}
			</div>

			{/* Bottom Tabs Area - Exact Google Sheets Style */}
			<div className="h-10 bg-[#f8f9fa] border-t border-neutral-300 flex items-center px-1 shrink-0 overflow-x-auto scrollbar-hide">
				<div className="flex h-full">
					{sheets.map((sheet) => (
						<button
							key={sheet.courseId}
							type="button"
							onClick={() => setActiveCourseId(sheet.courseId.toString())}
							className={cn(
								"px-4 h-full flex items-center text-sm font-medium transition-colors border-r border-neutral-300 min-w-[120px] relative",
								activeCourseId === sheet.courseId.toString()
									? "bg-white text-emerald-700 border-t-2 border-t-emerald-600"
									: "text-neutral-600 hover:bg-neutral-200",
							)}
						>
							{sheet.name.split(" - ")[0]}
							{activeCourseId === sheet.courseId.toString() && (
								<div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
