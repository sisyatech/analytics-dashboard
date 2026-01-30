import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const { open: sidebarOpen } = useSidebar();

	return (
		<button
			className={cn(
				"flex items-center gap-2 px-2 py-2 cursor-pointer transition-colors duration-200 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700",
				!sidebarOpen && "justify-center px-0",
			)}
			type="button"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<div className="relative w-5 h-5 flex items-center justify-center">
				<motion.div
					initial={false}
					animate={{
						scale: theme === "dark" ? 0 : 1,
						rotate: theme === "dark" ? 90 : 0,
						opacity: theme === "dark" ? 0 : 1,
					}}
					transition={{ duration: 0.2 }}
					className="absolute transition-colors duration-200 text-neutral-700 dark:text-neutral-200"
				>
					<IconSun size={20} />
				</motion.div>
				<motion.div
					initial={false}
					animate={{
						scale: theme === "dark" ? 1 : 0,
						rotate: theme === "dark" ? 0 : -90,
						opacity: theme === "dark" ? 1 : 0,
					}}
					transition={{ duration: 0.2 }}
					className="absolute transition-colors duration-200 text-neutral-700 dark:text-neutral-200"
				>
					<IconMoon size={20} />
				</motion.div>
			</div>
			{sidebarOpen && (
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-sm font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap"
				>
					{theme === "dark" ? "Dark Mode" : "Light Mode"}
				</motion.span>
			)}
		</button>
	);
}
