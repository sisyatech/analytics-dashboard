import { useState } from "react";
import type { Student } from "@/types/performance";

interface StudentAvatarProps {
	student: Student;
	className?: string;
}

export const StudentAvatar = ({ student, className }: StudentAvatarProps) => {
	const [imageError, setImageError] = useState(false);

	// Generate a consistent color based on the name length
	const colors = [
		"from-blue-500 to-indigo-500",
		"from-emerald-500 to-teal-500",
		"from-orange-500 to-red-500",
		"from-purple-500 to-pink-500",
		"from-cyan-500 to-blue-500",
	];
	const colorClass = colors[student.name.length % colors.length];

	if (imageError) {
		return (
			<div
				className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow ${className}`}
			>
				{student.name
					.split(" ")
					.map((n) => n[0])
					.join("")
					.slice(0, 2)
					.toUpperCase()}
			</div>
		);
	}

	return (
		<img
			src={`https://sisyaclass.xyz/student/thumbs/users/${student.id}.jpg`}
			alt={student.name}
			onError={() => setImageError(true)}
			className={`w-12 h-12 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition-shadow bg-neutral-100 dark:bg-neutral-800 ${className}`}
		/>
	);
};
