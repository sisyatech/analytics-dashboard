import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginAdmin, loginSubadmin } from "@/api/auth";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginCredentials } from "@/types/auth";

export const useAdminLogin = () => {
	const navigate = useNavigate();
	const { login } = useAuthStore();

	return useMutation({
		mutationFn: ({ userId, password }: LoginCredentials) => loginAdmin(userId, password),
		onSuccess: (data, variables) => {
			if (data.success && data.token) {
				// API only returns token, so we construct the user from the input ID
				const adminUser = data.admin ||
					data.user || {
						id: variables.userId,
						name: variables.userId,
						email: "",
					};
				login(data.token, "admin", adminUser);
				navigate(ROUTES.ADMIN_DASHBOARD);
			}
		},
	});
};

export const useSubadminLogin = () => {
	const navigate = useNavigate();
	const { login } = useAuthStore();

	return useMutation({
		mutationFn: ({ userId, password }: LoginCredentials) => loginSubadmin(userId, password),
		onSuccess: (data) => {
			if (data.token && data.subAdmin) {
				const user = {
					id: data.subAdmin.id,
					name: data.subAdmin.name,
					email: data.subAdmin.email,
				};
				login(data.token, "subadmin", user, data.subAdmin.analyticsPermissions);
				navigate(ROUTES.SUBADMIN_DASHBOARD);
			}
		},
	});
};
