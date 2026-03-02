export const AnnouncementType = {
	GENERAL: "GENERAL",
	IMPORTANT: "IMPORTANT",
	ALERT: "ALERT",
	REMINDER: "REMINDER",
} as const;
export type AnnouncementType = (typeof AnnouncementType)[keyof typeof AnnouncementType];

export const AnnouncementAudience = {
	ALL_USERS: "ALL_USERS",
	STUDENTS: "STUDENTS",
	TEACHERS: "TEACHERS",
} as const;
export type AnnouncementAudience = (typeof AnnouncementAudience)[keyof typeof AnnouncementAudience];

export const AnnouncementScope = {
	GLOBAL: "GLOBAL",
	COURSE: "COURSE",
	CLASS: "CLASS",
	INDIVIDUAL: "INDIVIDUAL",
} as const;
export type AnnouncementScope = (typeof AnnouncementScope)[keyof typeof AnnouncementScope];

export interface Announcement {
	id: string;
	title: string;
	message: string;
	type: string;
	status: string;
	audience: string;
	scope: string;
	courseId: number | null;
	classId: number | null;
	userId: number | null;
	mentorId: number | null;
	scheduledAt: string | null;
	sentAt: string | null;
	sendPush: boolean;
	sendEmail: boolean;
	sendWhatsapp: boolean;
	sendSMS: boolean;
	sendInApp: boolean;
	totalSent: number;
	totalRead: number;
	imageUrl: string | null;
	thumbnailUrl: string | null;
	actionType: string | null;
	actionTarget: string | null;
	actionData: string | null;
	source: string;
	createdBy: string | null;
	createdAt: string;
	updatedAt: string;
	isDeleted: boolean;
	_count?: {
		reads: number;
	};
}

export interface GetAnnouncementsResponse {
	success: boolean;
	total: number;
	page: number;
	limit: number;
	data: Announcement[];
}

export interface CreateAnnouncementPayload {
	title: string;
	message: string;
	type: AnnouncementType;
	audience: AnnouncementAudience;
	scope: AnnouncementScope;
	mentorId?: number; // Used for TEACHERS audience
	userId?: number; // Used for STUDENTS audience
}

export interface CreateAnnouncementResponse {
	success: boolean;
	message: string;
}
