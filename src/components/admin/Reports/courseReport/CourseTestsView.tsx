import { IconBadge, IconCalendar, IconClock, IconUsers } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import type { CourseTest } from "@/types/performance";

interface CourseTestsViewProps {
	data: CourseTest[];
}

export const CourseTestsView = ({ data }: CourseTestsViewProps) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.map((test, index) => (
					<motion.div
						key={test.testId}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.05 }}
						className="p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
					>
						<div className="flex flex-col h-full relative z-10">
							<div className="flex justify-between items-start mb-4">
								<div className="space-y-1">
									<span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
										{test.mode} Test
									</span>
									<h4 className="text-base font-black text-neutral-900 dark:text-white leading-tight line-clamp-2">
										{test.title}
									</h4>
								</div>
								<div className="flex flex-col items-center justify-center min-w-14 bg-neutral-50 dark:bg-neutral-800 rounded-xl p-2 border border-neutral-100 dark:border-neutral-700">
									<span className="text-[10px] uppercase font-black text-neutral-400">
										{format(parseISO(test.startDate), "MMM")}
									</span>
									<span className="text-xl font-black text-neutral-900 dark:text-white leading-none">
										{format(parseISO(test.startDate), "dd")}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 mb-4">
								<div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
									<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Max Marks</p>
									<div className="flex items-center gap-1.5 text-sm font-black text-neutral-900 dark:text-white">
										<IconBadge className="w-4 h-4 text-orange-500" />
										{test.totalMarks || "N/A"}
									</div>
								</div>
								<div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
									<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">
										Submissions
									</p>
									<div className="flex items-center gap-1.5 text-sm font-black text-neutral-900 dark:text-white">
										<IconUsers className="w-4 h-4 text-blue-500" />
										{test.submissionCount}
									</div>
								</div>
							</div>

							<div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
								<div className="flex items-center gap-1.5">
									<IconCalendar className="w-3.5 h-3.5" />
									{format(parseISO(test.startDate), "MMM dd")}
								</div>
								<div className="flex items-center gap-1.5">
									<IconClock className="w-3.5 h-3.5" />
									{test.duration} mins
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};
