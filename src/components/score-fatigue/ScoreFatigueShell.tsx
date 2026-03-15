import { useState } from "react";

import { AllGoodResult } from "./AllGoodResult";
import { FatigueResultView } from "./FatigueResultView";
import { GatePhase } from "./GatePhase";
import { QUESTIONS } from "./questions";
import { QuizPhase } from "./QuizPhase";
import { calculateResult } from "./results";
import type { Phase } from "./types";

export function ScoreFatigueShell() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inTransition, setInTransition] = useState(false);

  const result = Object.keys(answers).length < QUESTIONS.length ? null : calculateResult(answers);

  const isLastQuestion = questionIndex === QUESTIONS.length - 1;

  function handleSelectOption(value: string) {
    if (inTransition) return;
    setInTransition(true);

    const newAnswers = { ...answers, [QUESTIONS[questionIndex].id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (isLastQuestion) {
        setPhase("gate");
      } else {
        setQuestionIndex((i) => i + 1);
      }
      setInTransition(false);
    }, 450);
  }

  function handleGoBack() {
    if (questionIndex > 0 && !inTransition) {
      setQuestionIndex((i) => i - 1);
    }
  }

  if (phase === "quiz") {
    return (
      <QuizPhase
        questionIndex={questionIndex}
        answers={answers}
        inTransition={inTransition}
        onSelect={handleSelectOption}
        onGoBack={handleGoBack}
      />
    );
  }

  if (phase === "gate") {
    return <GatePhase result={result} answers={answers} onSubmitted={() => setPhase("result")} />;
  }

  if (phase === "result" && result?.key === "all_good") {
    return <AllGoodResult />;
  }

  if (phase === "result" && result) {
    return <FatigueResultView result={result} />;
  }

  return null;
}
