export interface DashboardStats {
	totalStudents: number;
	activeMentors: number;
	completedSessions: number;
	activeCourses: number;
	studentTrend: number; // percentage change
	mentorTrend: number;
	sessionTrend: number;
	courseTrend: number;
}

export interface ActivityItem {
	id: string;
	type: "session" | "enrollment" | "mentor";
	title: string;
	description: string;
	timestamp: Date;
	icon?: string;
}

export interface ChartDataPoint {
	date: string;
	value: number;
	label?: string;
}

export interface PerformanceDistribution {
	grade: string;
	students: number;
	averageScore: number;
}

export interface DashboardOverviewResponse {
	success: boolean;
	data: {
		totalStudents: number;
		totalCourses: number;
		totalSessions: number;
		totalTests: number;
		totalHomework: number;
		avgCourseRating: number;
		doubts: {
			total: number;
			solved: number;
			solveRate: number;
		};
	};
}

export interface EnrollmentTrendItem {
	date: string;
	count: number;
}

export interface EnrollmentTrendResponse {
	success: boolean;
	data: EnrollmentTrendItem[];
}

export interface SessionTrendItem {
	date: string;
	sessionCount: number;
	avgAttendance: number;
	avgRating: number;
}

export interface SessionTrendResponse {
	success: boolean;
	data: SessionTrendItem[];
}

export interface CoursePerformanceItem {
	courseId: number;
	courseName: string;
	grade: string;
	enrollmentCount: number;
	sessionCount: number;
	testCount: number;
	avgRating: number;
}

export interface CoursePerformanceResponse {
	success: boolean;
	data: CoursePerformanceItem[];
}

export interface AssessmentCompletionResponse {
	success: boolean;
	data: {
		tests: {
			total: number;
			totalSubmissions: number;
			avgCompletionRate: number;
		};
		homework: {
			total: number;
			totalSubmissions: number;
			avgCompletionRate: number;
		};
	};
}

export interface MentorPerformanceItem {
	mentorId: number;
	mentorName: string;
	sessionCount: number;
	doubtCount: number;
	avgSessionRating: number;
	avgDoubtRating: number;
}

export interface MentorPerformanceResponse {
	success: boolean;
	data: MentorPerformanceItem[];
}

export interface DoubtTrendItem {
	date: string;
	created: number;
	solved: number;
	solveRate: number;
}

export interface DoubtTrendResponse {
	success: boolean;
	data: DoubtTrendItem[];
}

export interface RatingsDistributionResponse {
	success: boolean;
	data: {
		sessionRatings: number[];
		doubtRatings: number[];
		mentorRatings: number[];
	};
}
