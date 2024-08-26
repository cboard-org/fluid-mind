export type Tone = 'Confident' | 'Empathetic' | 'Direct' | 'Witty' | 'Critical';
export type HowToReply = null | 'Agree' | 'Disagree' | 'Ask More info' | 'Change topic';

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

export type ReplyOptions = {
  tone: Tone;
  user_pref: string;
  selected_sentence: string;
  how_to_reply: HowToReply;
  is_finish: boolean;
  requested_change: string;
};

export type ReplyRequestBody = {
  chat_history: ChatHistory;
  sentence: string;
  tone: Tone;
  user_pref: string;
  selected_sentence: string;
  how_to_reply: HowToReply;
  is_finish: boolean;
  requested_change: string;
};
