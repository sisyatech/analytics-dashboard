import { useQuery } from "@tanstack/react-query";
import { getOngoingSessionsByCourse } from "@/api/attendance";
import { getActiveMentors, getMentorPerformanceSessions } from "@/api/performance";
import type { MentorSession } from "@/types/performance";

export interface OngoingSession extends MentorSession {
	mentorName: string;
	mentorId: number;
}

export const useOngoingSessions = () => {
	return useQuery({
		queryKey: ["ongoingSessions"],
		queryFn: async () => {
			const mentorsResponse = await getActiveMentors();
			if (!mentorsResponse.success) return [];

			const mentors = mentorsResponse.mentors;
			const sessionPromises = mentors.map(async (mentor) => {
				try {
					const sessionsResponse = await getMentorPerformanceSessions(mentor.id);
					if (sessionsResponse.success) {
						return sessionsResponse.sessions
							.filter((s) => s.isGoingOn)
							.map((s) => ({
								...s,
								mentorName: mentor.name,
								mentorId: mentor.id,
							}));
					}
				} catch (error) {
					console.error(`Error fetching sessions for mentor ${mentor.id}:`, error);
				}
				return [];
			});

			const results = await Promise.all(sessionPromises);
			return results.flat();
		},
		refetchInterval: 60000, // Refresh every minute to catch new sessions
	});
};

export const useOngoingSessionsByCourse = (courseId: number | null) => {
	return useQuery({
		queryKey: ["ongoingSessionsByCourse", courseId],
		queryFn: async () => {
			if (!courseId) return [];
			const response = await getOngoingSessionsByCourse(courseId);
			if (response.success) {
				return response.sessions;
			}
			return [];
		},
		enabled: !!courseId,
		refetchInterval: 30000, // Refresh every 30 seconds
	});
};
