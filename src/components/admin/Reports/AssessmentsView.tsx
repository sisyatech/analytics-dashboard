import { IconCheck, IconTrophy, IconX } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { QuizDetailsResponse, TestDetailsResponse } from "@/types/performance";

interface AssessmentsViewProps {
	quizData: QuizDetailsResponse;
	testData: TestDetailsResponse;
}

export const AssessmentsView = ({ quizData, testData }: AssessmentsViewProps) => {
	const sortedQuizzes = useMemo(() => {
		return [...quizData.sessionQuizzes].sort(
			(a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime(),
		);
	}, [quizData.sessionQuizzes]);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Quizzes Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
					Recent Quizzes
					<span className="text-xs font-normal px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
						{quizData.sessionQuizzes.length} Sessions
					</span>
				</h3>
				<div className="space-y-4">
					{sortedQuizzes.map((session) => {
						const totalQuizzes = session.quizzes.length;
						const correctQuizzes = session.quizzes.filter((q) => q.isCorrect).length;
						const accuracy = totalQuizzes > 0 ? (correctQuizzes / totalQuizzes) * 100 : 0;
						const avgTime =
							totalQuizzes > 0
								? session.quizzes.reduce((acc, q) => acc + q.timeTaken, 0) / totalQuizzes
								: 0;

						return (
							<div
								key={session.sessionId}
								className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-shadow"
							>
								<div className="flex justify-between items-start mb-3">
									<div>
										<h4 className="font-bold text-neutral-900 dark:text-white text-sm">
											{session.sessionTitle}
										</h4>
										<div className="flex items-center gap-2 mt-1">
											<span className="text-[10px] text-neutral-400">
												{format(parseISO(session.sessionDate), "MMM dd, yyyy")}
											</span>
											<span className="text-neutral-300 dark:text-neutral-700">•</span>
											<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
												{accuracy.toFixed(0)}% Accuracy
											</span>
											<span className="text-[10px] font-medium text-neutral-400">
												{avgTime.toFixed(1)}s avg
											</span>
										</div>
									</div>
									<span className="text-[10px] font-bold px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
										{totalQuizzes} Marks
									</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{session.quizzes.map((quiz) => (
										<div
											key={quiz.quizId}
											className={`flex items-center gap-1 p-1 rounded-md border ${
												quiz.isCorrect
													? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400"
													: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400"
											}`}
											title={`Time taken: ${quiz.timeTaken}s`}
										>
											{quiz.isCorrect ? (
												<IconCheck className="w-3 h-3" />
											) : (
												<IconX className="w-3 h-3" />
											)}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Tests Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
					Tests
					<span className="text-xs font-normal px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
						{testData.testDetails.length} Total
					</span>
				</h3>
				<div className="space-y-3">
					{testData.testDetails.map((test) => (
						<div
							key={test.testId}
							className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
						>
							<div>
								<div className="flex items-center gap-2">
									<h4 className="font-bold text-neutral-900 dark:text-white text-sm">
										{test.title}
									</h4>
									{test.rank && (
										<span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30">
											<IconTrophy className="w-2.5 h-2.5" />
											Rank {test.rank}
										</span>
									)}
								</div>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs font-medium text-neutral-400">
										{test.mode} • {format(parseISO(test.testDate), "MMM dd")}
									</span>
								</div>
							</div>
							<div className="text-right">
								<div className="text-lg font-bold text-neutral-900 dark:text-white">
									{test.marks}
									<span className="text-sm text-neutral-400 font-normal">/{test.maxMarks}</span>
								</div>
								{test.submittedAt && (
									<div className="text-xs text-neutral-400">
										{format(parseISO(test.submittedAt), "MMM dd")}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
