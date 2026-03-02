import { useNavigate } from "react-router-dom";
import { sidebarConfig } from "@/constants/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import type { SidebarNavItem } from "@/types/sidebar";

export default function SubadminDashboard() {
	const { analyticsPermissions } = useAuthStore();
	const navigate = useNavigate();

	const dashboardModules = (sidebarConfig as SidebarNavItem[]).flatMap((item) => {
		//found a bug here, the flatMap was missing which caused the subitems to not be rendered in the dashboard
		if (item.label === "Dashboard" || item.label === "Logout") return [];

		// 🔥 FIXED ANNOUNCEMENTS LOGIC
		if (item.subItems) {
			const allowedSubItems = item.subItems.filter((sub) => {
				if (sub.permissionKey) {
					return analyticsPermissions?.[sub.permissionKey];
				}
				return true;
			});

			if (allowedSubItems.length === 0) return [];

			return [
				{
					label: item.label,
					path: allowedSubItems[0].path,
					icon: item.icon,
					roles: item.roles,
				},
			];
		}

		// 🔥 NORMAL MODULES
		if (item.permissionKey) {
			return analyticsPermissions?.[item.permissionKey] ? [item] : [];
		}

		return [];
	});

	const today = new Date();

	return (
		<div className="h-full flex flex-col p-6">
			{/* 🔥 HEADER */}
			<div className="mb-10">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">Subadmin Dashboard</h1>

					<div className="text-4xl font-bold text-black -mt-2">{today.getDate()}</div>
				</div>

				<div className="flex justify-between items-center mt-2">
					<p className="text-gray-500 text-sm">Welcome to the Subadmin Dashboard.</p>

					<div className="text-2xl font-semibold text-black whitespace-nowrap -mt-2">
						{today.toLocaleString("default", {
							month: "long",
							year: "numeric",
						})}
					</div>
				</div>
			</div>

			{/* 🔥 MODULE CARDS */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-10">
				{dashboardModules.map((item) => {
					//found a bug here, the subitems were not being checked for permissions which caused them to be rendered even if the user didn't have access to them
					const Icon = item.icon;

					return (
						<button
							type="button"
							key={item.path}
							onClick={() => item.path && navigate(item.path)}
							className="w-80 h-28 flex items-center gap-5 px-8 rounded-xl border bg-white hover:bg-gray-50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.05] group text-left"
						>
							<div className="p-2 rounded-lg bg-gray-100 group-hover:bg-black transition">
								<Icon className="w-6 h-6 text-black group-hover:text-white" />
							</div>

							<p className="text-lg font-semibold text-gray-800">{item.label}</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}
