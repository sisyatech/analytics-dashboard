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
			console.log("🔐 [useAdminLogin] Backend data:", data);
			if (data.success && data.token) {
				// Handle Admin Login structure
				const adminUser = {
					id: data.admin?.id || data.user?.id || variables.userId,
					uuid: data.uuid || data.admin?.uuid || data.user?.uuid || variables.userId,
					name: data.admin?.name || data.user?.name || variables.userId,
					email: data.admin?.email || data.user?.email || "",
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
			console.log("🔐 [useSubadminLogin] Backend data:", data);
			if (data.token && data.subAdmin) {
				const user = {
					id: data.subAdmin.id,
					uuid: data.subAdmin.uuid,
					name: data.subAdmin.name,
					email: data.subAdmin.email,
				};
				login(
					data.token,
					"subadmin",
					user,
					data.subAdmin.analyticsPermissions,
					data.subAdmin.gradePermissions,
				);
				navigate(ROUTES.SUBADMIN_DASHBOARD);
			}
		},
	});
};
