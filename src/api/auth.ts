import { API_ENDPOINTS } from "@/constants";
import type { LoginResponse } from "@/types/auth";
import { axiosInstance } from "./axiosInstance";

export const loginAdmin = async (userId: string, password: string): Promise<LoginResponse> => {
	const response = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.ADMIN_LOGIN, {
		user: userId,
		password,
	});
	return response.data;
};

export const loginSubadmin = async (userId: string, password: string): Promise<LoginResponse> => {
	// Mock implementation for Subadmin
	await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

	if (userId === "subadmin" && password === "subadmin123") {
		return {
			success: true,
			token: "mock-subadmin-token",
			user: {
				id: "subadmin-001",
				name: "Test Subadmin",
				email: "subadmin@example.com",
			},
		};
	}

	throw new Error("Invalid subadmin credentials");
};
