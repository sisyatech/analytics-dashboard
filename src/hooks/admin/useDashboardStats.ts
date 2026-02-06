import { useQuery } from "@tanstack/react-query";
import {
	getAssessmentStats,
	getCoursePerformance,
	getDashboardOverview,
	getDoubtTrends,
	getEnrollmentTrends,
	getMentorPerformance,
	getRatingsDistribution,
	getRecentActivity,
	getSessionTrends,
} from "@/api/dashboard";

export const useDashboardOverview = () => {
	return useQuery({
		queryKey: ["dashboardOverview"],
		queryFn: getDashboardOverview,
		staleTime: 1000 * 60 * 5,
	});
};

export const useEnrollmentTrends = () => {
	return useQuery({
		queryKey: ["dashboardEnrollment"],
		queryFn: getEnrollmentTrends,
		staleTime: 1000 * 60 * 5,
	});
};

export const useSessionTrends = () => {
	return useQuery({
		queryKey: ["dashboardSessions"],
		queryFn: getSessionTrends,
		staleTime: 1000 * 60 * 5,
	});
};

export const useCoursePerformance = () => {
	return useQuery({
		queryKey: ["dashboardCourses"],
		queryFn: getCoursePerformance,
		staleTime: 1000 * 60 * 5,
	});
};

export const useAssessmentStats = () => {
	return useQuery({
		queryKey: ["dashboardAssessment"],
		queryFn: getAssessmentStats,
		staleTime: 1000 * 60 * 5,
	});
};

export const useMentorPerformance = () => {
	return useQuery({
		queryKey: ["dashboardMentors"],
		queryFn: getMentorPerformance,
		staleTime: 1000 * 60 * 5,
	});
};

export const useDoubtTrends = () => {
	return useQuery({
		queryKey: ["dashboardDoubts"],
		queryFn: getDoubtTrends,
		staleTime: 1000 * 60 * 5,
	});
};

export const useRatingsDistribution = () => {
	return useQuery({
		queryKey: ["dashboardRatings"],
		queryFn: getRatingsDistribution,
		staleTime: 1000 * 60 * 5,
	});
};

export const useRecentActivity = () => {
	return useQuery({
		queryKey: ["dashboardActivity"],
		queryFn: getRecentActivity,
		staleTime: 1000 * 60 * 1, // 1 minute stale time for activity
	});
};
