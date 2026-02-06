import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
	GetAllSubAdminsResponse,
	UpdateSubAdminPayload,
	UpdateSubAdminResponse,
} from "@/types/subadmin";

export const getAllSubAdmins = async (): Promise<GetAllSubAdminsResponse> => {
	const response = await axiosInstance.post<GetAllSubAdminsResponse>(
		API_ENDPOINTS.GET_ALL_SUBADMINS,
	);
	return response.data;
};

export const updateSubAdmin = async (
	payload: UpdateSubAdminPayload,
): Promise<UpdateSubAdminResponse> => {
	const response = await axiosInstance.post<UpdateSubAdminResponse>(
		API_ENDPOINTS.UPDATE_SUBADMIN,
		payload,
	);
	return response.data;
};
