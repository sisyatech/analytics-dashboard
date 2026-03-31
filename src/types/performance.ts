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

export interface LiveSessionStudentInterval {
	joinTime: number;
	leaveTime: number | null;
}

export interface LiveSessionStudent {
	userID: string;
	userName: string;
	homeworkDone: boolean;
	intervals: LiveSessionStudentInterval[];
	intervalCount: number;
}

export interface LiveSessionStudentsResponse {
	success: boolean;
	sessionId: number;
	lastSyncAt: number | null;
	students: LiveSessionStudent[];
	studentCount: number;
	message?: string;
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
		totalDurationMinutes: number;
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
	rewardBudget: {
		balance: string;
		usage: {
			today: string;
			thisMonth: string;
		};
		limits: {
			daily: string;
			monthly: string | null;
		};
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

export interface MentorRewardTransaction {
	id: string;
	amount: string;
	type: string;
	balanceType: string;
	createdAt: string;
	reason: string;
	studentName?: string; // For SPENT
	studentId?: number; // For SPENT
	adminName?: string; // For RECEIVED
	adminId?: number; // For RECEIVED
}

export interface Pagination {
	total: number;
	skip: number;
	take: number;
}

export interface PaginatedRewardTransactions {
	data: MentorRewardTransaction[];
	pagination: Pagination;
}

export interface MentorRewardTransactionsResponse {
	success: boolean;
	data: {
		spent: PaginatedRewardTransactions;
		received: PaginatedRewardTransactions;
	};
}

// Course Performance Types
export interface CourseSummary {
	enrolledStudents: number;
	sessions: {
		totalDone: number;
		totalDurationMinutes: number;
		avgRating: number;
	};
	homework: {
		totalAssigned: number;
	};
	tests: {
		totalAssigned: number;
	};
	courseRating: number;
}

export interface CourseSummaryResponse {
	success: boolean;
	summary: CourseSummary;
}

export interface CourseSession {
	id: number;
	title: string;
	startTime: string;
	endTime: string;
	allocatedTeacher: {
		id: number;
		name: string;
	};
	actualTeacher: {
		id: number;
		name: string;
	} | null;
	subjectName: string;
	isDone: boolean;
	isGoingOn: boolean;
	hasHomework: boolean;
	analytics: {
		totalStudentsJoined: number;
		avgRating: number;
		reviewCount: number;
		actualStartTime: string | null;
		actualEndTime: string | null;
		actualDuration: number;
	};
}

export interface CourseSessionsResponse {
	success: boolean;
	total: number;
	page: number;
	limit: number;
	sessions: CourseSession[];
}

export interface CourseHomework {
	homeworkId: number;
	sessionId: number;
	sessionName: string;
	sessionDate: string;
	totalQuestions: number;
	submissionCount: number;
	createdAt: string;
}

export interface CourseHomeworkResponse {
	success: boolean;
	homeworkDetails: CourseHomework[];
}

export interface CourseReview {
	id: number;
	rating: number;
	comment: string | null;
	studentName: string;
	sessionTitle: string;
	sessionDate: string;
	techIssue: string;
	sessionIssue: string;
	createdAt: string;
}

export interface CourseReviewsResponse {
	success: boolean;
	reviewDetails: CourseReview[];
}

export interface CourseTest {
	testId: number;
	title: string;
	mode: string;
	startDate: string;
	endDate: string;
	duration: number;
	totalMarks: number | null;
	questionCount: number;
	submissionCount: number;
	createdAt: string;
}

export interface CourseTestsResponse {
	success: boolean;
	testDetails: CourseTest[];
}

export interface OngoingSessionByCourse {
	id: number;
	detail: string;
	startTime: string;
	endTime: string;
	isGoingOn: boolean;
	vmIp: string | null;
	roomId: string | null;
	tokenId: string | null;
	mentor: {
		id: number;
		name: string;
		email: string;
	};
	subject: {
		id: number;
		name: string;
	};
}

export interface OngoingSessionsByCourseResponse {
	success: boolean;
	sessions: OngoingSessionByCourse[];
}
