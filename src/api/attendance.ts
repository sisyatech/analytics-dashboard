import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
	CoursesResponse,
	PaginatedSessionsResponse,
	SessionAttendanceResponse,
} from "@/types/analytics";

export const getCoursesByGrade = async (grade: string): Promise<CoursesResponse> => {
	const response = await axiosInstance.post<CoursesResponse>(API_ENDPOINTS.GET_COURSES_BY_GRADE, {
		grade,
	});
	return response.data;
};

export const getCompletedSessions = async (
	courseId: number,
	page = 1,
	limit = 20,
): Promise<PaginatedSessionsResponse> => {
	const response = await axiosInstance.post<PaginatedSessionsResponse>(
		API_ENDPOINTS.GET_COMPLETED_SESSIONS,
		{ id: courseId, page, limit },
	);
	return response.data;
};

export const getSessionAttendance = async (
	sessionId: number,
): Promise<SessionAttendanceResponse> => {
	const response = await axiosInstance.post<SessionAttendanceResponse>(
		API_ENDPOINTS.GET_SESSION_ATTENDANCE,
		{ sessionId },
	);
	return response.data;
};
