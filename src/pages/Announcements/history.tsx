import {
	IconEye,
	IconHistory,
	IconLoader,
	IconMessage,
	IconSearch,
	IconUsers,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAnnouncements } from "@/hooks/admin/useAnnouncements";

const SkeletonRow = () => (
	<tr className="animate-pulse">
		<td className="px-8 py-6">
			<div className="flex gap-5">
				<div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
				<div className="flex flex-col justify-center flex-1 gap-2">
					<div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4" />
					<div className="h-3 bg-neutral-50 dark:bg-neutral-900 rounded w-1/2" />
				</div>
			</div>
		</td>
		<td className="px-8 py-6">
			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full w-16" />
					<div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded-full w-16" />
				</div>
				<div className="h-3 bg-neutral-50 dark:bg-neutral-900 rounded w-20" />
			</div>
		</td>
		<td className="px-8 py-6">
			<div className="flex justify-center gap-10">
				<div className="w-12 h-10 bg-neutral-50 dark:bg-neutral-800 rounded-lg" />
				<div className="w-12 h-10 bg-neutral-50 dark:bg-neutral-800 rounded-lg" />
			</div>
		</td>
		<td className="px-8 py-6">
			<div className="flex flex-col items-end gap-2">
				<div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-16" />
				<div className="h-3 bg-neutral-50 dark:bg-neutral-900 rounded w-12" />
			</div>
		</td>
	</tr>
);

const SkeletonCard = () => (
	<div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm animate-pulse">
		<div className="flex items-start gap-4">
			<div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
			<div className="flex-1 space-y-3">
				<div className="flex justify-between">
					<div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2" />
					<div className="h-3 bg-neutral-50 dark:bg-neutral-900 rounded w-12" />
				</div>
				<div className="h-3 bg-neutral-50 dark:bg-neutral-900 rounded w-3/4" />
				<div className="flex gap-2 mt-4">
					<div className="h-4 bg-neutral-50 dark:bg-neutral-900 rounded w-12" />
					<div className="h-4 bg-neutral-50 dark:bg-neutral-900 rounded w-12" />
				</div>
			</div>
		</div>
	</div>
);

const HistoryAnnouncements = () => {
	const [search, setSearch] = useState("");
	const limit = 10;
	const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useAnnouncements(limit);

	const [showSkeleton, setShowSkeleton] = useState(false);
	const observerTarget = useRef<HTMLDivElement>(null);

	// Sync skeleton visibility with fetching state, but with an artificial exit delay
	useEffect(() => {
		if (isFetchingNextPage) {
			setShowSkeleton(true);
		} else {
			const timer = setTimeout(() => setShowSkeleton(false), 1500);
			return () => clearTimeout(timer);
		}
	}, [isFetchingNextPage]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{
				threshold: 0.1,
				rootMargin: "800px",
			},
		);

		const currentTarget = observerTarget.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const allAnnouncements = useMemo(() => {
		return data?.pages.flatMap((page) => page.data) || [];
	}, [data]);

	const filteredAnnouncements = useMemo(() => {
		if (!search) return allAnnouncements;
		return allAnnouncements.filter(
			(a) =>
				a.title.toLowerCase().includes(search.toLowerCase()) ||
				a.message.toLowerCase().includes(search.toLowerCase()),
		);
	}, [allAnnouncements, search]);

	if (isLoading) {
		return (
			<div className="flex flex-col h-[60vh] items-center justify-center gap-4">
				<IconLoader className="w-10 h-10 text-blue-500 animate-spin" />
				<p className="text-neutral-500 font-medium animate-pulse">Fetching announcements...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col h-[60vh] items-center justify-center gap-4 text-red-500">
				<p className="text-lg font-semibold">Error loading history</p>
				<p className="text-sm opacity-80">
					{error instanceof Error ? error.message : "Something went wrong"}
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-8 space-y-8 w-full max-w-full mx-auto transition-all duration-500">
			{/* Header Section */}
			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
				<div className="space-y-2">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-3"
					>
						<div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
							<IconHistory className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
							Announcements
						</h1>
					</motion.div>
					<p className="text-neutral-500 font-medium text-sm md:text-base ml-1">
						Manage and track all system-wide communications and updates.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
					<div className="relative w-full sm:w-80 group">
						<IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
						<Input
							placeholder="Search history..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-11 h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
						/>
					</div>
				</div>
			</div>

			{/* Desktop Table View */}
			<div className="hidden lg:block bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/40 dark:shadow-none overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-separate border-spacing-0">
						<thead>
							<tr className="bg-neutral-50/50 dark:bg-neutral-800/30">
								<th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
									Announcement Detail
								</th>
								<th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
									Status & Target
								</th>
								<th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 text-center">
									Analytics
								</th>
								<th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 text-right">
									Sent At
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
							<AnimatePresence mode="popLayout">
								{filteredAnnouncements.map((item, index) => (
									<motion.tr
										key={item.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.03 }}
										className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all cursor-default"
									>
										<td className="px-8 py-6 max-w-xl">
											<div className="flex gap-5">
												<div className="shrink-0 relative">
													{item.imageUrl || item.thumbnailUrl ? (
														<div className="w-16 h-16 rounded-2xl border-2 border-white dark:border-neutral-800 overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-500">
															<img
																src={item.imageUrl || item.thumbnailUrl || ""}
																alt=""
																className="w-full h-full object-cover"
															/>
														</div>
													) : (
														<div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:scale-110 transition-transform duration-500">
															<IconMessage className="w-7 h-7" />
														</div>
													)}
												</div>
												<div className="flex flex-col min-w-0 justify-center">
													<h3 className="text-base font-black text-neutral-900 dark:text-white truncate">
														{item.title}
													</h3>
													<p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 font-medium leading-relaxed max-w-sm">
														{item.message}
													</p>
												</div>
											</div>
										</td>

										<td className="px-8 py-6 whitespace-nowrap">
											<div className="flex flex-col gap-2">
												<div className="flex items-center gap-2">
													<div
														className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
															item.status === "SENT"
																? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
																: "bg-amber-100/50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
														}`}
													>
														<span
															className={`w-1.5 h-1.5 rounded-full ${item.status === "SENT" ? "bg-emerald-500" : "bg-amber-500"}`}
														/>
														{item.status}
													</div>
													<div className="bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
														{item.audience}
													</div>
												</div>
												<span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
													Scope: {item.scope}
												</span>
											</div>
										</td>

										<td className="px-8 py-6">
											<div className="flex items-center justify-center gap-10">
												<div className="flex flex-col items-center">
													<span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">
														Delivered
													</span>
													<div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
														<IconUsers className="w-4 h-4 text-blue-500" />
														<span className="text-sm font-black text-neutral-800 dark:text-neutral-200">
															{item.totalSent}
														</span>
													</div>
												</div>
												<div className="flex flex-col items-center">
													<span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1.5">
														Reads
													</span>
													<div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
														<IconEye className="w-4 h-4 text-emerald-500" />
														<span className="text-sm font-black text-neutral-800 dark:text-neutral-200">
															{item.totalRead || item._count?.reads || 0}
														</span>
													</div>
												</div>
											</div>
										</td>

										<td className="px-8 py-6 text-right">
											<div className="flex flex-col items-end">
												<div className="text-sm font-black text-neutral-900 dark:text-white tabular-nums">
													{item.sentAt ? format(parseISO(item.sentAt), "dd MMM, yy") : "N/A"}
												</div>
												<div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">
													{item.sentAt ? format(parseISO(item.sentAt), "HH:mm a") : ""}
												</div>
											</div>
										</td>
									</motion.tr>
								))}
								{showSkeleton && (
									<>
										<SkeletonRow />
										<SkeletonRow />
										<SkeletonRow />
									</>
								)}
							</AnimatePresence>
						</tbody>
					</table>
				</div>
			</div>

			{/* Mobile Card View */}
			<div className="lg:hidden space-y-4">
				{filteredAnnouncements.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
					>
						<div className="flex items-start gap-4">
							<div className="shrink-0">
								{item.imageUrl || item.thumbnailUrl ? (
									<img
										src={item.imageUrl || item.thumbnailUrl || ""}
										alt=""
										className="w-14 h-14 rounded-2xl object-cover"
									/>
								) : (
									<div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
										<IconMessage className="w-6 h-6" />
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-start gap-2">
									<h3 className="text-sm font-black text-neutral-900 dark:text-white truncate">
										{item.title}
									</h3>
									<span className="text-[10px] text-neutral-400 font-bold whitespace-nowrap">
										{item.sentAt ? format(parseISO(item.sentAt), "dd MMM") : ""}
									</span>
								</div>
								<p className="text-xs text-neutral-500 line-clamp-2 mt-1 font-medium">
									{item.message}
								</p>

								<div className="flex flex-wrap items-center gap-2 mt-4">
									<span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
										{item.status}
									</span>
									<span className="text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
										{item.audience}
									</span>
									<div className="ml-auto flex items-center gap-3">
										<div className="flex items-center gap-1">
											<IconUsers className="w-3 h-3 text-neutral-400" />
											<span className="text-[10px] font-black text-neutral-600">
												{item.totalSent}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<IconEye className="w-3 h-3 text-neutral-400" />
											<span className="text-[10px] font-black text-neutral-600">
												{item.totalRead || item._count?.reads || 0}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				))}
				{showSkeleton && (
					<>
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</>
				)}
			</div>

			{/* Infinite Scroll Trigger */}
			<div ref={observerTarget} className="flex flex-col items-center justify-center py-12 gap-4">
				{showSkeleton && (
					<div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-neutral-900 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-800">
						<IconLoader className="w-5 h-5 text-blue-500 animate-spin" />
						<span className="text-sm font-black text-neutral-600 dark:text-neutral-400 tracking-wide">
							Transforming data...
						</span>
					</div>
				)}
				{!hasNextPage && !isLoading && allAnnouncements.length > 0 && (
					<div className="flex flex-col items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
						<span className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] italic">
							End of History
						</span>
					</div>
				)}
			</div>

			{/* Empty State */}
			{filteredAnnouncements.length === 0 && !isLoading && (
				<div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-neutral-900 rounded-[32px] border border-dashed border-neutral-300 dark:border-neutral-800 transition-all duration-300">
					<div className="w-20 h-20 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-6">
						<IconSearch className="w-10 h-10 text-neutral-200" />
					</div>
					<h3 className="text-xl font-black text-neutral-900 dark:text-white">No results found</h3>
					<p className="text-neutral-500 font-medium mt-1">Try adjusting your search criteria</p>
				</div>
			)}
		</div>
	);
};

export default HistoryAnnouncements;
