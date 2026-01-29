import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

export function useAutoLogout() {
	const { logout, isAuthenticated } = useAuthStore();
	const navigate = useNavigate();
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleLogout = useCallback(() => {
		if (isAuthenticated) {
			logout();
			navigate(ROUTES.LOGIN);
		}
	}, [logout, navigate, isAuthenticated]);

	const resetTimer = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (isAuthenticated) {
			timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
		}
	}, [handleLogout, isAuthenticated]);

	useEffect(() => {
		if (!isAuthenticated) return;

		// Initial timer start
		resetTimer();

		// Events to listen for
		const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

		const handleActivity = () => {
			resetTimer();
		};

		events.forEach((event) => {
			window.addEventListener(event, handleActivity);
		});

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			events.forEach((event) => {
				window.removeEventListener(event, handleActivity);
			});
		};
	}, [isAuthenticated, resetTimer]);
}
