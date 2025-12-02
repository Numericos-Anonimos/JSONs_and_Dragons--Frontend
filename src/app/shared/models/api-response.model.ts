export interface ApiResponse {
  message: string;
  required_decision?: {
    label: string;
    options: string[];
    n: number;
  } | null;
}