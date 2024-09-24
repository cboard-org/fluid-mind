export type ReplySuggestion = {
  id: number;
  text: string;
  translation?: string;
  emoji: string;
};

export type ReplySuggestions = ReplySuggestion[];
