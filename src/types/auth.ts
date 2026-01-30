export type UserRole = "admin" | "subadmin";

export interface AuthUser {
	token: string;
	role: UserRole;
	user: {
		id: string;
		name: string;
		email?: string;
	};
	analyticsPermissions?: Record<string, any>;
}

export interface AnalyticsPermissions {
	[key: string]: any;
}

export interface SubAdminData {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	analyticsPermissions: AnalyticsPermissions;
}

export interface LoginResponse {
	success: boolean;
	message?: string;
	token?: string;
	user?: {
		id: string;
		name: string;
		email?: string;
	};
	admin?: {
		id: string;
		name: string;
		email?: string;
	};
	subAdmin?: SubAdminData;
}

export interface LoginCredentials {
	userId: string;
	password: string;
}
