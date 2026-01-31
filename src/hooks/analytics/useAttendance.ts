import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getCompletedSessions,
	getCoursesByGrade,
	getSessionAttendance,
	markAsSisyaEmp,
} from "@/api/attendance";

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

export const useMarkAsSisyaEmp = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: number) => markAsSisyaEmp(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		},
	});
};
