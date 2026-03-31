import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthUser, UserRole } from "@/types/auth";

interface AuthState {
	user: AuthUser["user"] | null;
	token: string | null;
	role: UserRole | null;
	analyticsPermissions: Record<string, boolean> | null;
	gradePermissions: number[] | null;
	isAuthenticated: boolean;

	// Actions
	login: (
		token: string,
		role: UserRole,
		user: AuthUser["user"],
		analyticsPermissions?: Record<string, boolean>,
		gradePermissions?: number[],
	) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			role: null,
			analyticsPermissions: null,
			gradePermissions: null,
			isAuthenticated: false,

			login: (token, role, user, analyticsPermissions, gradePermissions) =>
				set({
					token,
					role,
					user,
					analyticsPermissions: analyticsPermissions || null,
					gradePermissions: gradePermissions || null,
					isAuthenticated: true,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
					role: null,
					analyticsPermissions: null,
					gradePermissions: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: "auth-storage", // key in session storage
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
