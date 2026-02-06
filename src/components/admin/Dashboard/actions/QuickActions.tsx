import {
	IconBooks,
	IconListDetails,
	IconReportAnalytics,
	IconSchool,
	IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

interface QuickAction {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	route: string;
	color: string;
}

const quickActions: QuickAction[] = [
	{
		id: "attendance",
		title: "Attendance",
		description: "View session attendance",
		icon: IconListDetails,
		route: ROUTES.ATTENDANCE,
		color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
	},
	{
		id: "student-report",
		title: "Student Reports",
		description: "View student performance",
		icon: IconReportAnalytics,
		route: ROUTES.STUDENT_REPORT,
		color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
	},
	{
		id: "mentor-report",
		title: "Mentor Reports",
		description: "View mentor analytics",
		icon: IconSchool,
		route: ROUTES.MENTOR_REPORT,
		color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
	},
	{
		id: "course-report",
		title: "Course Reports",
		description: "View course statistics",
		icon: IconBooks,
		route: ROUTES.COURSE_REPORT,
		color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
	},
	{
		id: "subadmin",
		title: "SubAdmin Management",
		description: "Manage permissions",
		icon: IconUsers,
		route: ROUTES.SUBADMIN_MANAGEMENT,
		color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
	},
];

export function QuickActions() {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.7 }}
		>
			<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				{quickActions.map((action, index) => {
					const Icon = action.icon;
					return (
						<motion.button
							key={action.id}
							type="button"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
							onClick={() => navigate(action.route)}
							className="flex flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-center transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
						>
							<div className={`rounded-lg p-2 ${action.color}`}>
								<Icon className="h-6 w-6" />
							</div>
							<p className="font-medium text-neutral-900 dark:text-white line-clamp-1">
								{action.title}
							</p>
						</motion.button>
					);
				})}
			</div>
		</motion.div>
	);
}
