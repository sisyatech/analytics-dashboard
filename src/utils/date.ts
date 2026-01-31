export function formatTime(dateStr: string | undefined) {
	if (!dateStr) return "N/A";
	return new Date(dateStr).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

export function formatDate(dateStr: string | undefined) {
	if (!dateStr) return "N/A";
	return new Date(dateStr).toLocaleDateString([], {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
