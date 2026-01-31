import { IconLoader2, IconMessage, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreateAnnouncement } from "@/hooks/analytics/useAnnouncement";
import {
	AnnouncementAudience,
	AnnouncementScope,
	AnnouncementType,
	type CreateAnnouncementPayload,
} from "@/types/announcement";

interface AnnouncementModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialPayload: Partial<CreateAnnouncementPayload>;
	userName: string;
}

export const AnnouncementModal = ({
	isOpen,
	onClose,
	initialPayload,
	userName,
}: AnnouncementModalProps) => {
	const { mutate: sendAnnouncement, isPending } = useCreateAnnouncement();

	const [payload, setPayload] = useState<CreateAnnouncementPayload>({
		title: initialPayload.title || "Important Notification",
		message: initialPayload.message || "",
		type: initialPayload.type || AnnouncementType.IMPORTANT,
		audience: initialPayload.audience || AnnouncementAudience.STUDENTS,
		scope: initialPayload.scope || AnnouncementScope.INDIVIDUAL,
		mentorId: initialPayload.mentorId,
		userId: initialPayload.userId,
	});

	// Reset payload when initialPayload changes or modal opens
	useEffect(() => {
		if (isOpen) {
			setPayload({
				title: initialPayload.title || "Important Notification",
				message: initialPayload.message || "",
				type: initialPayload.type ?? AnnouncementType.IMPORTANT,
				audience: initialPayload.audience || AnnouncementAudience.STUDENTS,
				scope: initialPayload.scope || AnnouncementScope.INDIVIDUAL,
				mentorId: initialPayload.mentorId,
				userId: initialPayload.userId,
			});
		}
	}, [isOpen, initialPayload]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendAnnouncement(payload, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm"
					/>

					{/* Modal Content */}
					<motion.div
						layout
						initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
						animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
						transition={{
							type: "spring",
							damping: 25,
							stiffness: 300,
						}}
						className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-800"
					>
						<form onSubmit={handleSubmit} className="flex flex-col">
							{/* Header */}
							<motion.div
								layout="position"
								className="flex items-center justify-between border-b border-neutral-100 p-3 px-5 dark:border-neutral-700"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
										<IconMessage className="h-4 w-4" />
									</div>
									<div>
										<h2 className="text-base font-bold text-neutral-900 dark:text-white leading-none">
											Send Announcement
										</h2>
										<p className="text-[10px] font-medium text-neutral-500 mt-0.5">
											Recipient: <span className="text-blue-500 font-bold">{userName}</span>
										</p>
									</div>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={onClose}
									className="rounded-lg h-7 w-7"
								>
									<IconX className="h-3.5 w-3.5" />
								</Button>
							</motion.div>

							{/* Body */}
							<motion.div
								initial="hidden"
								animate="visible"
								variants={{
									visible: {
										transition: {
											staggerChildren: 0.05,
											delayChildren: 0.1,
										},
									},
								}}
								className="p-5 space-y-3.5"
							>
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 10 },
										visible: { opacity: 1, y: 0 },
									}}
									className="grid grid-cols-2 gap-3.5"
								>
									<div className="space-y-1">
										<div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
											Type
										</div>
										<Select
											value={payload.type}
											onValueChange={(val) =>
												setPayload({ ...payload, type: val as AnnouncementType })
											}
										>
											<SelectTrigger className="h-9 rounded-lg border-neutral-200 bg-neutral-50 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-900">
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(AnnouncementType).map((type) => (
													<SelectItem key={type} value={type} className="text-xs">
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-1">
										<div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
											Title
										</div>
										<Input
											value={payload.title}
											onChange={(e) => setPayload({ ...payload, title: e.target.value })}
											placeholder="Title"
											className="h-9 rounded-lg border-neutral-200 bg-neutral-50 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-900"
											required
										/>
									</div>
								</motion.div>

								<motion.div
									variants={{
										hidden: { opacity: 0, y: 10 },
										visible: { opacity: 1, y: 0 },
									}}
									className="space-y-1"
								>
									<div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
										Message
									</div>
									<div className="group relative">
										<textarea
											value={payload.message}
											onChange={(e) => setPayload({ ...payload, message: e.target.value })}
											placeholder="Write your message here..."
											rows={3}
											className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500"
											required
										/>
										<IconMessage className="absolute right-2.5 bottom-2.5 h-3.5 w-3.5 text-neutral-300 transition group-focus-within:text-blue-400" />
									</div>
								</motion.div>
							</motion.div>

							{/* Footer */}
							<div className="bg-neutral-50/50 p-5 dark:bg-neutral-900/20">
								<Button
									type="submit"
									disabled={isPending}
									className="group relative h-10 w-full overflow-hidden rounded-lg bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 dark:bg-blue-500"
								>
									{isPending ? (
										<div className="flex items-center gap-2">
											<IconLoader2 className="h-3.5 w-3.5 animate-spin" />
											<span>Sending...</span>
										</div>
									) : (
										<div className="flex items-center justify-center gap-2">
											<span>Confirm & Send Notification</span>
										</div>
									)}
								</Button>
								<p className="mt-2.5 text-center text-[9px] font-bold uppercase tracking-widest text-neutral-400">
									Sends a push notification to {userName}
								</p>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
