import { useQuery } from "@tanstack/react-query";
import {
	getActiveMentors,
	getMentorPerformanceDoubts,
	getMentorPerformanceReviews,
	getMentorPerformanceSummary,
	getPerformanceAttendance,
	getPerformanceCoins,
	getPerformanceHomework,
	getPerformanceQuizzes,
	getPerformanceReviews,
	getPerformanceSummary,
	getPerformanceTests,
	getStudentsByCourse,
} from "@/api/performance";

export const useStudentsByCourse = (courseId: number | null) => {
	return useQuery({
		queryKey: ["students", courseId],
		queryFn: () => {
			if (!courseId) {
				throw new Error("courseId is required");
			}
			return getStudentsByCourse(courseId);
		},
		enabled: Boolean(courseId),
	});
};

export const usePerformanceSummary = (studentId: number | null, courseId: number | null) => {
	return useQuery({
		queryKey: ["performance-summary", studentId, courseId],
		queryFn: () => {
			if (!studentId || !courseId) {
				throw new Error("studentId and courseId are required");
			}
			return getPerformanceSummary(studentId, courseId);
		},
		enabled: Boolean(studentId && courseId),
	});
};

export const usePerformanceAttendance = (studentId: number | null, courseId: number | null) => {
	return useQuery({
		queryKey: ["performance-attendance", studentId, courseId],
		queryFn: () => {
			if (!studentId || !courseId) {
				throw new Error("studentId and courseId are required");
			}
			return getPerformanceAttendance(studentId, courseId);
		},
		enabled: Boolean(studentId && courseId),
	});
};

export const usePerformanceQuizzes = (studentId: number | null, courseId: number | null) => {
	return useQuery({
		queryKey: ["performance-quizzes", studentId, courseId],
		queryFn: () => {
			if (!studentId || !courseId) {
				throw new Error("studentId and courseId are required");
			}
			return getPerformanceQuizzes(studentId, courseId);
		},
		enabled: Boolean(studentId && courseId),
	});
};

export const usePerformanceTests = (studentId: number | null, courseId: number | null) => {
	return useQuery({
		queryKey: ["performance-tests", studentId, courseId],
		queryFn: () => {
			if (!studentId || !courseId) {
				throw new Error("studentId and courseId are required");
			}
			return getPerformanceTests(studentId, courseId);
		},
		enabled: Boolean(studentId && courseId),
	});
};

export const usePerformanceHomework = (studentId: number | null, courseId: number | null) => {
	return useQuery({
		queryKey: ["performance-homework", studentId, courseId],
		queryFn: () => {
			if (!studentId || !courseId) {
				throw new Error("studentId and courseId are required");
			}
			return getPerformanceHomework(studentId, courseId);
		},
		enabled: Boolean(studentId && courseId),
	});
};

export const usePerformanceCoins = (studentId: number | null) => {
	return useQuery({
		queryKey: ["performance-coins", studentId],
		queryFn: () => {
			if (!studentId) {
				throw new Error("studentId is required");
			}
			return getPerformanceCoins(studentId);
		},
		enabled: Boolean(studentId),
	});
};

export const usePerformanceReviews = (studentId: number | null, courseId: number | null) => {
	return useQuery({
		queryKey: ["performance-reviews", studentId, courseId],
		queryFn: () => {
			if (!studentId || !courseId) {
				throw new Error("studentId and courseId are required");
			}
			return getPerformanceReviews(studentId, courseId);
		},
		enabled: Boolean(studentId && courseId),
	});
};

export const useActiveMentors = () => {
	return useQuery({
		queryKey: ["active-mentors"],
		queryFn: getActiveMentors,
	});
};

export const useMentorPerformanceSummary = (mentorId: number | null) => {
	return useQuery({
		queryKey: ["mentor-performance-summary", mentorId],
		queryFn: () => {
			if (!mentorId) {
				throw new Error("mentorId is required");
			}
			return getMentorPerformanceSummary(mentorId);
		},
		enabled: Boolean(mentorId),
	});
};

export const useMentorPerformanceReviews = (mentorId: number | null) => {
	return useQuery({
		queryKey: ["mentor-performance-reviews", mentorId],
		queryFn: () => {
			if (!mentorId) {
				throw new Error("mentorId is required");
			}
			return getMentorPerformanceReviews(mentorId);
		},
		enabled: Boolean(mentorId),
	});
};

export const useMentorPerformanceDoubts = (mentorId: number | null) => {
	return useQuery({
		queryKey: ["mentor-performance-doubts", mentorId],
		queryFn: () => {
			if (!mentorId) {
				throw new Error("mentorId is required");
			}
			return getMentorPerformanceDoubts(mentorId);
		},
		enabled: Boolean(mentorId),
	});
};
