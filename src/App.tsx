import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { ROUTES } from "@/constants";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Login from "@/pages/shared/Login";
import SubadminDashboard from "@/pages/subadmin/SubadminDashboard";

const AppContent = () => {
	useAutoLogout();

	return (
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
		</Routes>
	);
};

const App = () => {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
};

export default App;
