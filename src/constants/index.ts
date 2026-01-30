export const APP_NAME = "SISYA Analytics";

export const ROUTES = {
	LOGIN: "/login",
	ADMIN_DASHBOARD: "/admin",
	SUBADMIN_DASHBOARD: "/subadmin",
	ATTENDANCE: "/attendance",
	ADMIN_AI_DOUBT_DETAIL: "/admin/ai/doubt-detail",
	ADMIN_AI_REVIEW: "/admin/ai/review",
	ADMIN_DOUBTS: "/admin/doubts",
	USERS: "/admin/users",
	SETTINGS: "/settings",
} as const;

export const API_BASE_URL = "https://sisyaclass.xyz";

export const API_ENDPOINTS = {
	ADMIN_LOGIN: "/rkadmin/login",
	SUBADMIN_LOGIN: "/rkadmin/subadmin_login",
} as const;
