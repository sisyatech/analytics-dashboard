import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	allocateRewardBudget,
	getActiveMentors,
	getMentorPerformanceDoubts,
	getMentorPerformanceReviews,
	getMentorPerformanceSessions,
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

export const useMentorPerformanceSessions = (mentorId: number | null) => {
	return useQuery({
		queryKey: ["mentor-performance-sessions", mentorId],
		queryFn: () => {
			if (!mentorId) {
				throw new Error("mentorId is required");
			}
			return getMentorPerformanceSessions(mentorId);
		},
		enabled: Boolean(mentorId),
	});
};

export const useMentorRewardTransactions = (mentorId: number | null) => {
	return useInfiniteQuery({
		queryKey: ["mentor-reward-transactions", mentorId],
		queryFn: ({ pageParam = 0 }) => {
			if (!mentorId) {
				throw new Error("mentorId is required");
			}
			return import("@/api/performance").then((mod) =>
				mod.getMentorRewardTransactions(mentorId, pageParam as number, 50),
			);
		},
		getNextPageParam: (
			lastPage: import("@/types/performance").MentorRewardTransactionsResponse,
			allPages: import("@/types/performance").MentorRewardTransactionsResponse[],
		) => {
			const currentSkip = allPages.length * 50;
			// Check if we have more items to fetch based on spent transactions total
			if (currentSkip < lastPage.data.spent.pagination.total) {
				return currentSkip;
			}
			return undefined;
		},
		initialPageParam: 0,
		enabled: Boolean(mentorId),
	});
};

export const useAllocateRewardBudget = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ mentorId, amount }: { mentorId: number; amount: number }) =>
			allocateRewardBudget(mentorId, amount),
		onMutate: async ({ mentorId, amount }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["mentor-performance-summary", mentorId] });
			await queryClient.cancelQueries({ queryKey: ["mentor-reward-transactions", mentorId] });

			// Snapshot the previous value
			const previousSummary = queryClient.getQueryData<
				import("@/types/performance").MentorSummaryResponse
			>(["mentor-performance-summary", mentorId]);
			// biome-ignore lint/suspicious/noExplicitAny: any used to avoid complex type issues
			const previousTransactions = queryClient.getQueryData<{ pages: any[]; pageParams: any[] }>([
				"mentor-reward-transactions",
				mentorId,
			]);

			// Optimistically update the summary balance
			if (previousSummary) {
				queryClient.setQueryData(["mentor-performance-summary", mentorId], {
					...previousSummary,
					summary: {
						...previousSummary.summary,
						rewardBudget: previousSummary.summary.rewardBudget
							? {
									...previousSummary.summary.rewardBudget,
									balance: Number(previousSummary.summary.rewardBudget.balance || 0) + amount,
								}
							: undefined,
					},
				});
			}

			// Optimistically update the transaction list (received column)
			// Note: This is simplified as it's an infinite query.
			// We append a mock transaction to the first page's received list.
			if (previousTransactions && previousTransactions.pages.length > 0) {
				const newPages = [...previousTransactions.pages];
				const firstPage = { ...newPages[0] };
				const mockTransaction = {
					id: Math.random(), // Temporary ID
					amount: amount.toString(),
					reason: "Budget Top-up (Optimistic)",
					studentName: "-",
					adminName: "Admin",
					createdAt: new Date().toISOString(),
					type: "RECEIVED",
				};

				firstPage.data = {
					...firstPage.data,
					received: {
						...firstPage.data.received,
						data: [mockTransaction, ...firstPage.data.received.data],
						pagination: {
							...firstPage.data.received.pagination,
							total: firstPage.data.received.pagination.total + 1,
						},
					},
				};
				newPages[0] = firstPage;

				queryClient.setQueryData(["mentor-reward-transactions", mentorId], {
					...previousTransactions,
					pages: newPages,
				});
			}

			return { previousSummary, previousTransactions };
		},
		onError: (_err, { mentorId }, context) => {
			if (context?.previousSummary) {
				queryClient.setQueryData(["mentor-performance-summary", mentorId], context.previousSummary);
			}
			if (context?.previousTransactions) {
				queryClient.setQueryData(
					["mentor-reward-transactions", mentorId],
					context.previousTransactions,
				);
			}
		},
		onSettled: (_data, _error, { mentorId }) => {
			queryClient.invalidateQueries({ queryKey: ["mentor-performance-summary", mentorId] });
			queryClient.invalidateQueries({ queryKey: ["mentor-reward-transactions", mentorId] });
		},
	});
};
