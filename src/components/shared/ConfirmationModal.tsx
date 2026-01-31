import { IconAlertTriangle, IconLoader2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
	variant?: "danger" | "warning" | "info";
}

export const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	isLoading = false,
	variant = "warning",
}: ConfirmationModalProps) => {
	const variants = {
		danger: {
			bg: "bg-rose-50 dark:bg-rose-900/30",
			text: "text-rose-600 dark:text-rose-400",
			button: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500",
		},
		warning: {
			bg: "bg-amber-50 dark:bg-amber-900/30",
			text: "text-amber-600 dark:text-amber-400",
			button: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500",
		},
		info: {
			bg: "bg-blue-50 dark:bg-blue-900/30",
			text: "text-blue-600 dark:text-blue-400",
			button: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500",
		},
	};

	const currentVariant = variants[variant];

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
						className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-800"
					>
						<div className="flex flex-col">
							{/* Header */}
							<div className="flex items-center justify-between border-b border-neutral-100 p-4 px-6 dark:border-neutral-700">
								<div className="flex items-center gap-3">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentVariant.bg} ${currentVariant.text}`}
									>
										<IconAlertTriangle className="h-5 w-5" />
									</div>
									<h2 className="text-lg font-bold text-neutral-900 dark:text-white leading-none">
										{title}
									</h2>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={onClose}
									className="rounded-lg h-8 w-8"
								>
									<IconX className="h-4 w-4" />
								</Button>
							</div>

							{/* Body */}
							<div className="p-6">
								<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
									{message}
								</p>
							</div>

							{/* Footer */}
							<div className="bg-neutral-50/50 p-6 flex items-center justify-end gap-3 dark:bg-neutral-900/20">
								<Button
									type="button"
									variant="ghost"
									onClick={onClose}
									disabled={isLoading}
									className="text-xs font-bold rounded-xl"
								>
									{cancelText}
								</Button>
								<Button
									type="button"
									onClick={onConfirm}
									disabled={isLoading}
									className={`min-w-28 h-10 text-xs font-bold text-white rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${currentVariant.button}`}
								>
									{isLoading ? (
										<div className="flex items-center gap-2">
											<IconLoader2 className="h-3.5 w-3.5 animate-spin" />
											<span>Processing...</span>
										</div>
									) : (
										<span>{confirmText}</span>
									)}
								</Button>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
