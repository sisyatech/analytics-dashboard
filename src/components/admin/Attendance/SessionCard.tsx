import {
	IconCalendar,
	IconChevronRight,
	IconCircleCheck,
	IconCircleCheckFilled,
	IconCircleX,
	IconClock,
	IconTag,
	IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/analytics";
import { formatDate, formatTime } from "@/utils/date";

interface SessionCardProps {
	session: Session;
	onSelect: (id: number) => void;
}

export const SessionCard = ({ session, onSelect }: SessionCardProps) => {
	const isCompleted = !!session.actualEndTime;

	return (
		<motion.button
			whileHover={{
				y: -4,
				boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => onSelect(session.id)}
			className="group flex flex-col text-left p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden"
		>
			{/* Background Accent */}
			<div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

			<div className="flex justify-between items-start mb-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
							{session.subject.name}
						</span>
						{isCompleted ? (
							<span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-tight">
								<IconCircleCheckFilled className="w-3 h-3" /> Done
							</span>
						) : (
							<span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase tracking-tight">
								<div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
							</span>
						)}
					</div>
					<div className="flex items-center gap-1.5 mt-1 text-neutral-400">
						<IconCalendar className="w-3 h-3" />
						<span className="text-[10px] font-bold uppercase tracking-tighter">
							{formatDate(session.scheduledStartTime)}
						</span>
					</div>
				</div>
				<div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
					<IconChevronRight className="w-4 h-4" />
				</div>
			</div>

			<h3 className="font-bold text-neutral-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
				{session.detail}
			</h3>

			<div className="mt-auto pt-4 border-t border-neutral-50 dark:border-neutral-700/50 grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Teacher</p>
					<div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
						<div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
							<IconUser className="w-3 h-3" />
						</div>
						<span className="text-[11px] font-bold truncate">{session.scheduledTeacher.name}</span>
					</div>
				</div>
				<div className="space-y-1 text-right">
					<p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
						Homework
					</p>
					<div
						className={cn(
							"inline-flex items-center gap-1 text-[11px] font-bold",
							session.isHomeworkUploaded ? "text-emerald-500" : "text-rose-500",
						)}
					>
						{session.isHomeworkUploaded ? "Uploaded" : "Missing"}
						{session.isHomeworkUploaded ? (
							<IconCircleCheck className="w-3 h-3" />
						) : (
							<IconCircleX className="w-3 h-3" />
						)}
					</div>
				</div>
			</div>

			<div className="mt-4 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-tight">
				<div className="flex items-center gap-1.5">
					<IconClock className="w-3.5 h-3.5 text-blue-500/70" />
					<span>
						{formatTime(session.scheduledStartTime)} • {session.scheduledDuration}m
					</span>
				</div>
				<div className="flex items-center gap-1">
					<IconTag className="w-3 h-3" />
					<span>#{session.id}</span>
				</div>
			</div>
		</motion.button>
	);
};
