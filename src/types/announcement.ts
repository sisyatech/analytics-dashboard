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
