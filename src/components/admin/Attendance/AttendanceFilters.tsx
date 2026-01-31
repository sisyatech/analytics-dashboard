import { IconBook, IconSchool } from "@tabler/icons-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GRADES } from "@/constants";
import type { Course } from "@/types/analytics";

interface AttendanceFiltersProps {
	selectedGrade: string | null;
	onGradeChange: (grade: string) => void;
	selectedCourseId: number | null;
	onCourseChange: (courseId: number) => void;
	coursesData?: { courses: Course[] };
	isLoadingCourses: boolean;
}

export const AttendanceFilters = ({
	selectedGrade,
	onGradeChange,
	selectedCourseId,
	onCourseChange,
	coursesData,
	isLoadingCourses,
}: AttendanceFiltersProps) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
			<div className="space-y-3">
				<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
					<IconSchool className="w-4 h-4 text-blue-500" /> Grade
				</div>
				<Select value={selectedGrade || ""} onValueChange={onGradeChange}>
					<SelectTrigger className="w-full h-12 rounded-xl">
						<SelectValue placeholder="Which grade?" />
					</SelectTrigger>
					<SelectContent>
						{GRADES.map((g) => (
							<SelectItem key={g} value={g}>
								Grade {g}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-3">
				<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
					<IconBook className="w-4 h-4 text-emerald-500" /> Course
				</div>
				<Select
					disabled={!selectedGrade || isLoadingCourses}
					value={selectedCourseId?.toString() || ""}
					onValueChange={(val) => onCourseChange(Number.parseInt(val, 10))}
				>
					<SelectTrigger className="w-full h-12 rounded-xl">
						<SelectValue placeholder={isLoadingCourses ? "Loading..." : "Which course?"} />
					</SelectTrigger>
					<SelectContent>
						{coursesData?.courses.map((c: Course) => (
							<SelectItem key={c.id} value={c.id.toString()}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
