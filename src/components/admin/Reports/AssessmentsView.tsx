import { IconCheck, IconX } from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import type { QuizDetailsResponse, TestDetailsResponse } from "@/types/performance";

interface AssessmentsViewProps {
	quizData: QuizDetailsResponse;
	testData: TestDetailsResponse;
}

export const AssessmentsView = ({ quizData, testData }: AssessmentsViewProps) => {
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
					{quizData.sessionQuizzes.map((session) => (
						<div
							key={session.sessionId}
							className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
						>
							<div className="flex justify-between items-start mb-3">
								<h4 className="font-medium text-neutral-900 dark:text-white text-sm">
									{session.sessionTitle}
								</h4>
							</div>
							<div className="flex flex-wrap gap-2">
								{session.quizzes.map((quiz) => (
									<div
										key={quiz.quizId}
										className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border ${
											quiz.isCorrect
												? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
												: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
										}`}
										title={`Time taken: ${quiz.timeTaken}s`}
									>
										{quiz.isCorrect ? (
											<IconCheck className="w-3 h-3" />
										) : (
											<IconX className="w-3 h-3" />
										)}
										<span>{quiz.timeTaken}s</span>
									</div>
								))}
							</div>
						</div>
					))}
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
								<h4 className="font-bold text-neutral-900 dark:text-white text-sm">{test.title}</h4>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs text-neutral-500">{test.mode}</span>
									<span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
									<span
										className={`text-xs font-medium ${
											test.status === "COMPLETED" ? "text-emerald-500" : "text-amber-500"
										}`}
									>
										{test.status}
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
