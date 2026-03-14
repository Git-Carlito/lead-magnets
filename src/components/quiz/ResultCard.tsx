import type { QuizResult } from "@/lib/quiz-types";

interface ResultCardProps {
  result: QuizResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
      <h2 className="mb-2 text-2xl font-bold">{result.title}</h2>
      <p className="text-muted-foreground">{result.description}</p>
    </div>
  );
}
