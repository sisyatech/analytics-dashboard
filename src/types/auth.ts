export type UserRole = "admin" | "subadmin";

export interface AuthUser {
	token: string;
	role: UserRole;
	user: {
		id: string;
		name: string;
		email?: string;
	};
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
}

export interface LoginCredentials {
	userId: string;
	password: string;
}
