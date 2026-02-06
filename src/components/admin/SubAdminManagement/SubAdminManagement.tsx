import { IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import { useSubAdmins } from "@/hooks/admin/useSubAdmin";
import type { SubAdmin } from "@/types/subadmin";
import { SubAdminPermissionDialog } from "./SubAdminPermissionDialog";

export function SubAdminManagement() {
	const { data, isLoading, error } = useSubAdmins();
	const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-lg text-neutral-600 dark:text-neutral-400">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-lg text-red-600 dark:text-red-400">
					Error loading SubAdmins: {error.message}
				</div>
			</div>
		);
	}

	const subAdmins = data?.subAdmins || [];

	return (
		<div className="flex h-full flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-neutral-900 dark:text-white">SubAdmin Management</h1>
				<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
					Manage analytics permissions for SubAdmins
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{subAdmins.map((subAdmin) => {
					const analyticsPermissionCount = Object.values(
						subAdmin.analyticsPermissions || {},
					).filter(Boolean).length;

					return (
						<button
							key={subAdmin.id}
							type="button"
							onClick={() => setSelectedSubAdmin(subAdmin)}
							className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-left transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
						>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
										<IconUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<h3 className="font-semibold text-neutral-900 dark:text-white">
											{subAdmin.name}
										</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{subAdmin.email}
										</p>
									</div>
								</div>
								<div
									className={`rounded-full px-2 py-1 text-xs font-medium ${
										subAdmin.isActive
											? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
											: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
									}`}
								>
									{subAdmin.isActive ? "Active" : "Inactive"}
								</div>
							</div>

							<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
								<span className="font-medium">Analytics Permissions:</span>
								<span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
									{analyticsPermissionCount}
								</span>
							</div>
						</button>
					);
				})}
			</div>

			{subAdmins.length === 0 && (
				<div className="flex h-64 items-center justify-center">
					<p className="text-neutral-600 dark:text-neutral-400">No SubAdmins found</p>
				</div>
			)}

			{selectedSubAdmin && (
				<SubAdminPermissionDialog
					subAdmin={selectedSubAdmin}
					onClose={() => setSelectedSubAdmin(null)}
				/>
			)}
		</div>
	);
}
