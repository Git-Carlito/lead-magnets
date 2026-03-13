import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/quiz-types";

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (value: string) => void;
  selectedValue?: string;
}

export function Question({ question, onAnswer, selectedValue }: QuestionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.question}</h2>
      <div className="grid gap-3">
        {question.options.map((option) => (
          <Button
            key={option.value}
            variant={selectedValue === option.value ? "default" : "outline"}
            size="lg"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={() => onAnswer(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
