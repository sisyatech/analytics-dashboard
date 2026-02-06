import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { sidebarConfig } from "@/constants/sidebar";
import { useUpdateSubAdmin } from "@/hooks/admin/useSubAdmin";
import type { SubAdmin } from "@/types/subadmin";

interface SubAdminPermissionDialogProps {
	subAdmin: SubAdmin;
	onClose: () => void;
}

export function SubAdminPermissionDialog({ subAdmin, onClose }: SubAdminPermissionDialogProps) {
	const { mutate: updateSubAdmin, isPending } = useUpdateSubAdmin();
	const [permissions, setPermissions] = useState<Record<string, boolean>>({});

	// Extract all unique permission keys from sidebar config
	const analyticsPermissionKeys = Array.from(
		new Set(
			sidebarConfig
				.filter((item) => item.permissionKey)
				.map((item) => item.permissionKey as string),
		),
	);

	// Initialize permissions from subAdmin data
	useEffect(() => {
		setPermissions(subAdmin.analyticsPermissions || {});
	}, [subAdmin]);

	const handleTogglePermission = (key: string) => {
		setPermissions((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleSave = () => {
		updateSubAdmin(
			{
				id: subAdmin.id,
				analyticsPermissions: permissions,
			},
			{
				onSuccess: () => {
					onClose();
				},
			},
		);
	};

	// Get label for permission key from sidebar config
	const getPermissionLabel = (key: string) => {
		const item = sidebarConfig.find((item) => item.permissionKey === key);
		return item?.label || key;
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-full p-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
				>
					<IconX className="h-5 w-5" />
				</button>

				<h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
					Manage Permissions: {subAdmin.name}
				</h2>

				<div className="mb-6">
					<p className="text-sm text-neutral-600 dark:text-neutral-400">{subAdmin.email}</p>
				</div>

				<div className="mb-6 max-h-96 overflow-y-auto">
					<h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
						Analytics Permissions
					</h3>
					<div className="space-y-2">
						{analyticsPermissionKeys.map((key) => (
							<label
								key={key}
								className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
							>
								<input
									type="checkbox"
									checked={!!permissions[key]}
									onChange={() => handleTogglePermission(key)}
									className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700"
								/>
								<span className="text-sm text-neutral-900 dark:text-white">
									{getPermissionLabel(key)}
								</span>
							</label>
						))}
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={isPending}
						className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={isPending}
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						{isPending ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
}
