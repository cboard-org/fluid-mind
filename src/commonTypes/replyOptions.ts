export type Tone = 'Confident' | 'Empathetic' | 'Direct' | 'Witty' | 'Critical';
export type HowToReply = null | 'Agree' | 'Disagree' | 'Ask More info' | 'Change topic';

export type ReplyOptions = {
  tone: Tone;
  user_pref: string;
  selected_sentence: string;
  how_to_reply: HowToReply;
  is_finish: boolean;
  requested_change: string;
};

export type ReplyRequestBody = {
  chat_history: string[];
  sentence: string;
  tone: Tone;
  user_pref: string;
  selected_sentence: string;
  how_to_reply: HowToReply;
  is_finish: boolean;
  requested_change: string;
};
