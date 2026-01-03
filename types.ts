
export interface TimerState {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  minutesInput: number;
}

export interface QuoteData {
  text: string;
  author: string;
}
