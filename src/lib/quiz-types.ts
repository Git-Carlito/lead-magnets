export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizResult {
  key: string;
  title: string;
  description: string;
}

export interface QuizData {
  slug: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  results: QuizResult[];
  getResult: (answers: Record<string, string>) => QuizResult;
}
