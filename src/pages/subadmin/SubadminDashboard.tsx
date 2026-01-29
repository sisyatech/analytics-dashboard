import { DashboardLayout } from "@/components/shared/DashboardLayout";

export default function SubadminDashboard() {
	return (
		<DashboardLayout role="subadmin" userName="Subadmin User">
			<div>
				<h1 className="text-2xl font-bold">Subadmin Dashboard</h1>
				<p className="mt-4">Welcome to the Subadmin Dashboard.</p>
			</div>
		</DashboardLayout>
	);
}
