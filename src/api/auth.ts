import { API_ENDPOINTS } from "@/constants";
import type { LoginResponse } from "@/types/auth";
import { axiosInstance } from "@/api/axiosInstance";

export const loginAdmin = async (userId: string, password: string): Promise<LoginResponse> => {
	const response = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.ADMIN_LOGIN, {
		user: userId,
		password,
	});
	return response.data;
};

export const loginSubadmin = async (email: string, password: string): Promise<LoginResponse> => {
	const response = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.SUBADMIN_LOGIN, {
		email,
		password,
	});
	return response.data;
};
