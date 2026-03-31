export interface SubAdmin {
	id: string;
	name: string;
	email: string;
	role: "subadmin";
	permissions: Record<string, boolean>;
	analyticsPermissions: Record<string, boolean>;
	gradePermissions: number[];
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface GetAllSubAdminsResponse {
	success: boolean;
	subAdmins: SubAdmin[];
}

export interface UpdateSubAdminPayload {
	id: string;
	name?: string;
	email?: string;
	permissions?: Record<string, boolean>;
	analyticsPermissions?: Record<string, boolean>;
	gradePermissions?: number[];
}

export interface UpdateSubAdminResponse {
	success: boolean;
	message: string;
	subAdmin: SubAdmin;
}
