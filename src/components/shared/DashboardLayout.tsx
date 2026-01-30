import { IconChevronDown } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { APP_NAME, ROUTES } from "@/constants";
import { sidebarConfig } from "@/constants/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import type { SidebarItemMapped, SidebarSubItem } from "@/types/sidebar";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "../ui/sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
	actor: "admin" | "subadmin";
	userName?: string;
	userAvatar?: string;
}

const NavItem = ({ link }: { link: SidebarItemMapped }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { open: sidebarOpen } = useSidebar();

	if (!link.subItems || link.subItems.length === 0) {
		return <SidebarLink link={link} />;
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <design requirment to expand on hover>
		<div
			className="flex flex-col"
			onMouseEnter={() => sidebarOpen && setIsExpanded(true)}
			onMouseLeave={() => sidebarOpen && setIsExpanded(false)}
		>
			<button
				type="button"
				onClick={() => sidebarOpen && setIsExpanded(!isExpanded)}
				className={cn(
					"flex items-center justify-between gap-2 group/sidebar py-2 px-0 w-full hover:cursor-pointer bg-transparent border-none",
				)}
			>
				<div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
					{link.icon}
					<motion.span
						animate={{
							display: sidebarOpen ? "inline-block" : "none",
							opacity: sidebarOpen ? 1 : 0,
						}}
						className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0! m-0!"
					>
						{link.label}
					</motion.span>
				</div>
				{sidebarOpen && (
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						className="text-neutral-500 dark:text-neutral-400 mr-2"
					>
						<IconChevronDown className="h-4 w-4" />
					</motion.div>
				)}
			</button>

			<AnimatePresence>
				{sidebarOpen && isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="flex flex-col gap-1 pl-7 overflow-hidden"
					>
						{link.subItems.map((sub: SidebarSubItem, idx: number) => (
							<SidebarLink
								// biome-ignore lint/suspicious/noArrayIndexKey: <static the index will not change>
								key={idx}
								link={{
									label: sub.label,
									href: sub.path,
									icon: (
										<div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
									),
								}}
								className="py-1.5 opacity-80 hover:opacity-100"
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export function DashboardLayout({
	children,
	actor,
	userName = "User",
	userAvatar,
}: DashboardLayoutProps) {
	const { analyticsPermissions } = useAuthStore();
	const [open, setOpen] = useState(false);

	// Filtering logic
	const filteredLinks: SidebarItemMapped[] = sidebarConfig
		.filter((item) => {
			// Role check
			if (!item.roles.includes(actor)) return false;

			// Permission check for subadmin
			if (actor === "subadmin" && item.permissionKey) {
				const hasPermission = analyticsPermissions?.[item.permissionKey];
				if (!hasPermission) return false;
			}

			return true;
		})
		.map((item) => {
			// If it's the dashboard link, handle redirect to actor-specific dashboard if path is generic
			let href = item.path || "#";
			if (item.label === "Dashboard") {
				href = actor === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.SUBADMIN_DASHBOARD;
			}

			// Filter sub-items if they exist
			let subItems = item.subItems;
			if (subItems && actor === "subadmin") {
				subItems = subItems.filter((sub) => {
					if (!sub.permissionKey) return true;
					return analyticsPermissions?.[sub.permissionKey];
				});
			}

			const Icon = item.icon;

			return {
				...item,
				href,
				icon: <Icon className="h-5 w-5 shrink-0" />,
				subItems,
			};
		});

	return (
		<div
			className={cn(
				"mx-auto flex h-screen w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-6 flex flex-col gap-2">
							{filteredLinks.map((link, idx) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <array-index-key>
								<NavItem key={idx} link={link} />
							))}
						</div>
					</div>
					<div>
						<SidebarLink
							link={{
								label: userName,
								href: "#",
								icon: userAvatar ? (
									<img
										src={userAvatar}
										className="h-7 w-7 shrink-0 rounded-full"
										width={50}
										height={50}
										alt="Avatar"
									/>
								) : (
									<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-white dark:bg-neutral-200 dark:text-black">
										{userName.charAt(0).toUpperCase()}
									</div>
								),
							}}
						/>
					</div>
				</SidebarBody>
			</Sidebar>
			<Dashboard>{children}</Dashboard>
		</div>
	);
}

const Logo = () => {
	return (
		<a
			href="/"
			className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
		>
			<img src="/logo.svg" alt="Logo" className="h-10 w-10 shrink-0 object-contain" />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="whitespace-pre font-medium text-black dark:text-white"
			>
				{APP_NAME}
			</motion.span>
		</a>
	);
};

const LogoIcon = () => {
	return (
		<a
			href="/"
			className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
		>
			<img src="/logo.svg" alt="Logo" className="h-10 w-10 shrink-0 object-contain" />
		</a>
	);
};

// Dashboard wrapper component for main content
const Dashboard = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-1 overflow-hidden">
			<div className="flex h-full w-full flex-1 flex-col overflow-y-auto rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-8 dark:border-neutral-700 dark:bg-neutral-900">
				{children}
			</div>
		</div>
	);
};
