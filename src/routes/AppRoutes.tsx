import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { ROUTES } from "@/constants";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AIDoubtDetail from "@/pages/admin/AI/AIDoubtDetail";
import AIReview from "@/pages/admin/AI/AIReview";

import AttendancePage from "@/pages/admin/Attendance";
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

				{/* Protected Routes with Centralized Layout */}
				<Route element={<DashboardLayout />}>
					<Route
						path={ROUTES.ADMIN_DASHBOARD}
						element={
							<ProtectedRoute roles={["admin"]}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path={ROUTES.SUBADMIN_DASHBOARD}
						element={
							<ProtectedRoute roles={["subadmin"]}>
								<SubadminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path={ROUTES.ATTENDANCE}
						element={
							<ProtectedRoute roles={["admin", "subadmin"]} permissionKey="attendance_access">
								<AttendancePage />
							</ProtectedRoute>
						}
					/>

					<Route
						path={ROUTES.ADMIN_AI_DOUBT_DETAIL}
						element={
							<ProtectedRoute roles={["admin", "subadmin"]} permissionKey="ai_doubt_detail">
								<AIDoubtDetail />
							</ProtectedRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_AI_REVIEW}
						element={
							<ProtectedRoute roles={["admin", "subadmin"]} permissionKey="ai_review">
								<AIReview />
							</ProtectedRoute>
						}
					/>
				</Route>

				{/* 404 Route */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</ErrorBoundary>
	);
};

export default AppRoutes;
