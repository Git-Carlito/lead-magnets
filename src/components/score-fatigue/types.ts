export type FatigueType = "physical" | "mental" | "emotional" | "social" | "neutral";
export type ActiveType = "physical" | "mental" | "emotional" | "social";
export type Phase = "quiz" | "gate" | "result";

export interface FatigueOption {
  label: string;
  value: string;
  type: FatigueType;
}

export interface FatigueQuestion {
  id: string;
  question: string;
  options: FatigueOption[];
}

export interface ActionItem {
  title: string;
  description: string;
}

export interface FatigueResult {
  key: string;
  title: string;
  badge: string;
  signals: string[];
  risksIntro: string;
  risks: string[];
  actions: ActionItem[];
}
