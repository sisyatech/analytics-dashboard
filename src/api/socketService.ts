// biome-ignore-all lint: <already created file -- fixing will break things>

import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/constants";

class RoomSocketService {
	public socket: Socket | undefined;

	initializeSocket(
		token: string,
		userId: string,
		userUuid?: string,
		sessionId?: number,
		vmip?: string,
		role = "admin",
	) {
		if (this.socket) {
			console.log("🧹 [RoomSocketService] Previous socket instance detected. Destroying...");
			this.destroy();
		}

		const socketUrl = vmip ? `https://${vmip}` : API_BASE_URL;
		console.log(`🚀 [RoomSocketService] Initializing socket at ${socketUrl}`);

		const authPayload = {
			token,
			user: {
				id: userUuid || userId,
				userId: userId || userUuid,
				uuid: userUuid,
				role,
				sessionId,
			},
			// Keep flat for compatibility
			id: userUuid || userId,
			userId: userId || userUuid,
			uuid: userUuid,
			role,
			sessionId,
		};

		this.socket = io(socketUrl, {
			path: socketUrl === "https://sisyaclass.xyz" ? "/student/socket.io" : "/socket.io",
			transports: ["websocket"],
			autoConnect: false,
			auth: authPayload,
		});

		this.socket.on("connect", () => {
			console.log("✅ [RoomSocketService] Connected");
		});

		this.socket.on("connect_error", (error) => {
			console.error("❌ [RoomSocketService] Connection error:", error.message);
		});

		this.socket.on("disconnect", (reason) => {
			console.log("🔌 [RoomSocketService] Disconnected:", reason);
		});

		this.socket.onAny((event, ...args) => {
			console.log(`📡 [RoomSocketService] Event: ${event}`, args);
		});
	}

	connect() {
		this.socket?.connect();
	}

	disconnect() {
		if (this.socket) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
		}
	}

	destroy() {
		if (this.socket) {
			this.socket.removeAllListeners();
			this.socket.offAny?.();
			this.socket.disconnect();
			this.socket = undefined;
		}
	}

	on(event: string, callback: (data: any) => void) {
		this.socket?.on(event, callback);
	}

	off(event: string, callback?: (data: any) => void) {
		this.socket?.off(event, callback);
	}

	emit(event: string, data?: any, ack?: (response: any) => void) {
		if (this.socket) {
			this.socket.emit(event, data, ack);
		}
	}

	get connected(): boolean {
		return this.socket?.connected || false;
	}
}

const roomSocketService = new RoomSocketService();
export default roomSocketService;
