export const APP_NAME = "SISYA Analytics";

export const ROUTES = {
	LOGIN: "/login",
	ADMIN_DASHBOARD: "/admin",
	SUBADMIN_DASHBOARD: "/subadmin",
	ATTENDANCE: "/attendance",
	ADMIN_AI_DOUBT_DETAIL: "/admin/ai/doubt-detail",
	ADMIN_AI_REVIEW: "/admin/ai/review",
	ADMIN_DOUBTS: "/admin/doubts",
	USERS: "/admin/users",
	SETTINGS: "/settings",
	STUDENT_REPORT: "/admin/student-report",
} as const;

export const API_BASE_URL = "https://sisyaclass.xyz";

export const API_ENDPOINTS = {
	ADMIN_LOGIN: "/rkadmin/login",
	SUBADMIN_LOGIN: "/rkadmin/subadmin_login",
	GET_COURSES_BY_GRADE: "/rkadmin/get_course_by_grade",
	GET_COMPLETED_SESSIONS: "/rkadmin/get_completed_session",
	GET_SESSION_ATTENDANCE: "/rkadmin/get_session_attendance",
	CREATE_ANNOUNCEMENT: "/rkadmin/create_announcement",
	MARK_AS_SISYA_EMP: "/rkadmin/mark_as_sisya_emp",
	GET_STUDENTS_BY_COURSE: "/rkadmin/get_students_by_course",
	GET_PERFORMANCE_SUMMARY: "/rkadmin/performance/summary",
	GET_PERFORMANCE_ATTENDANCE: "/rkadmin/performance/attendance",
	GET_PERFORMANCE_QUIZZES: "/rkadmin/performance/quizzes",
	GET_PERFORMANCE_TESTS: "/rkadmin/performance/tests",
	GET_PERFORMANCE_HOMEWORK: "/rkadmin/performance/homework",
} as const;

export const GRADES = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
