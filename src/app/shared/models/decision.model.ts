export interface Decision {
  label: string;
  options: string[];
  n: number;
  selectedOptions: string[];
  isComplete: boolean;
}