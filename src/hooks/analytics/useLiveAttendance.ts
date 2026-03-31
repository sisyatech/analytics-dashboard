import { useCallback, useEffect, useRef, useState } from "react";
import roomSocketService from "@/api/socketService";
import { useAuthStore } from "@/store/useAuthStore";
import type { PresentStudent } from "@/types/performance";

export interface ChatMessage {
	message: string;
	name: string;
	from: string;
	time: string;
	isMe: boolean;
}

/** Deep-extract a text string from various possible chat payload shapes */
const extractText = (obj: unknown, depth = 0): string | null => {
	if (!obj || depth > 4) return null;
	if (typeof obj === "string") return obj;
	if (typeof obj === "number") return String(obj);
	if (Array.isArray(obj)) {
		for (const item of obj) {
			const t = extractText(item, depth + 1);
			if (t) return t;
		}
		return null;
	}
	if (typeof obj === "object") {
		const record = obj as Record<string, unknown>;
		const keys = [
			"message",
			"content",
			"text",
			"msg",
			"body",
			"payload",
			"data",
			"messageText",
			"message_body",
			"message_text",
		];
		for (const k of keys) {
			if (record[k] !== undefined && record[k] !== null) {
				const t = extractText(record[k], depth + 1);
				if (t) return t;
			}
		}
		for (const k of Object.keys(record)) {
			try {
				const t = extractText(record[k], depth + 1);
				if (t) return t;
			} catch {}
		}
	}
	return null;
};

export const useLiveAttendance = (sessionId?: number, vmip?: string) => {
	const { token, user, role } = useAuthStore();
	const [students, setStudents] = useState<PresentStudent[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const isMounted = useRef(true);
	const userUuidRef = useRef(user?.uuid || "");

	// Keep uuid ref in sync
	useEffect(() => {
		userUuidRef.current = user?.uuid || "";
	}, [user?.uuid]);

	const sendMessage = useCallback(
		(text: string) => {
			if (!text.trim() || !isConnected) return;
			roomSocketService.emit("chat-message", text.trim());
		},
		[isConnected],
	);

	const joinSession = useCallback(async () => {
		if (!sessionId || !token || !user) return;

		console.log("📍 [useLiveAttendance] Joining session:", {
			sessionId,
			userId: user.id,
			userUuid: user.uuid,
			role: role,
		});

		setStatus("connecting");

		roomSocketService.initializeSocket(token, user.id, user.uuid, sessionId, vmip, role || "admin");

		const onConnect = () => {
			if (!isMounted.current) return;
			setIsConnected(true);
			setStatus("connected");
			roomSocketService.emit(
				"join-classroom",
				{ sessionId, isCohost: true },
				(response: unknown) => {
					console.log("📥 [useLiveAttendance] Handshake successful:", response || "ACK");
				},
			);
		};

		const onDisconnect = () => {
			if (!isMounted.current) return;
			setIsConnected(false);
			setStatus("idle");
		};

		const onStudentListUpdate = (updatedStudents: unknown) => {
			if (!isMounted.current) return;
			console.log("🔄 [useLiveAttendance] SOCKET student-list-updated:", updatedStudents);
			const data = updatedStudents as { students?: PresentStudent[] };
			const list = Array.isArray(updatedStudents)
				? (updatedStudents as PresentStudent[])
				: Array.isArray(data?.students)
					? data.students
					: [];
			setStudents(list);
		};

		const onChatMessage = (msg: unknown) => {
			if (!isMounted.current) return;
			console.log("💬 [useLiveAttendance] Chat message:", msg);

			const text = extractText(msg) ?? "";
			const raw = typeof msg === "object" && msg !== null ? (msg as Record<string, unknown>) : {};
			const senderUuid = String(raw.from || raw.fromUUID || raw.sender || "");
			const isMe = senderUuid === userUuidRef.current;

			const normalized: ChatMessage = {
				message: text,
				name: String(raw.name || raw.from || raw.fromUUID || "Anonymous"),
				from: senderUuid,
				time: String(raw.createdOn || raw.time || new Date().toISOString()),
				isMe,
			};

			setMessages((prev) => [...prev, normalized]);
		};

		roomSocketService.on("connect", onConnect);
		roomSocketService.on("disconnect", onDisconnect);
		roomSocketService.on("student-list-updated", onStudentListUpdate);
		roomSocketService.on("accept_message", onChatMessage);
		roomSocketService.on("chat-message", onChatMessage);

		roomSocketService.connect();

		return () => {
			roomSocketService.off("connect", onConnect);
			roomSocketService.off("disconnect", onDisconnect);
			roomSocketService.off("student-list-updated", onStudentListUpdate);
			roomSocketService.off("accept_message", onChatMessage);
			roomSocketService.off("chat-message", onChatMessage);
		};
	}, [sessionId, token, user, role, vmip]);

	useEffect(() => {
		isMounted.current = true;
		let cleanupFn: (() => void) | undefined;

		const init = async () => {
			const cleanup = await joinSession();
			if (isMounted.current) {
				cleanupFn = cleanup;
			}
		};

		init();

		return () => {
			isMounted.current = false;
			if (cleanupFn) cleanupFn();
			roomSocketService.destroy();
		};
	}, [joinSession]);

	return {
		students,
		isConnected,
		status,
		messages,
		sendMessage,
		refresh: () => {
			if (sessionId) {
				roomSocketService.emit("get-existing-producers", { sessionId });
			}
		},
	};
};
