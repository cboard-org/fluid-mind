export type Tone = 'Confident' | 'Empathetic' | 'Direct' | 'Witty' | 'Critical' | '';
export type HowToReply = null | 'Agree' | 'Disagree' | 'Ask More info' | 'Change topic' | '';

export type HistoryItem = {
  inputs: {
    sentence: string;
  };
  outputs: {
    answer: string;
    changed: null;
  };
};

export type ChatHistory = HistoryItem[];

type ModelOptions = {
  is_finish: boolean;
  is_suggest: boolean;
  is_rag: boolean;
};

export type ReplyOptions = {
  tone: Tone;
  user_pref: string;
  selected_sentence: string;
  how_to_reply: HowToReply;
  requested_change: string;
} & ModelOptions;

export type ReplyRequestBody = {
  chat_history: ChatHistory;
  sentence: string;
} & ReplyOptions;
