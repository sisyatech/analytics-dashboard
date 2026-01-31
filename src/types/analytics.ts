export interface Course {
	id: number;
	name: string;
	isLongTerm: boolean;
	isFree: boolean;
}

export interface Teacher {
	id: number;
	name: string;
}

export interface Subject {
	id: number;
	name: string;
}

export interface Session {
	id: number;
	detail: string;
	scheduledStartTime: string;
	scheduledEndTime: string;
	scheduledDuration: number;
	scheduledTeacher: Teacher;
	subject: Subject;
	isHomeworkUploaded: boolean;
	actualStartTime?: string;
	actualEndTime?: string;
	actualDuration?: number;
	actualTeacher?: Teacher;
}

export interface AttendanceInterval {
	joinTime: string;
	leaveTime: string;
	durationMin: number;
}

export interface StudentAttendance {
	studentId: number;
	name: string;
	email: string;
	phone: string;
	status: "PRESENT" | "ABSENT";
	totalDurationMin: number;
	isEarlyLeave: boolean;
	isLateJoin: boolean;
	intervals: AttendanceInterval[];
}

export interface SessionAttendanceResponse {
	success: boolean;
	sessionId: number;
	totalEnrolled: number;
	presentCount: number;
	absentCount: number;
	students: StudentAttendance[];
}

export interface PaginatedSessionsResponse {
	success: boolean;
	sessions: Session[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		hasNext: boolean;
	};
}

export interface CoursesResponse {
	success: boolean;
	courses: Course[];
}
