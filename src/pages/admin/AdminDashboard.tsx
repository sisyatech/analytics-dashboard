import { DashboardLayout } from "@/components/shared/DashboardLayout";

export default function AdminDashboard() {
	return (
		<DashboardLayout role="admin" userName="SISYA CLASS">
			<div>
				<h1 className="text-2xl font-bold">Admin Dashboard</h1>
				<p className="mt-4">Welcome to the Admin Dashboard.</p>
			</div>
		</DashboardLayout>
	);
}
