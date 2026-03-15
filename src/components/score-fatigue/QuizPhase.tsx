import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { QUESTIONS } from "./questions";
import type { FatigueQuestion } from "./types";

export function QuizPhase({
  questionIndex,
  answers,
  inTransition,
  onSelect,
  onGoBack,
}: {
  questionIndex: number;
  answers: Record<string, string>;
  inTransition: boolean;
  onSelect: (value: string) => void;
  onGoBack: () => void;
}) {
  const currentQuestion: FatigueQuestion = QUESTIONS[questionIndex];
  const progressPct = (questionIndex / QUESTIONS.length) * 100;

  return (
    <div
      className={cn(
        "transition-all duration-300",
        inTransition ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between">
          <div className="w-16 flex-shrink-0">
            {questionIndex > 0 && (
              <button
                onClick={onGoBack}
                disabled={inTransition}
                className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Retour
              </button>
            )}
          </div>

          <span className="text-muted-foreground text-center text-xs font-medium tracking-widest uppercase">
            Question {questionIndex + 1} / {QUESTIONS.length}
          </span>

          <div className="flex w-16 flex-shrink-0 justify-end">
            <span className="text-primary text-xs font-bold">{Math.round(progressPct)}%</span>
          </div>
        </div>
        <div className="bg-muted h-[3px] w-full overflow-hidden rounded-full">
          <div
            className="from-primary to-primary/40 h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <h2 className="text-foreground mb-8 text-base leading-snug font-bold md:text-2xl">
        {currentQuestion.question}
      </h2>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => {
          const isSelected = answers[currentQuestion.id] === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              disabled={inTransition}
              className={cn(
                "group w-full cursor-pointer rounded-2xl border px-5 py-4 text-left text-sm leading-snug transition-all duration-150 disabled:cursor-not-allowed",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-foreground/80 hover:border-primary hover:bg-primary/10 hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-150",
                    isSelected
                      ? "border-primary bg-primary border-2"
                      : "border-muted group-hover:border-primary border",
                  )}
                >
                  {isSelected && <div className="bg-foreground h-1.5 w-1.5 rounded-full" />}
                </div>
                <span>{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
