'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import ResponseDashboard from '@/src/components/ResponseDashboard/ResponseDashboard';
import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import type {
  ReplyOptions,
  ReplyRequestBody,
  ChatHistory,
  HowToReply,
} from '@/src/commonTypes/replyOptions';
import type { ReplySuggestion, ReplySuggestions } from '@/src/commonTypes/replySuggestions';
import { speak } from '../textToSpeech/synthesizeSpeech';

export default function Home() {
  const [isListeningView, setIsListeningView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const [replyOptions, setReplyOptions] = useState<ReplyOptions>({
    tone: 'Friendly',
    user_pref: `Im Hector and I have one 8-month old little girl. Im Biomedical engineer
      and I live in Carlos Paz. `,
    selected_sentence: '',
    how_to_respond: null,
    keywords: '',
    is_rag: false,
    is_suggest: false,
    is_finish: false,
    requested_change: '',
  });
  const [chatHistory, setChatHistory] = useState<ChatHistory>([]);

  const nullHowToReplySuggestions = [null, null, null, null];
  const [howToReplySuggestions, setHowToReplySuggestions] = useState<ReplySuggestions | null[]>(
    nullHowToReplySuggestions,
  );

  const nullRepliesSuggestions = [null, null, null, null];
  const [repliesSuggestions, setRepliesSuggestions] = useState<ReplySuggestions | null[]>(
    nullRepliesSuggestions,
  );

  const handleOnRecognizeText = async (text: string) => {
    setRecognizedText(text);
    setIsListeningView(false);
    const requestBody = {
      ...replyOptions,
      sentence: text,
      chat_history: [],
      is_suggest: true,
    };
    setHowToReplySuggestions(nullHowToReplySuggestions);
    const response = await fetchSuggestions(requestBody);
    const answer = JSON.parse(response.answer);
    const howToReplySuggestions = answer.replies;
    setHowToReplySuggestions(howToReplySuggestions);
  };

  const fetchSuggestions = async (requestBody: ReplyRequestBody) => {
    setRepliesSuggestions(nullRepliesSuggestions);
    const requestHeaders = new Headers({ 'Content-Type': 'application/json' });

    const body: string = JSON.stringify(requestBody);

    const response = await fetch('/api/flow', {
      method: 'POST',
      headers: requestHeaders,
      body: body,
    });
    return await response.json();
  };

  const handleHowToReplyClick = async (how_to_respond: HowToReply, keywords: string) => {
    const requestBody: ReplyRequestBody = {
      ...replyOptions,
      how_to_respond,
      keywords,
      sentence: recognizedText,
      chat_history: chatHistory,
      is_rag: true,
    };

    try {
      const response = await fetchSuggestions(requestBody);
      const answer = JSON.parse(response.replies);
      const replies = answer.replies;
      if (!replies) throw Error('empty suggestions returned');
      setRepliesSuggestions(replies);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuggestionEditClick = async ({
    selected_sentence,
    requested_change,
  }: {
    selected_sentence: string;
    requested_change: string;
  }) => {
    setReplyOptions((prevOptions) => ({ ...prevOptions, selected_sentence, requested_change }));

    const requestBody: ReplyRequestBody = {
      ...replyOptions,
      sentence: recognizedText,
      selected_sentence,
      requested_change,
      chat_history: chatHistory,
      is_finish: true,
    };

    try {
      const response = await fetchSuggestions(requestBody);
      const changed = JSON.parse(response.changed);
      setRepliesSuggestions(changed.replies);
    } catch (error) {
      console.error(error);
    }
  };

  const changeToListening = () => {
    setRecognizedText('');
    // setRepliesSuggestions(nullRepliesSuggestions);
    setIsListeningView(true);
  };

  const handleSuggestionPlayClick = (suggestion: ReplySuggestion) => {
    console.log(`SPEAK: ${suggestion.text}`);
    speak(suggestion.text);
    setChatHistory((prevChatHistory) =>
      prevChatHistory.concat([
        {
          inputs: { sentence: recognizedText },
          outputs: { answer: suggestion.text, changed: null },
        },
      ]),
    );
    changeToListening();
  };

  return (
    <main className={styles.main}>
      <div className={styles.recognizedTextContainer}>
        <div className={styles.recognizedText}>
          <p>{recognizedText}</p>
        </div>
        {!isListeningView && <Button onClick={() => setIsListeningView(true)}>Listen</Button>}
      </div>
      <div className={styles.controlContainer}>
        <SpeechRecognition
          show={isListeningView}
          setRecognizedText={setRecognizedText}
          onRecognizeText={handleOnRecognizeText}
        />

        {!isListeningView && (
          <ResponseDashboard
            howToReplySuggestions={howToReplySuggestions}
            setReplyOptions={setReplyOptions}
            replyOptions={replyOptions}
            onHowToReplyClick={handleHowToReplyClick}
            suggestions={repliesSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
          />
        )}
      </div>
    </main>
  );
}
