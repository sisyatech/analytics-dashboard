import { IconMessageCircle, IconSend } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/hooks/analytics/useLiveAttendance";
import { cn } from "@/lib/utils";

interface LiveChatProps {
	messages: ChatMessage[];
	onSend: (text: string) => void;
	isConnected: boolean;
}

export const LiveChat = ({ messages, onSend, isConnected }: LiveChatProps) => {
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom on new messages
	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
	useEffect(() => {
		const el = scrollRef.current;
		if (el) {
			el.scrollTop = el.scrollHeight;
		}
	}, [messages]);

	const handleSend = () => {
		if (!input.trim()) return;
		onSend(input.trim());
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const formatTime = (time: string) => {
		try {
			const d = new Date(time);
			return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
		} catch {
			return "";
		}
	};

	return (
		<div className="flex flex-col h-[520px] rounded-[40px] bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-xl shadow-neutral-500/5 overflow-hidden">
			{/* Header */}
			<div className="px-8 py-5 border-b border-neutral-100 dark:border-neutral-700/50 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
						<IconMessageCircle className="w-5 h-5" />
					</div>
					<div>
						<h4 className="font-black dark:text-white text-sm uppercase tracking-widest">
							Classroom Chat
						</h4>
						<p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
							{messages.length} message{messages.length !== 1 ? "s" : ""}
						</p>
					</div>
				</div>
				<div
					className={cn(
						"w-2 h-2 rounded-full",
						isConnected ? "bg-emerald-500 animate-pulse" : "bg-neutral-300",
					)}
				/>
			</div>

			{/* Messages */}
			<div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin">
				{messages.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-center gap-3 opacity-40">
						<IconMessageCircle className="w-12 h-12 text-neutral-300" />
						<p className="text-sm font-bold text-neutral-400">No messages yet</p>
						<p className="text-xs text-neutral-400">Chat messages will appear here in real-time</p>
					</div>
				) : (
					messages.map((msg, idx) => (
						<motion.div
							key={`${msg.from}-${msg.time}-${idx}`}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							className={cn("flex items-end gap-2", msg.isMe ? "justify-end" : "justify-start")}
						>
							{/* Avatar (left for others) */}
							{!msg.isMe && (
								<div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xs font-black shrink-0">
									{(msg.name || "?")[0]?.toUpperCase()}
								</div>
							)}

							<div
								className={cn(
									"max-w-[75%] px-4 py-2.5 rounded-2xl",
									msg.isMe
										? "bg-blue-500 text-white rounded-br-md"
										: "bg-neutral-100 dark:bg-neutral-700 rounded-bl-md",
								)}
							>
								{/* Sender name + time */}
								<div className="flex items-center gap-2 mb-1">
									<span
										className={cn(
											"text-[11px] font-bold truncate max-w-[120px]",
											msg.isMe ? "text-blue-100" : "text-neutral-500 dark:text-neutral-400",
										)}
									>
										{msg.name}
									</span>
									<span
										className={cn(
											"text-[10px]",
											msg.isMe ? "text-blue-200/70" : "text-neutral-400 dark:text-neutral-500",
										)}
									>
										{formatTime(msg.time)}
									</span>
								</div>
								<p
									className={cn(
										"text-[13px] leading-relaxed wrap-break-word",
										msg.isMe ? "text-white" : "text-neutral-800 dark:text-neutral-200",
									)}
								>
									{msg.message}
								</p>
							</div>

							{/* Avatar (right for me) */}
							{msg.isMe && (
								<div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
									{(msg.name || "?")[0]?.toUpperCase()}
								</div>
							)}
						</motion.div>
					))
				)}
			</div>

			{/* Input */}
			<div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-700/50">
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type a message..."
						disabled={!isConnected}
						className="flex-1 h-10 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
					/>
					<button
						type="button"
						onClick={handleSend}
						disabled={!input.trim() || !isConnected}
						className="h-10 w-10 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-200 dark:disabled:bg-neutral-700 text-white flex items-center justify-center transition-all active:scale-95 disabled:cursor-not-allowed"
					>
						<IconSend className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};
