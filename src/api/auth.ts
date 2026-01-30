import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type { LoginResponse } from "@/types/auth";

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
