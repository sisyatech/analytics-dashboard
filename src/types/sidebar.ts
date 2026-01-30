import type { ReactNode } from "react";
import type { UserRole } from "@/types/auth";

export interface SidebarLinkItem {
	label: string;
	href: string;
	icon: ReactNode;
}

export type SidebarIconName =
	| "Bot"
	| "MessageCircle"
	| "LayoutDashboard"
	| "Settings"
	| "Users"
	| "ChartBar"
	| "LogOut";

export type SidebarSubItem = {
	label: string;
	path: string;
	permissionKey?: string;
};

export type SidebarNavItem = {
	label: string;
	icon: SidebarIconName;
	roles: UserRole[];
	permissionKey?: string;
	expandable?: boolean;
	path?: string;
	subItems?: SidebarSubItem[];
};

export type SidebarItemMapped = Omit<SidebarNavItem, "icon"> & SidebarLinkItem;
