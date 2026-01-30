import { IconAlertTriangle, IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ErrorPageProps {
	error?: Error;
	resetErrorBoundary?: () => void;
}

const ErrorPage = ({ error, resetErrorBoundary }: ErrorPageProps) => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4">
			<div className="max-w-2xl w-full text-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="mb-8 flex justify-center">
						<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl">
							<IconAlertTriangle className="w-16 h-16 text-red-600 dark:text-red-500" />
						</div>
					</div>

					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
						Something went wrong
					</h1>
					<p className="text-gray-600 dark:text-neutral-400 text-lg mb-8 max-w-md mx-auto">
						An unexpected error has occurred. Our team has been notified and we're working on a fix.
					</p>

					{error && (
						<div className="mb-10 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-left overflow-auto max-h-48">
							<p className="text-xs font-mono text-red-600 dark:text-red-400">{error.message}</p>
						</div>
					)}

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => window.history.back()}
							className={cn(
								"flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
								"bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 border border-gray-200 dark:border-neutral-800",
								"hover:bg-gray-50 dark:hover:bg-neutral-800 hover:shadow-md active:scale-95",
							)}
						>
							<IconArrowLeft className="w-5 h-5" />
							Go Back
						</button>

						{resetErrorBoundary ? (
							<button
								type="button"
								onClick={resetErrorBoundary}
								className={cn(
									"flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
									"bg-primary text-white shadow-lg shadow-primary/20",
									"hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95",
								)}
							>
								<IconRefresh className="w-5 h-5" />
								Try Again
							</button>
						) : (
							<button
								type="button"
								onClick={() => window.location.reload()}
								className={cn(
									"flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
									"bg-primary text-white shadow-lg shadow-primary/20",
									"hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95",
								)}
							>
								<IconRefresh className="w-5 h-5" />
								Reload Page
							</button>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ErrorPage;
