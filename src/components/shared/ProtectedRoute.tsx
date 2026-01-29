import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
	children: ReactNode;
	allowedRoles?: ("admin" | "subadmin")[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
	const { isAuthenticated, role } = useAuthStore();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
	}

	if (allowedRoles && role && !allowedRoles.includes(role)) {
		// Redirect to appropriate dashboard based on actual role
		// or login if role is somehow invalid
		return (
			<Navigate
				to={role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.SUBADMIN_DASHBOARD}
				replace
			/>
		);
	}

	return <>{children}</>;
};
