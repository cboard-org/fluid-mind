export type Suggestion = {
  id: number;
  text: string;
  short?: string;
  translation?: string;
  emoji?: string;
};

export type Suggestions = Suggestion[];
