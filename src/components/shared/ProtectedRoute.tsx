import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
	children: ReactNode;
	roles?: ("admin" | "subadmin")[];
	permissionKey?: string;
}

export const ProtectedRoute = ({ children, roles, permissionKey }: ProtectedRouteProps) => {
	const { isAuthenticated, role, analyticsPermissions } = useAuthStore();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
	}

	// Dynamic Permission check for subadmins
	if (role === "subadmin" && permissionKey) {
		const hasPermission = analyticsPermissions?.[permissionKey];
		if (!hasPermission) {
			return <Navigate to={ROUTES.SUBADMIN_DASHBOARD} replace />;
		}
		return <>{children}</>;
	}

	if (roles && role && !roles.includes(role)) {
		// Redirect to appropriate dashboard based on actual role
		return (
			<Navigate
				to={role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.SUBADMIN_DASHBOARD}
				replace
			/>
		);
	}

	return <>{children}</>;
};
