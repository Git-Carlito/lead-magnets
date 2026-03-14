import { useState } from "react";

import { LeadForm } from "@/components/LeadForm";
import type { QuizData } from "@/lib/quiz-types";

import { ProgressBar } from "./ProgressBar";
import { Question } from "./Question";
import { ResultCard } from "./ResultCard";

interface QuizShellProps {
  quiz: QuizData;
}

export function QuizShell({ quiz }: QuizShellProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (showResult) {
    const result = quiz.getResult(answers);
    return (
      <div className="mx-auto max-w-lg space-y-8">
        <ResultCard result={result} />
        <LeadForm leadMagnet={quiz.slug} answers={answers} result={result.key} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <ProgressBar current={currentIndex + 1} total={quiz.questions.length} />
      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        selectedValue={answers[currentQuestion.id]}
      />
    </div>
  );
}
