export interface Student {
	id: number;
	uuid: string;
	name: string;
	email: string;
	phone: string;
	grade: string;
	joinedAt: string;
}

export interface Mentor {
	id: number;
	uuid: string;
	name: string;
	email: string;
	phone: string;
}

export interface MentorsResponse {
	success: boolean;
	mentors: Mentor[];
}

export interface StudentsResponse {
	success: boolean;
	students: Student[];
}

export interface PerformanceSummary {
	attendance: {
		lateJoinRate: number;
		earlyLeaveRate: number;
		finishRate: number;
		attendanceRate: number;
		presentCount: number;
		totalSessions: number;
		classAvgRate: number;
	};
	quizzes: {
		total: number;
		attempted: number;
		correct: number;
		participationRate: number;
		accuracy: number;
		classAvgParticipation: number;
	};
	tests: {
		total: number;
		attempted: number;
		completionRate: number;
		classAvgCompletion: number;
	};
	homework: {
		total: number;
		attempted: number;
		totalQuestions: number;
		totalCorrect: number;
		attemptRate: number;
		classAvgAttemptRate: number;
	};
	doubts: {
		total: number;
		solved: number;
	};
	satisfaction: {
		averageRating: number;
		feedbackCount: number;
	};
	coins: {
		balance: number;
		totalEarned: number;
		totalSpent: number;
	};
	reviews: {
		totalSessionFeedbacks: number;
		totalDoubtReviews: number;
		totalMentorReviews: number;
		totalAIRatings: number;
	};
}

export interface PerformanceSummaryResponse {
	success: boolean;
	summary: PerformanceSummary;
}

export interface AttendanceDetail {
	sessionId: number;
	title: string;
	startTime: string;
	endTime: string;
	isPresent: boolean;
	joinTime: string | null;
	leaveTime: string | null;
	isLateJoin: boolean;
	isEarlyLeave: boolean;
	effectiveDuration: number;
}

export interface AttendanceDetailsResponse {
	success: boolean;
	attendanceDetails: AttendanceDetail[];
}

export interface QuizSubmission {
	quizId: number;
	isCorrect: boolean;
	timeTaken: number;
	submittedAt: string;
}

export interface SessionQuizDetail {
	sessionId: number;
	sessionTitle: string;
	sessionDate: string;
	quizzes: QuizSubmission[];
}

export interface QuizDetailsResponse {
	success: boolean;
	sessionQuizzes: SessionQuizDetail[];
}

export interface TestDetail {
	testId: number;
	title: string;
	mode: string;
	testDate: string;
	maxMarks: number;
	isAttempted: boolean;
	marks: number;
	rank: number | null;
	status: string;
	submittedAt: string | null;
}

export interface TestDetailsResponse {
	success: boolean;
	testDetails: TestDetail[];
}

export interface HomeworkApiItem {
	homeworkId: number;
	sessionId: number;
	sessionName: string;
	sessionDate: string;
	maxMarks: number;
	marks: number;
	isAttempted: boolean;
	submittedAt: string | null;
}

export interface HomeworkDetail {
	homeworkId: number;
	title: string;
	description: string;
	assignedDate: string;
	dueDate: string | null;
	isSubmitted: boolean;
	submittedAt: string | null;
	totalQuestions: number;
	correctAnswers: number;
	score: number; // Percentage or absolute value
	status: "PENDING" | "SUBMITTED" | "LATE" | "MISSED";
}

export interface HomeworkDetailsResponse {
	success: boolean;
	homeworkDetails: HomeworkApiItem[];
}

export interface CoinTransaction {
	id: string;
	walletId: string;
	type: string;
	status: string;
	amount: string;
	fee: string;
	balanceBefore: string;
	balanceAfter: string;
	balanceType: string;
	counterpartyWalletId: string;
	metadata: {
		reason: string;
		taskCode: string;
		expiresAt: string | null;
		expiryBalanceId: string | null;
	};
	reference: string | null;
	createdAt: string;
	initiatedByType: string;
	initiatedById: number | null;
	wallet: {
		ownerType: string;
		ownerId: number;
	};
}

export interface CoinsTransactionsResponse {
	success: boolean;
	data: CoinTransaction[];
}

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

// Mentor Performance Types
export interface MentorSummary {
	sessions: {
		total: number;
		avgRating: number;
	};
	doubts: {
		assigned: number;
		solved: number;
		solveRate: number;
		avgRating: number;
	};
	ratings: {
		mentorAvgRating: number;
		overallAvgRating: number;
		totalReviews: number;
	};
}

export interface MentorSummaryResponse {
	success: boolean;
	summary: MentorSummary;
}

export interface MentorReviewItem {
	id: number;
	rating: number;
	comment: string | null;
	studentName: string;
	sessionTitle?: string;
	doubtDescription?: string;
	date: string;
	type: "SESSION" | "DOUBT" | "DIRECT";
}

export interface MentorReviewDetailsResponse {
	success: boolean;
	reviewDetails: {
		sessionFeedbacks: MentorReviewItem[];
		doubtReviews: MentorReviewItem[];
		mentorRatings: MentorReviewItem[];
	};
}

export interface MentorDoubtItem {
	doubtId: number;
	description: string;
	subject: string;
	topic: string;
	status: number;
	studentName: string;
	createdAt: string;
	rating: number | null;
	reviewComment: string | null;
}

export interface MentorDoubtDetailsResponse {
	success: boolean;
	doubtDetails: MentorDoubtItem[];
}

export interface MentorSession {
	id: number;
	title: string;
	startTime: string;
	endTime: string;
	courseId: number;
	courseName: string;
	grade: string;
	subjectName: string;
	isDone: boolean;
	isGoingOn: boolean;
	hasHomework: boolean;
	analytics: {
		totalStudentsJoined: number;
		avgRating: number;
		reviewCount: number;
		isTakenByAssignedMentor: boolean;
		actualStartTime: string;
		actualEndTime: string;
		actualDuration: number;
		teacherDuration: number;
	};
}

export interface MentorSessionsResponse {
	success: boolean;
	sessions: MentorSession[];
}

export interface PresentStudent {
	id: number;
	name: string;
	phone: string;
}

export interface PresentStudentsResponse {
	success: boolean;
	students: PresentStudent[];
}

export interface SessionReview {
	id: number;
	rating: number;
	techIssue: string;
	sessionIssue: string;
	general: string | null;
	createdAt: string;
	student: {
		id: number;
		name: string;
		email: string;
	};
}

export interface SessionReviewsResponse {
	success: boolean;
	reviews: SessionReview[];
}
