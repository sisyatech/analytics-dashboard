import type { SidebarNavItem } from "@/types/sidebar";
import { ROUTES } from "@/constants/index";

export const sidebarConfig: SidebarNavItem[] = [
    {
        label: "Dashboard",
        icon: "LayoutDashboard",
        roles: ["admin", "subadmin"],
        path: ROUTES.ADMIN_DASHBOARD, // Will be handled dynamically in filtering
    },
    {
        label: "AI",
        icon: "Bot",
        roles: ["admin", "subadmin"],
        permissionKey: "ai_access", // Example permission key
        expandable: true,
        subItems: [
            { label: "AI Doubt Detail", path: ROUTES.ADMIN_AI_DOUBT_DETAIL, permissionKey: "ai_doubt_detail" },
            { label: "AI Review", path: ROUTES.ADMIN_AI_REVIEW, permissionKey: "ai_review" },
        ],
    },
    {
        label: "Doubts",
        icon: "MessageCircle",
        roles: ["admin", "subadmin"],
        permissionKey: "doubts_access",
        path: ROUTES.ADMIN_DOUBTS,
    },
    {
        label: "Users",
        icon: "Users",
        roles: ["admin"],
        path: "/admin/users",
    },
    {
        label: "Settings",
        icon: "Settings",
        roles: ["admin", "subadmin"],
        path: "/settings",
    },
    {
        label: "Logout",
        icon: "LogOut",
        roles: ["admin", "subadmin"],
        path: ROUTES.LOGIN,
    },
];
