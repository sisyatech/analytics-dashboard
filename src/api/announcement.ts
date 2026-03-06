import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
	CreateAnnouncementPayload,
	CreateAnnouncementResponse,
	GetAnnouncementsResponse,
} from "@/types/announcement";

export const createAnnouncement = async (
	payload: CreateAnnouncementPayload,
): Promise<CreateAnnouncementResponse> => {
	const response = await axiosInstance.post<CreateAnnouncementResponse>(
		API_ENDPOINTS.CREATE_ANNOUNCEMENT,
		payload,
	);
	return response.data;
};

export const getAnnouncements = async (page = 1, limit = 10): Promise<GetAnnouncementsResponse> => {
	const response = await axiosInstance.post<GetAnnouncementsResponse>(
		API_ENDPOINTS.GET_ALL_ANNOUNCEMENTS,
		{ page, limit },
	);
	return response.data;
};
