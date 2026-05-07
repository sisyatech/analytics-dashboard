import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addEngagementLog,
	getAttendanceEngineReport,
	getEngagementLogs,
	syncAttendance,
	updateAttendanceRemarks,
	updateStudentOnboarding,
} from "@/api/attendanceEngine";

export const useAttendanceEngineReport = (courseIds: number[]) => {
	return useQuery({
		queryKey: ["attendance-engine-report", courseIds],
		queryFn: () => getAttendanceEngineReport(courseIds),
		enabled: courseIds.length > 0,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useEngagementLogs = (studentId: number | null, bigCourseId?: number) => {
	return useQuery({
		queryKey: ["engagement-logs", studentId, bigCourseId],
		queryFn: () => {
			if (studentId === null) throw new Error("Student ID is required");
			return getEngagementLogs(studentId, bigCourseId);
		},
		enabled: studentId !== null,
	});
};

export const useUpdateAttendanceRemarks = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateAttendanceRemarks,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["attendance-engine-report"] });
		},
	});
};

export const useUpdateStudentOnboarding = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateStudentOnboarding,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["attendance-engine-report"] });
		},
	});
};

export const useAddEngagementLog = () => {
	return useMutation({
		mutationFn: addEngagementLog,
	});
};

export const useSyncAttendance = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: syncAttendance,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["attendance-engine-report"] });
		},
	});
};
