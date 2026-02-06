import { format } from "date-fns";
import {
	AssessmentStats,
	CoursePerformanceTable,
	DashboardStatsCards,
	DoubtAnalyticsChart,
	EnrollmentTrendChart,
	MentorLeaderboard,
	QuickActions,
	RecentActivity,
	SessionTrendChart,
} from "@/components/admin/Dashboard";
import { useDashboardOverview } from "@/hooks/admin/useDashboardStats";

export default function AdminDashboard() {
	const { data, isLoading, error } = useDashboardOverview();

	// Fallback stats structure
	// Fallback stats structure with safe defaults
	const apiStats = data?.data;
	const stats = {
		totalStudents: apiStats?.totalStudents ?? 0,
		totalCourses: apiStats?.totalCourses ?? 0,
		totalSessions: apiStats?.totalSessions ?? 0,
		totalTests: apiStats?.totalTests ?? 0,
		totalHomework: apiStats?.totalHomework ?? 0,
		avgCourseRating: apiStats?.avgCourseRating ?? 0,
		doubts: {
			total: apiStats?.doubts?.total ?? 0,
			solved: apiStats?.doubts?.solved ?? 0,
			solveRate: apiStats?.doubts?.solveRate ?? 0,
		},
	};

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
					<p className="text-lg text-neutral-600 dark:text-neutral-400">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="text-lg text-red-600 dark:text-red-400">Error loading dashboard data</p>
					<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
						Please try refreshing the page
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
					<p className="mt-1 text-neutral-600 dark:text-neutral-400">
						Welcome back! Here's what's happening today.
					</p>
				</div>
				<div className="text-right">
					<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
						{format(new Date(), "EEEE")}
					</p>
					<p className="text-lg font-semibold text-neutral-900 dark:text-white">
						{format(new Date(), "MMMM d, yyyy")}
					</p>
				</div>
			</div>

			{/* Row 1: Key Stats */}
			<DashboardStatsCards stats={stats} />

			{/* Row 2: Quick Actions */}
			<div className="grid gap-6">
				<QuickActions />
			</div>

			{/* Row 3: Assessment Stats & Enrollment */}
			<div className="grid gap-6 lg:grid-cols-4">
				{/* Assessment Stats Column - 1/4 width (stacked vertically) */}
				<div className="lg:col-span-1">
					<AssessmentStats />
				</div>

				{/* Main Chart Column - 3/4 width */}
				<div className="lg:col-span-3">
					<EnrollmentTrendChart />
				</div>
			</div>

			{/* Row 4: Recent Activity & Session Analytics */}
			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<RecentActivity />
				</div>
				<div className="lg:col-span-2">
					<SessionTrendChart />
				</div>
			</div>

			{/* Row 5: Doubt Analytics & Mentor Leaderboard */}
			<div className="grid gap-6 lg:grid-cols-2">
				<DoubtAnalyticsChart />
				<MentorLeaderboard />
			</div>

			{/* Row 6: Tables */}
			<div className="grid gap-6">
				<CoursePerformanceTable />
			</div>
		</div>
	);
}
