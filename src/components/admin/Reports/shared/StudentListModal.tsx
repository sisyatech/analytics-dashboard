import { IconPhone, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getPresentStudents } from "@/api/performance";
import type { PresentStudent } from "@/types/performance";

interface StudentListModalProps {
	sessionId: number | null;
	isOpen: boolean;
	onClose: () => void;
}

export const StudentListModal = ({ sessionId, isOpen, onClose }: StudentListModalProps) => {
	const [students, setStudents] = useState<PresentStudent[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && sessionId) {
			const fetchStudents = async () => {
				setIsLoading(true);
				try {
					const response = await getPresentStudents(sessionId);
					if (response.success) {
						setStudents(response.students);
					}
				} catch (_error) {
					//console.error("Failed to fetch present students", error);
				} finally {
					setIsLoading(false);
				}
			};
			fetchStudents();
		} else {
			setStudents([]);
		}
	}, [isOpen, sessionId]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: Static element used as interactive for card selection */}
			<div
				className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onClose();
					}
				}}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
						<h3 className="text-lg font-bold text-neutral-900 dark:text-white">Present Students</h3>
						<button
							type="button"
							onClick={onClose}
							className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
						>
							<IconX className="w-5 h-5 text-neutral-500" />
						</button>
					</div>

					<div className="max-h-[60vh] overflow-y-auto p-4">
						{isLoading ? (
							<div className="text-center py-8 text-neutral-500">Loading...</div>
						) : students.length > 0 ? (
							<div className="space-y-3">
								{students.map((student) => (
									<div
										key={student.id}
										className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
									>
										<div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
											{student.name.charAt(0)}
										</div>
										<div>
											<p className="font-bold text-neutral-900 dark:text-white text-sm">
												{student.name}
											</p>
											<div className="flex items-center gap-1.5 text-xs text-neutral-500">
												<IconPhone className="w-3 h-3" />
												<span>{student.phone}</span>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-neutral-500">No students found.</div>
						)}
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};
