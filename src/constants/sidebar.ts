import * as Icons from "@tabler/icons-react";
import { ROUTES } from "@/constants/index";
import type { SidebarNavItem } from "@/types/sidebar";

export const sidebarConfig: SidebarNavItem[] = [
	{
		label: "Dashboard",
		icon: Icons.IconLayoutDashboard,
		roles: ["admin"],
		path: ROUTES.ADMIN_DASHBOARD,
	},
	{
		label: "Dashboard",
		icon: Icons.IconLayoutDashboard,
		roles: ["subadmin"],
		path: ROUTES.SUBADMIN_DASHBOARD,
	},
	{
		label: "Attendance",
		icon: Icons.IconListDetails,
		roles: ["admin"],
		permissionKey: "attendance_access",
		path: ROUTES.ATTENDANCE,
	},
	{
		label: "Student Report",
		icon: Icons.IconReportAnalytics,
		roles: ["admin"],
		permissionKey: "student_report_access",
		path: ROUTES.STUDENT_REPORT,
	},
	{
		label: "Teacher Report",
		icon: Icons.IconSchool,
		roles: ["admin"],
		permissionKey: "mentor_report_access",
		path: ROUTES.MENTOR_REPORT,
	},
	{
		label: "AI",
		icon: Icons.IconRobot,
		roles: ["admin"],
		permissionKey: "ai_access",
		expandable: true,
		subItems: [
			{
				label: "AI Doubt Detail",
				path: ROUTES.ADMIN_AI_DOUBT_DETAIL,
				permissionKey: "ai_doubt_detail",
			},
			{
				label: "AI Review",
				path: ROUTES.ADMIN_AI_REVIEW,
				permissionKey: "ai_review",
			},
		],
	},
	{
		label: "Logout",
		icon: Icons.IconArrowLeft,
		roles: ["admin", "subadmin"],
		path: ROUTES.LOGIN,
	},
];
