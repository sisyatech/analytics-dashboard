import { useMutation } from "@tanstack/react-query";
import { createAnnouncement } from "@/api/announcement";
import type { CreateAnnouncementPayload } from "@/types/announcement";

export const useCreateAnnouncement = () => {
	return useMutation({
		mutationFn: (payload: CreateAnnouncementPayload) => createAnnouncement(payload),
		onSuccess: (data) => {
			if (data.success) {
				// We can add a success notification here later if a system exists
				console.log("Announcement sent successfully:", data.message);
			}
		},
		onError: (error) => {
			console.error("Failed to send announcement:", error);
		},
	});
};
