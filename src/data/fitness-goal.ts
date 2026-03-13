import type { QuizData, QuizResult } from "@/lib/quiz-types";
import quizJson from "./fitness-goal.json";

function getResult(answers: Record<string, string>): QuizResult {
  const results = quizJson.results;
  const { goal, experience, frequency } = answers;

  if (goal === "wellness") {
    return results.find((r) => r.key === "wellness-reset")!;
  }

  if (goal === "muscle" || (goal === "weight-loss" && frequency === "5+")) {
    return results.find((r) => r.key === "structured-strength")!;
  }

  if (goal === "endurance" || experience === "advanced") {
    return results.find((r) => r.key === "performance-boost")!;
  }

  return results.find((r) => r.key === "active-lifestyle")!;
}

export const fitnessGoalQuiz: QuizData = {
  ...quizJson,
  getResult,
};
