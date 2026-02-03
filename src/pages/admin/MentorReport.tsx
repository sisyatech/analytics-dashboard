import {
	IconChevronRight,
	IconLoader,
	IconReportAnalytics,
	IconSearch,
	IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { MentorPerformanceReport } from "@/components/admin/Reports/MentorPerformanceReport";
import { Input } from "@/components/ui/input";
import { useActiveMentors } from "@/hooks/analytics/usePerformance";
import type { Mentor } from "@/types/performance";

const MentorReport = () => {
	const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: mentorsData, isLoading: isLoadingMentors } = useActiveMentors();

	const filteredMentors = useMemo(() => {
		if (!mentorsData?.mentors) return [];
		return mentorsData.mentors.filter(
			(m) =>
				m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.phone.includes(searchQuery),
		);
	}, [mentorsData, searchQuery]);

	if (selectedMentor) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className="h-full"
			>
				<MentorPerformanceReport mentor={selectedMentor} onBack={() => setSelectedMentor(null)} />
			</motion.div>
		);
	}

	return (
		<div className="space-y-8 pb-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
						<IconReportAnalytics className="w-8 h-8 text-blue-600 dark:text-blue-400" />
						Teacher Report
					</h1>
					<p className="text-gray-500 dark:text-neutral-400 mt-1">
						View and analyze performance metrics for mentors.
					</p>
				</div>

				<div className="relative w-full md:w-80 group">
					<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
					<Input
						placeholder="Search mentors..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-11 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl shadow-sm"
					/>
				</div>
			</div>

			{/* Mentor List Grid */}
			{isLoadingMentors ? (
				<div className="flex flex-col items-center justify-center py-40 text-neutral-400">
					<IconLoader className="w-10 h-10 animate-spin mb-4 text-blue-500" />
					<p className="font-medium animate-pulse">Loading mentors...</p>
				</div>
			) : filteredMentors.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-neutral-800/50 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-700">
					<IconUser className="w-16 h-16 text-neutral-200 dark:text-neutral-800 mb-4" />
					<p className="text-lg font-medium text-neutral-500">No mentors found</p>
					<p className="text-sm text-neutral-400">Try adjusting your search terms</p>
				</div>
			) : (
				<motion.div
					initial="hidden"
					animate="show"
					variants={{
						hidden: { opacity: 0 },
						show: {
							opacity: 1,
							transition: {
								staggerChildren: 0.05,
							},
						},
					}}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredMentors.map((mentor) => (
						<motion.div
							key={mentor.id}
							variants={{
								hidden: { opacity: 0, y: 20 },
								show: { opacity: 1, y: 0 },
							}}
							whileHover={{ y: -4, scale: 1.01 }}
							onClick={() => setSelectedMentor(mentor)}
							className="group relative bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 cursor-pointer transition-all duration-300"
						>
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl uppercase transition-all duration-300">
									<img
										src={`https://sisyaclass.xyz/student/thumbs/mentors/${mentor.id}.jpg`}
										alt={mentor.name}
										className="w-full h-full object-cover"
										onError={(e) => {
											const target = e.currentTarget;
											target.style.display = "none";
											const parent = target.parentElement;
											if (parent) {
												parent.innerText = mentor.name.charAt(0);
											}
										}}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-bold text-neutral-900 dark:text-white truncate">
										{mentor.name}
									</h4>
									<p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
										{mentor.email}
									</p>
								</div>
								<div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors">
									<IconChevronRight className="w-5 h-5" />
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}
		</div>
	);
};

export default MentorReport;
