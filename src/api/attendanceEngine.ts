import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";

export interface AttendanceEngineReportRequest {
	courseIds: number[];
}

export interface AttendanceEngineSheet {
	courseId: number;
	name: string;
	sessions: { id: number; date: string }[];
	students: {
		id: number;
		name: string;
		phone: string;
		onboarding: {
			done: boolean;
			date: string | null;
			status: string;
			remarks: string;
		};
		subscription: {
			isFullCourse: boolean;
			isLimitedAccess: boolean;
			bundleName: string | null;
		} | null;
		sessions: {
			sessionId: number;
			date: string;
			topic: string;
			att: string;
			time: number;
			hw: string;
			teacherRemarks: string;
			connectRemarks: string;
			lastUpdatedBy: string;
		}[];
	}[];
}

export interface AttendanceEngineReportResponse {
	success: boolean;
	sheets: AttendanceEngineSheet[];
}

export const getAttendanceEngineReport = async (
	courseIds: number[],
): Promise<AttendanceEngineReportResponse> => {
	const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE_ENGINE_REPORT, { courseIds });
	return response.data;
};

export const updateAttendanceRemarks = async (payload: {
	studentId: number;
	sessionId: number;
	bigCourseId: number;
	teacherRemarks?: string;
	connectRemarks?: string;
}) => {
	const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE_ENGINE_REMARKS, payload);
	return response.data;
};

export const updateStudentOnboarding = async (payload: {
	studentId: number;
	bigCourseId: number;
	onboardingDone: boolean;
	remarks?: string;
}) => {
	const response = await axiosInstance.post(API_ENDPOINTS.STUDENT_ONBOARDING, payload);
	return response.data;
};

export const addEngagementLog = async (payload: {
	studentId: number;
	bigCourseId: number;
	type: string;
	remarks: string;
}) => {
	const response = await axiosInstance.post(API_ENDPOINTS.LOG_TOUCHPOINT, payload);
	return response.data;
};

export interface EngagementLog {
	id: number;
	type: string;
	remarks: string;
	createdAt: string;
	createdBy: string;
}

export interface EngagementLogsResponse {
	success: boolean;
	logs: EngagementLog[];
}

export const syncAttendance = async (payload: { courseId?: number; sessionId?: number }) => {
	const response = await axiosInstance.post(API_ENDPOINTS.ATTENDANCE_ENGINE_SYNC, payload);
	return response.data;
};

export const getEngagementLogs = async (
	studentId: number,
	bigCourseId?: number,
): Promise<EngagementLogsResponse> => {
	const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ENGAGEMENT_LOGS}/${studentId}`, {
		params: { bigCourseId },
	});
	return response.data;
};
