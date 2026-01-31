import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type { CreateAnnouncementPayload, CreateAnnouncementResponse } from "@/types/announcement";

export const createAnnouncement = async (
	payload: CreateAnnouncementPayload,
): Promise<CreateAnnouncementResponse> => {
	const response = await axiosInstance.post<CreateAnnouncementResponse>(
		API_ENDPOINTS.CREATE_ANNOUNCEMENT,
		payload,
	);
	return response.data;
};
