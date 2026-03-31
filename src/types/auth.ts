export type UserRole = "admin" | "subadmin";

export interface AuthUser {
	token: string;
	role: UserRole;
	user: {
		id: string;
		uuid: string;
		name: string;
		email?: string;
	};
	analyticsPermissions?: Record<string, boolean>;
	gradePermissions?: number[];
}

export interface AnalyticsPermissions {
	[key: string]: boolean;
}

export interface SubAdminData {
	id: string;
	uuid: string;
	name: string;
	email: string;
	role: UserRole;
	analyticsPermissions: AnalyticsPermissions;
	gradePermissions: number[];
}

export interface LoginResponse {
	success: boolean;
	message?: string;
	token?: string;
	uuid?: string;
	user?: {
		id: string;
		uuid: string;
		name: string;
		email?: string;
	};
	admin?: {
		id: string;
		uuid: string;
		name: string;
		email?: string;
	};
	subAdmin?: SubAdminData;
}

export interface LoginCredentials {
	userId: string;
	password: string;
}
