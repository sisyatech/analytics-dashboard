import * as Icons from "@tabler/icons-react";
import { ROUTES } from "@/constants/index";
import type { SidebarNavItem } from "@/types/sidebar";

export const sidebarConfig: SidebarNavItem[] = [
	{
		label: "Dashboard",
		icon: Icons.IconLayoutDashboard,
		roles: ["admin", "subadmin"],
		path: ROUTES.ADMIN_DASHBOARD, // Will be handled dynamically in filtering
	},
	{
		label: "AI",
		icon: Icons.IconRobot,
		roles: ["admin", "subadmin"],
		permissionKey: "ai_access", // Example permission key
		expandable: true,
		subItems: [
			{
				label: "AI Doubt Detail",
				path: ROUTES.ADMIN_AI_DOUBT_DETAIL,
				permissionKey: "ai_doubt_detail",
			},
			{ label: "AI Review", path: ROUTES.ADMIN_AI_REVIEW, permissionKey: "ai_review" },
		],
	},
	{
		label: "Doubts",
		icon: Icons.IconMessageCircle,
		roles: ["admin", "subadmin"],
		permissionKey: "doubts_access",
		path: ROUTES.ADMIN_DOUBTS,
	},
	{
		label: "Users",
		icon: Icons.IconUsers,
		roles: ["admin"],
		path: "/admin/users",
	},
	{
		label: "Settings",
		icon: Icons.IconSettings,
		roles: ["admin", "subadmin"],
		path: "/settings",
	},
	{
		label: "Logout",
		icon: Icons.IconArrowLeft,
		roles: ["admin", "subadmin"],
		path: ROUTES.LOGIN,
	},
];
