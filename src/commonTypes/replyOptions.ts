export type Tone = 'Friendly' | 'Professional' | 'Empathetic' | 'Sarcastic' | 'Inquisitive' | '';
export type HowToReply = null | string;

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

export type CommonBodyOptions = {
  user_pref: string;
  lang: string;
  chat_history: ChatHistory;
  tone: Tone;
  keywords: string;
  how_to_respond: HowToReply;
};

export type ReplyOptions = {
  selected_sentence: string;
  requested_change: string;
} & ModelOptions;

export type ReplyRequestBody = {
  sentence: string;
} & ReplyOptions &
  CommonBodyOptions;

export type TalkOptions = {
  sentence: string; //Send an empty sentence if it is the first, send the last sentence if the user selects a sentence from the chat history.
};

export type TalkRequestBody = TalkOptions & CommonBodyOptions;
