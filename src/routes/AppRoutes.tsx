import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { ROUTES } from "@/constants";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Login from "@/pages/shared/Login";
import NotFound from "@/pages/shared/NotFound";
import SubadminDashboard from "@/pages/subadmin/SubadminDashboard";

const AppRoutes = () => {
	useAutoLogout();

	return (
		<ErrorBoundary>
			<Routes>
				<Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
				<Route path={ROUTES.LOGIN} element={<Login />} />

				{/* Protected Routes */}
				<Route
					path={ROUTES.ADMIN_DASHBOARD}
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path={ROUTES.SUBADMIN_DASHBOARD}
					element={
						<ProtectedRoute allowedRoles={["subadmin"]}>
							<SubadminDashboard />
						</ProtectedRoute>
					}
				/>

				{/* 404 Route */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ErrorBoundary>
	);
};

export default AppRoutes;
