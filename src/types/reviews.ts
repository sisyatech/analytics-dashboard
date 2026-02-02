export interface SessionFeedback {
	id: number;
	sessionId: number;
	sessionTitle: string;
	sessionDate: string;
	rating: number;
	techIssue: string;
	sessionIssue: string;
	general: string | null;
	createdAt: string;
}

export interface DoubtReview {
	id: number;
	doubtId: number;
	doubtDescription: string;
	subject: string;
	topic: string;
	mentorName: string;
	rating: number;
	comment: string;
	createdOn: string;
}

export interface MentorReview {
	id: number;
	mentorId: number;
	mentorName: string;
	rating: number;
	comment: string;
	createdOn: string;
}

export interface AIRating {
	id: number;
	conversationId: number | null;
	rating: number;
	review: string;
	isVisible: boolean;
	createdAt: string;
}

export interface ReviewSummary {
	totalSessionFeedbacks: number;
	totalDoubtReviews: number;
	totalMentorReviews: number;
	totalAIRatings: number;
	avgSessionRating: number;
	avgDoubtRating: number;
	avgMentorRating: number;
	avgAIRating: number;
}

export interface ReviewDetailsResponse {
	success: boolean;
	reviewDetails: {
		sessionFeedbacks: SessionFeedback[];
		doubtReviews: DoubtReview[];
		mentorReviews: MentorReview[];
		aiRatings: AIRating[];
		summary: ReviewSummary;
	};
}
