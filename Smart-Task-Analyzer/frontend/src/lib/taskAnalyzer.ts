export interface Task {
  id: string;
  title: string;
  due_date?: string;
  importance: number;
  estimated_hours: number;
  score?: number;
  explanation?: string;
dependencies?: number[];
}
export type SortingStrategy =
  | "fastest-wins"
  | "high-impact"
  | "deadline-driven"
  | "smart-balance";