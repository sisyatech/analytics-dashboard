import { IconCalendar, IconChecklist, IconUsers } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import type { CourseHomework } from "@/types/performance";

interface CourseHomeworkViewProps {
	data: CourseHomework[];
}

export const CourseHomeworkView = ({ data }: CourseHomeworkViewProps) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.map((hw, index) => (
					<motion.div
						key={hw.homeworkId}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.05 }}
						className="p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg transition-all"
					>
						<div className="flex flex-col h-full">
							<div className="flex justify-between items-start mb-4">
								<div className="space-y-1">
									<span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest">
										Homework
									</span>
									<h4 className="text-base font-black text-neutral-900 dark:text-white leading-tight line-clamp-2">
										{hw.sessionName}
									</h4>
								</div>
								<div className="flex flex-col items-center justify-center min-w-14 bg-neutral-50 dark:bg-neutral-800 rounded-xl p-2 border border-neutral-100 dark:border-neutral-700">
									<span className="text-[10px] uppercase font-black text-neutral-400">
										{format(parseISO(hw.sessionDate), "MMM")}
									</span>
									<span className="text-xl font-black text-neutral-900 dark:text-white leading-none">
										{format(parseISO(hw.sessionDate), "dd")}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 mb-4">
								<div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
									<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Questions</p>
									<div className="flex items-center gap-1.5 text-sm font-black text-neutral-900 dark:text-white">
										<IconChecklist className="w-4 h-4 text-purple-500" />
										{hw.totalQuestions}
									</div>
								</div>
								<div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
									<p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Completed</p>
									<div className="flex items-center gap-1.5 text-sm font-black text-neutral-900 dark:text-white">
										<IconUsers className="w-4 h-4 text-blue-500" />
										{hw.submissionCount}
									</div>
								</div>
							</div>

							<div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
								<div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase">
									<IconCalendar className="w-3 h-3" />
									Assigned: {format(parseISO(hw.createdAt), "MMM dd")}
								</div>
								<span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase">
									Active
								</span>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};
