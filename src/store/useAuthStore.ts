import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthUser, UserRole } from "@/types/auth";

interface AuthState {
	user: AuthUser["user"] | null;
	token: string | null;
	role: UserRole | null;
	isAuthenticated: boolean;

	// Actions
	login: (token: string, role: UserRole, user: AuthUser["user"]) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			role: null,
			isAuthenticated: false,

			login: (token, role, user) =>
				set({
					token,
					role,
					user,
					isAuthenticated: true,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
					role: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: "auth-storage", // key in session storage
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
