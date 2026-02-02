import { useQuery } from "@tanstack/react-query";
import {
	getPerformanceAttendance,
	getPerformanceCoins,
	getPerformanceHomework,
	getPerformanceQuizzes,
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
