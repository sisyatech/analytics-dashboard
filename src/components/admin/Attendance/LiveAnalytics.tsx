import {
	IconArrowLeft,
	IconBook,
	IconBroadcast,
	IconChevronRight,
	IconCircle,
	IconRadio,
	IconSchool,
	IconUsers,
	IconVideo,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { useLiveAttendance } from "@/hooks/analytics/useLiveAttendance";
import { type OngoingSession, useOngoingSessions } from "@/hooks/analytics/useOngoingSessions";
import { cn } from "@/lib/utils";

export const LiveAnalytics = () => {
	const [selectedSession, setSelectedSession] = useState<OngoingSession | null>(null);

	const handleBack = () => setSelectedSession(null);

	return (
		<div className="space-y-8">
			{/* page header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
						Attendance Analytics
					</h1>
					<p className="text-neutral-500 font-medium">Real-time monitoring of active classrooms</p>
				</div>
				<div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
					<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
					<span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
						System Live
					</span>
				</div>
			</div>

			<AnimatePresence mode="wait">
				{selectedSession ? (
					<LiveSessionDetails key="details" session={selectedSession} onBack={handleBack} />
				) : (
					<OngoingSessionsOverview key="overview" onSelect={setSelectedSession} />
				)}
			</AnimatePresence>
		</div>
	);
};

const OngoingSessionsOverview = ({ onSelect }: { onSelect: (s: OngoingSession) => void }) => {
	const { data: sessions, isLoading, error } = useOngoingSessions();

	const totalStudents =
		sessions?.reduce((acc, s) => acc + (s.analytics?.totalStudentsJoined || 0), 0) || 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="space-y-8"
		>
			{/* Stats Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<OverviewStat
					label="Ongoing Sessions"
					value={sessions?.length || 0}
					icon={<IconVideo />}
					color="emerald"
				/>
				<OverviewStat
					label="Live Participation"
					value={totalStudents}
					icon={<IconUsers />}
					color="blue"
				/>
				<OverviewStat
					label="Active Teachers"
					value={sessions?.length || 0} // Each ongoing session has 1 teacher usually
					icon={<IconSchool />}
					color="purple"
				/>
			</div>

			{/* Main Content */}
			<div className="space-y-4">
				<div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
					<h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
						<IconBroadcast className="w-6 h-6 text-rose-500" /> Currently Live Now
					</h2>
					<span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 rounded-full">
						{sessions?.length || 0} active stream{sessions?.length !== 1 ? "s" : ""}
					</span>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-48 rounded-3xl bg-neutral-50 dark:bg-neutral-800 animate-pulse border border-neutral-100 dark:border-neutral-700"
							/>
						))}
					</div>
				) : error ? (
					<div className="h-64 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 flex flex-col items-center justify-center text-center p-8 gap-3">
						<IconRadio className="w-12 h-12 text-rose-300" />
						<p className="text-rose-600 dark:text-rose-400 font-bold">
							Failed to load ongoing sessions
						</p>
						<p className="text-sm text-rose-500/70">
							Please check your connection or try again later
						</p>
					</div>
				) : sessions?.length === 0 ? (
					<div className="h-80 rounded-[40px] bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center p-12 gap-6 group">
						<div className="w-20 h-20 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
							<IconVideo className="w-10 h-10 text-neutral-300 opacity-20" />
						</div>
						<div>
							<h3 className="text-xl font-bold dark:text-white mb-2">No Ongoing Sessions</h3>
							<p className="text-neutral-500 max-w-sm">
								There are no live classes happening at the moment. As soon as a teacher starts a
								session, it will appear here.
							</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{sessions?.map((session) => (
							<motion.button
								key={session.id}
								whileHover={{ y: -8, scale: 1.01 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => onSelect(session)}
								className="group relative flex flex-col p-8 rounded-[36px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
							>
								{/* Card Type / Badge */}
								<div className="flex justify-between items-start mb-6">
									<div className="flex flex-col gap-1">
										<p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-blue-500 transition-colors">
											Grade {session.grade}
										</p>
										<h3 className="text-xl font-bold dark:text-white leading-tight">
											{session.subjectName}
										</h3>
									</div>
									<div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 group-hover:rotate-12 transition-transform duration-500">
										<IconRadio className="w-6 h-6 animate-pulse" />
									</div>
								</div>

								{/* Session Content */}
								<div className="space-y-4 mb-8">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
											<IconCircle className="w-3 h-3" />
										</div>
										<p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 line-clamp-1">
											{session.title}
										</p>
									</div>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
											<IconSchool className="w-4 h-4" />
										</div>
										<p className="text-sm font-medium text-neutral-500">
											With {session.mentorName}
										</p>
									</div>
								</div>

								{/* Footer */}
								<div className="mt-auto pt-6 border-t border-neutral-50 dark:border-neutral-700/50 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<IconUsers className="w-4 h-4 text-blue-500" />
										<span className="text-xs font-bold dark:text-neutral-300">
											{session.analytics?.totalStudentsJoined || 0} Participating
										</span>
									</div>
									<div className="px-4 py-2 rounded-xl bg-blue-500 text-sm font-bold text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
										Details <IconChevronRight className="w-4 h-4" />
									</div>
								</div>
							</motion.button>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
};

const LiveSessionDetails = ({
	session,
	onBack,
}: {
	session: OngoingSession;
	onBack: () => void;
}) => {
	const { students, isConnected, status } = useLiveAttendance(session.id);

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-8"
		>
			{/* Breadcrumb Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={onBack}
						className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all hover:scale-110 active:scale-95"
					>
						<IconArrowLeft className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
					</button>
					<div>
						<div className="flex items-center gap-2 text-rose-500 font-bold mb-1 uppercase tracking-widest text-[10px]">
							<IconBroadcast className="w-3.5 h-3.5 animate-pulse" /> Live Now
						</div>
						<h2 className="text-3xl font-black dark:text-white leading-tight">
							Grade {session.grade} • {session.subjectName}
						</h2>
						<p className="text-neutral-500 font-medium mt-1">
							Currently Monitoring:{" "}
							<span className="text-neutral-900 dark:text-white font-bold">{session.title}</span>
						</p>
					</div>
				</div>

				<div className="flex flex-col items-end gap-2">
					<div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
						<div
							className={cn(
								"w-2.5 h-2.5 rounded-full animate-pulse",
								isConnected ? "bg-emerald-500" : "bg-rose-500",
							)}
						/>
						<span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
							{isConnected
								? "Socket Connected"
								: status === "connecting"
									? "Establishing..."
									: "Connection Lost"}
						</span>
					</div>
					<p className="text-[9px] font-black uppercase text-neutral-400 tracking-tighter">
						Sync ID: #{session.id}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Student List Table */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center justify-between px-2">
						<h3 className="font-bold text-lg dark:text-neutral-200 flex items-center gap-3">
							<IconUsers className="w-6 h-6 text-blue-500" /> Participants
						</h3>
						<span className="text-[10px] font-black text-neutral-400 underline decoration-blue-500/50 underline-offset-4 uppercase tracking-widest">
							{students.length} Student{students.length !== 1 ? "s" : ""} Present
						</span>
					</div>

					<div className="rounded-[40px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-2xl shadow-neutral-500/5">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-neutral-50/50 dark:bg-neutral-900/50">
									<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">
										Student Profile
									</th>
									<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">
										Engagement ID
									</th>
									<th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">
										Activity
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-50 dark:divide-neutral-700/30">
								{students.map((student) => (
									<tr
										key={student.id}
										className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
									>
										<td className="px-8 py-6">
											<div className="flex items-center gap-4">
												<div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center font-black text-blue-600 text-lg shadow-sm">
													{student.name.charAt(0).toUpperCase()}
												</div>
												<div className="flex flex-col">
													<span className="font-bold dark:text-white text-base">
														{student.name}
													</span>
													<span className="text-[11px] text-neutral-400 font-bold uppercase tracking-tight">
														Active Participant
													</span>
												</div>
											</div>
										</td>
										<td className="px-8 py-6">
											<div className="flex flex-col">
												<span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
													#{student.id}
												</span>
												<span className="text-[10px] text-neutral-400">{student.phone}</span>
											</div>
										</td>
										<td className="px-8 py-6 text-right">
											<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50 dark:border-emerald-800/30 shadow-sm">
												<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
												Active Now
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{students.length === 0 && (
							<div className="p-20 flex flex-col items-center justify-center text-center gap-4 opacity-50">
								<IconUsers className="w-16 h-16 text-neutral-300" />
								<p className="font-bold text-neutral-400">Waiting for students to join...</p>
							</div>
						)}
					</div>
				</div>

				{/* Insights Sidebar */}
				<div className="space-y-8">
					<div className="p-8 rounded-[40px] bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/20">
						<div className="space-y-6">
							<div className="flex items-center gap-3 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
								<IconBook className="w-4 h-4 opacity-80" />
								<p className="text-[9px] font-black uppercase tracking-[0.2em]">Contextual Data</p>
							</div>
							<div>
								<h4 className="text-2xl font-black mb-2">{session.subjectName}</h4>
								<p className="text-blue-100 text-sm leading-relaxed opacity-90">
									Currently monitoring active participation for Grade {session.grade}. All student
									interactions are streamed via real-time WebSocket protocol.
								</p>
							</div>
							<div className="pt-4 border-t border-white/10">
								<div className="flex items-center justify-between">
									<span className="text-[10px] font-black uppercase opacity-60">
										Mentor assigned
									</span>
									<span className="text-sm font-bold">{session.mentorName}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="p-8 rounded-[40px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-xl shadow-neutral-500/5">
						<h4 className="font-black dark:text-white mb-6 uppercase tracking-widest text-[11px] border-b dark:border-neutral-700 pb-4">
							Join Activity Feed
						</h4>
						<div className="space-y-6">
							{[...students]
								.reverse()
								.slice(0, 4)
								.map((s) => (
									<motion.div
										key={s.id}
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										className="flex items-start gap-4"
									>
										<div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-500/50" />
										<div>
											<p className="text-[12px] dark:text-neutral-300 font-bold leading-tight">
												{s.name}
											</p>
											<p className="text-[10px] text-neutral-400 mt-0.5">joined the room</p>
										</div>
									</motion.div>
								))}
							{students.length === 0 && (
								<p className="text-[11px] text-neutral-400 italic font-medium animate-pulse">
									Scanning for incoming signals...
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const OverviewStat = ({
	label,
	value,
	icon,
	color,
}: {
	label: string;
	value: number;
	icon: React.ReactNode;
	color: "emerald" | "blue" | "purple";
}) => {
	const colors = {
		emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
		blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
		purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
	};

	return (
		<div className="p-8 rounded-[40px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-xl shadow-neutral-500/5 group hover:-translate-y-2 transition-all duration-500">
			<div className="flex items-center gap-6">
				<div
					className={cn(
						"p-5 rounded-[24px] group-hover:rotate-12 transition-all duration-500 shadow-inner",
						colors[color],
					)}
				>
					{icon}
				</div>
				<div>
					<p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">
						{label}
					</p>
					<h3 className="text-4xl font-black dark:text-white tracking-tighter">
						{value.toLocaleString()}
					</h3>
				</div>
			</div>
		</div>
	);
};
