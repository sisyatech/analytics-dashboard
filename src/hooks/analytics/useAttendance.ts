import { useQuery } from "@tanstack/react-query";
import { getCompletedSessions, getCoursesByGrade, getSessionAttendance } from "@/api/attendance";

export const useCoursesByGrade = (grade: string | null) => {
	return useQuery({
		queryKey: ["courses", grade],
		queryFn: ({ queryKey }) => {
			const [, selectedGrade] = queryKey as ["courses", string];
			return getCoursesByGrade(selectedGrade);
		},
		enabled: grade !== null,
		staleTime: 1000 * 60 * 10,
	});
};

export const useSessionsByCourse = (courseId: number | null, page = 1) => {
	return useQuery({
		queryKey: ["sessions", courseId, page],
		queryFn: ({ queryKey }) => {
			const [, id, currentPage] = queryKey as ["sessions", number, number];
			return getCompletedSessions(id, currentPage);
		},
		enabled: courseId !== null,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useSessionAttendance = (sessionId: number | null) => {
	return useQuery({
		queryKey: ["attendance", sessionId],
		queryFn: ({ queryKey }) => {
			const [, id] = queryKey as ["attendance", number];
			return getSessionAttendance(id);
		},
		enabled: sessionId !== null,
		staleTime: 1000 * 60 * 2, // 2 minutes
	});
};
