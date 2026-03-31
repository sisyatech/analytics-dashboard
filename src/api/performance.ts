import { axiosInstance } from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
	AttendanceDetailsResponse,
	CoinsTransactionsResponse,
	CourseSessionsResponse,
	HomeworkDetailsResponse,
	MentorDoubtDetailsResponse,
	MentorReviewDetailsResponse,
	MentorSessionsResponse,
	MentorSummaryResponse,
	MentorsResponse,
	PerformanceSummaryResponse,
	QuizDetailsResponse,
	StudentsResponse,
	TestDetailsResponse,
} from "@/types/performance";
import type { ReviewDetailsResponse } from "@/types/reviews";

export const getCoursePerformanceSessions = async (
	courseId: number,
): Promise<CourseSessionsResponse> => {
	const { data } = await axiosInstance.post<CourseSessionsResponse>(
		API_ENDPOINTS.GET_COURSE_PERFORMANCE_SESSIONS,
		{ bigCourseId: courseId },
	);
	return data;
};

export const getStudentsByCourse = async (bigCourseId: number): Promise<StudentsResponse> => {
	const { data } = await axiosInstance.post<StudentsResponse>(
		API_ENDPOINTS.GET_STUDENTS_BY_COURSE,
		{ bigCourseId },
	);
	return data;
};

export const getPerformanceSummary = async (
	endUsersId: number,
	bigCourseId: number,
): Promise<PerformanceSummaryResponse> => {
	const { data } = await axiosInstance.post<PerformanceSummaryResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_SUMMARY,
		{ endUsersId, bigCourseId },
	);
	return data;
};

export const getPerformanceAttendance = async (
	endUsersId: number,
	bigCourseId: number,
): Promise<AttendanceDetailsResponse> => {
	const { data } = await axiosInstance.post<AttendanceDetailsResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_ATTENDANCE,
		{ endUsersId, bigCourseId },
	);
	return data;
};

export const getPerformanceQuizzes = async (
	endUsersId: number,
	bigCourseId: number,
): Promise<QuizDetailsResponse> => {
	const { data } = await axiosInstance.post<QuizDetailsResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_QUIZZES,
		{ endUsersId, bigCourseId },
	);
	return data;
};

export const getPerformanceTests = async (
	endUsersId: number,
	bigCourseId: number,
): Promise<TestDetailsResponse> => {
	const { data } = await axiosInstance.post<TestDetailsResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_TESTS,
		{ endUsersId, bigCourseId },
	);
	return data;
};

export const getPerformanceHomework = async (
	endUsersId: number,
	bigCourseId: number,
): Promise<{
	success: boolean;
	homeworkDetails: import("@/types/performance").HomeworkDetail[];
}> => {
	const { data } = await axiosInstance.post<HomeworkDetailsResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_HOMEWORK,
		{ endUsersId, bigCourseId },
	);

	// Transform API data to UI model
	const transformedDetails: import("@/types/performance").HomeworkDetail[] =
		data.homeworkDetails.map((item) => {
			let status: "PENDING" | "SUBMITTED" | "LATE" | "MISSED" = "PENDING";

			if (item.isAttempted) {
				status = "SUBMITTED";
				// Logic for LATE could be added if due date is available, but currently it is not.
			} else {
				// Logic for MISSED could be based on date comparison, e.g., if sessionDate is older than 2 weeks
				const twoWeeksAgo = new Date();
				twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
				if (new Date(item.sessionDate) < twoWeeksAgo) {
					status = "MISSED";
				}
			}

			return {
				homeworkId: item.homeworkId,
				title: item.sessionName,
				description: "", // Not provided by API
				assignedDate: item.sessionDate,
				dueDate: null, // Not provided by API
				isSubmitted: item.isAttempted,
				submittedAt: item.submittedAt,
				totalQuestions: item.maxMarks, // Assuming max marks ~ total questions for now
				correctAnswers: item.marks, // Assuming marks ~ correct answers
				score: item.maxMarks > 0 ? Math.round((item.marks / item.maxMarks) * 100) : 0,
				status: status,
			};
		});

	return {
		success: data.success,
		homeworkDetails: transformedDetails,
	};
};

export const getPerformanceCoins = async (
	endUsersId: number,
): Promise<CoinsTransactionsResponse> => {
	const { data } = await axiosInstance.post<CoinsTransactionsResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_COINS,
		{ endUsersId },
	);
	return data;
};

export const getPerformanceReviews = async (
	endUsersId: number,
	bigCourseId: number,
): Promise<ReviewDetailsResponse> => {
	const { data } = await axiosInstance.post<ReviewDetailsResponse>(
		API_ENDPOINTS.GET_PERFORMANCE_REVIEWS,
		{ endUsersId, bigCourseId },
	);
	return data;
};

// Mentor API Functions
export const getActiveMentors = async (): Promise<MentorsResponse> => {
	const { data } = await axiosInstance.post<MentorsResponse>(API_ENDPOINTS.GET_ACTIVE_MENTORS);
	return data;
};

export const getMentorPerformanceSummary = async (
	mentorId: number,
): Promise<MentorSummaryResponse> => {
	const { data } = await axiosInstance.post<MentorSummaryResponse>(
		API_ENDPOINTS.GET_MENTOR_PERFORMANCE_SUMMARY,
		{ mentorId },
	);
	return data;
};

export const getMentorPerformanceReviews = async (
	mentorId: number,
): Promise<MentorReviewDetailsResponse> => {
	const { data } = await axiosInstance.post<MentorReviewDetailsResponse>(
		API_ENDPOINTS.GET_MENTOR_PERFORMANCE_REVIEWS,
		{ mentorId },
	);
	return data;
};

export const getMentorPerformanceDoubts = async (
	mentorId: number,
): Promise<MentorDoubtDetailsResponse> => {
	const { data } = await axiosInstance.post<MentorDoubtDetailsResponse>(
		API_ENDPOINTS.GET_MENTOR_PERFORMANCE_DOUBTS,
		{ mentorId },
	);
	return data;
};

export const getMentorPerformanceSessions = async (
	mentorId: number,
): Promise<MentorSessionsResponse> => {
	const { data } = await axiosInstance.post<MentorSessionsResponse>(
		API_ENDPOINTS.GET_SESSIONS_BY_MENTOR,
		{ mentorId },
	);
	return data;
};

export const getPresentStudents = async (
	sessionId: number,
): Promise<import("@/types/performance").PresentStudentsResponse> => {
	const { data } = await axiosInstance.post<import("@/types/performance").PresentStudentsResponse>(
		API_ENDPOINTS.GET_PRESENT_STUDENTS,
		{ sessionId },
	);
	return data;
};

export const getSessionReviews = async (
	sessionId: number,
): Promise<import("@/types/performance").SessionReviewsResponse> => {
	const { data } = await axiosInstance.post<import("@/types/performance").SessionReviewsResponse>(
		API_ENDPOINTS.GET_SESSION_REVIEWS,
		{ sessionId },
	);
	return data;
};

export const getMentorRewardTransactions = async (
	mentorId: number,
	skip = 0,
	take = 50,
): Promise<import("@/types/performance").MentorRewardTransactionsResponse> => {
	const { data } = await axiosInstance.post<
		import("@/types/performance").MentorRewardTransactionsResponse
	>(API_ENDPOINTS.GET_MENTOR_REWARD_TRANSACTIONS, { mentorId, skip, take });
	return data;
};

export const allocateRewardBudget = async (
	toOwnerId: number,
	amount: number,
): Promise<{ success: boolean; message?: string }> => {
	const { data } = await axiosInstance.post<{ success: boolean; message?: string }>(
		API_ENDPOINTS.ALLOCATE_REWARD_BUDGET,
		{
			toOwnerType: "MENTOR",
			adminId: 1,
			toOwnerId,
			amount,
		},
	);
	return data;
};
