import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4">
			<div className="max-w-2xl w-full text-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-[120px] sm:text-[180px] font-black leading-none bg-linear-to-b from-primary/80 to-primary bg-clip-text text-transparent opacity-20 select-none">
						404
					</h1>

					<div className="relative -mt-16 sm:-mt-24">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Page Not Found
						</h2>
						<p className="text-gray-600 dark:text-neutral-400 text-lg mb-10 max-w-md mx-auto">
							The page you are looking for might have been removed, had its name changed, or is
							temporarily unavailable.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className={cn(
									"flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
									"bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-200 border border-gray-200 dark:border-neutral-800",
									"hover:bg-gray-50 dark:hover:bg-neutral-800 hover:shadow-md active:scale-95",
								)}
							>
								<IconArrowLeft className="w-5 h-5" />
								Go Back
							</button>

							<button
								type="button"
								onClick={() => navigate("/")}
								className={cn(
									"flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
									"bg-primary text-white shadow-lg shadow-primary/20",
									"hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-95",
								)}
							>
								<IconHome className="w-5 h-5" />
								Back to Home
							</button>
						</div>
					</div>
				</motion.div>

				<div className="mt-12 flex flex-col gap-1 italic text-sm text-gray-400 dark:text-neutral-600 select-none">
					<p>"Not all those who wander are lost..."</p>
					<p>"...but you probably are."</p>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
