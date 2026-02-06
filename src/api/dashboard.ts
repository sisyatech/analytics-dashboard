import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
	AssessmentCompletionResponse,
	CoursePerformanceResponse,
	DashboardOverviewResponse,
	DoubtTrendResponse,
	EnrollmentTrendResponse,
	MentorPerformanceResponse,
	RatingsDistributionResponse,
	SessionTrendResponse,
} from "@/types/dashboard";

export const getDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
	const { data } = await axiosInstance.post<DashboardOverviewResponse>(
		API_ENDPOINTS.DASHBOARD_OVERVIEW,
	);
	return data;
};

export const getEnrollmentTrends = async (): Promise<EnrollmentTrendResponse> => {
	const { data } = await axiosInstance.post<EnrollmentTrendResponse>(
		API_ENDPOINTS.DASHBOARD_TRENDS_ENROLLMENT,
	);
	return data;
};

export const getSessionTrends = async (): Promise<SessionTrendResponse> => {
	const { data } = await axiosInstance.post<SessionTrendResponse>(
		API_ENDPOINTS.DASHBOARD_TRENDS_SESSIONS,
	);
	return data;
};

export const getCoursePerformance = async (): Promise<CoursePerformanceResponse> => {
	const { data } = await axiosInstance.post<CoursePerformanceResponse>(
		API_ENDPOINTS.DASHBOARD_PERFORMANCE_COURSES,
	);
	return data;
};

export const getAssessmentStats = async (): Promise<AssessmentCompletionResponse> => {
	const { data } = await axiosInstance.post<AssessmentCompletionResponse>(
		API_ENDPOINTS.DASHBOARD_ASSESSMENT_COMPLETION,
	);
	return data;
};

export const getMentorPerformance = async (): Promise<MentorPerformanceResponse> => {
	const { data } = await axiosInstance.post<MentorPerformanceResponse>(
		API_ENDPOINTS.DASHBOARD_PERFORMANCE_MENTORS,
	);
	return data;
};

export const getDoubtTrends = async (): Promise<DoubtTrendResponse> => {
	const { data } = await axiosInstance.post<DoubtTrendResponse>(
		API_ENDPOINTS.DASHBOARD_TRENDS_DOUBTS,
	);
	return data;
};

export const getRatingsDistribution = async (): Promise<RatingsDistributionResponse> => {
	const { data } = await axiosInstance.post<RatingsDistributionResponse>(
		API_ENDPOINTS.DASHBOARD_RATINGS_DISTRIBUTION,
	);
	return data;
};
