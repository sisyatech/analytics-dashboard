import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
	CourseHomeworkResponse,
	CourseReviewsResponse,
	CourseSessionsResponse,
	CourseSummaryResponse,
	CourseTestsResponse,
} from "@/types/performance";

export const useCourseSummary = (bigCourseId: number) => {
	return useQuery({
		queryKey: ["coursePerformanceSummary", bigCourseId],
		queryFn: async () => {
			const { data } = await axiosInstance.post<CourseSummaryResponse>(
				API_ENDPOINTS.GET_COURSE_PERFORMANCE_SUMMARY,
				{ bigCourseId },
			);
			return data;
		},
		enabled: !!bigCourseId,
	});
};

export const useCourseSessions = (params: {
	bigCourseId: number;
	mentorId?: number;
	search?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	limit?: number;
}) => {
	return useQuery({
		queryKey: ["coursePerformanceSessions", params],
		queryFn: async () => {
			const { data } = await axiosInstance.post<CourseSessionsResponse>(
				API_ENDPOINTS.GET_COURSE_PERFORMANCE_SESSIONS,
				params,
			);
			return data;
		},
		enabled: !!params.bigCourseId,
	});
};

export const useInfiniteCourseSessions = (params: {
	bigCourseId: number;
	mentorId?: number;
	search?: string;
	startDate?: string;
	endDate?: string;
	limit?: number;
}) => {
	return useInfiniteQuery({
		queryKey: ["coursePerformanceSessionsInfinite", params],
		queryFn: async ({ pageParam = 1 }) => {
			const { data } = await axiosInstance.post<CourseSessionsResponse>(
				API_ENDPOINTS.GET_COURSE_PERFORMANCE_SESSIONS,
				{ ...params, page: pageParam, limit: params.limit || 21 },
			);
			return data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.sessions.length < (params.limit || 21)) return undefined;
			return lastPage.page + 1;
		},
		enabled: !!params.bigCourseId,
	});
};

export const useCourseHomework = (bigCourseId: number) => {
	return useQuery({
		queryKey: ["coursePerformanceHomework", bigCourseId],
		queryFn: async () => {
			const { data } = await axiosInstance.post<CourseHomeworkResponse>(
				API_ENDPOINTS.GET_COURSE_PERFORMANCE_HOMEWORK,
				{ bigCourseId },
			);
			return data;
		},
		enabled: !!bigCourseId,
	});
};

export const useCourseReviews = (bigCourseId: number) => {
	return useQuery({
		queryKey: ["coursePerformanceReviews", bigCourseId],
		queryFn: async () => {
			const { data } = await axiosInstance.post<CourseReviewsResponse>(
				API_ENDPOINTS.GET_COURSE_PERFORMANCE_REVIEWS,
				{ bigCourseId },
			);
			return data;
		},
		enabled: !!bigCourseId,
	});
};

export const useCourseTests = (bigCourseId: number) => {
	return useQuery({
		queryKey: ["coursePerformanceTests", bigCourseId],
		queryFn: async () => {
			const { data } = await axiosInstance.post<CourseTestsResponse>(
				API_ENDPOINTS.GET_COURSE_PERFORMANCE_TESTS,
				{ bigCourseId },
			);
			return data;
		},
		enabled: !!bigCourseId,
	});
};
