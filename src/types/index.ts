export type Question = {
  ch_question: string;
  question: string;
  tag: string;
  frequency: string;
  finished: boolean;
  marked: boolean;
  id: number;
};

export type Day = {
  day: number;
  questions: Question[];
};
