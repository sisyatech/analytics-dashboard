import type { ElementType, ReactNode } from "react";
import type { UserRole } from "@/types/auth";

export interface SidebarLinkItem {
	label: string;
	href: string;
	icon: ReactNode;
	onClick?: () => void;
}

export type SidebarSubItem = {
	label: string;
	path: string;
	roles?: UserRole[];
	permissionKey?: string;
};

export type SidebarNavItem = {
	label: string;
	icon: ElementType;
	roles: UserRole[];
	permissionKey?: string;
	expandable?: boolean;
	path?: string;
	subItems?: SidebarSubItem[];
	onClick?: () => void;
};

export type SidebarItemMapped = Omit<SidebarNavItem, "icon"> & SidebarLinkItem;
