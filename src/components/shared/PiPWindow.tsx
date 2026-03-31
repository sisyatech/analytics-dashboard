import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PiPWindowProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	width?: number;
	height?: number;
}

export const PiPWindow = ({
	isOpen,
	onClose,
	children,
	width = 450,
	height = 600,
}: PiPWindowProps) => {
	const [pipWindow, setPipWindow] = useState<Window | null>(null);
	const pipWindowRef = useRef<Window | null>(null);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!isOpen && pipWindowRef.current) {
			pipWindowRef.current.close();
			setPipWindow(null);
			pipWindowRef.current = null;
			return;
		}

		if (isOpen && !pipWindowRef.current && "documentPictureInPicture" in window) {
			const openPip = async () => {
				try {
					// @ts-expect-error - Document PiP API
					const pip = await window.documentPictureInPicture.requestWindow({
						width,
						height,
					});

					// Copy all stylesheets
					const styles = document.querySelectorAll('link[rel="stylesheet"], style');
					styles.forEach((style) => {
						pip.document.head.appendChild(style.cloneNode(true));
					});

					// Copy root classes for Tailwind dark mode
					pip.document.documentElement.className = document.documentElement.className;
					pip.document.documentElement.style.cssText = document.documentElement.style.cssText;

					pip.addEventListener("pagehide", () => {
						onCloseRef.current();
						setPipWindow(null);
						pipWindowRef.current = null;
					});

					pipWindowRef.current = pip;
					setPipWindow(pip);
				} catch (error) {
					console.error("Failed to open PiP window:", error);
					onCloseRef.current();
				}
			};

			openPip();
		}

		return () => {
			if (pipWindowRef.current) {
				pipWindowRef.current.close();
			}
		};
	}, [isOpen, width, height]);

	if (!pipWindow) return null;

	return createPortal(children, pipWindow.document.body);
};
