export interface Choice {
  label: string;
  // opcoes: string[] | { action: string; query: string };
  opcoes: {action: string; query: string };
  n: number;
  tam: number;
  relacao: number[];
  offsets: number[];
}