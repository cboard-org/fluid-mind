'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import ResponseDashboard from '@/src/components/ResponseDashboard/ResponseDashboard';
import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import type { ReplyOptions, ReplyRequestBody } from '@/src/commonTypes/replyOptions';
import { ReplySuggestions } from '@/src/commonTypes/replySuggestions';

export default function Home() {
  const [isListeningView, setIsListeningView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const [replyOptions, setReplyOptions] = useState<ReplyOptions>({
    tone: 'Direct',
    user_pref: `Im Hector and I have one 8-month old little girl. Im Biomedical engineer
      and I live in Carlos Paz. `,
    selected_sentence: '-',
    how_to_reply: null,
    is_finish: false,
    requested_change: '-',
  });

  const [repliesSuggestions, setRepliesSuggestions] = useState<ReplySuggestions | null>(null);

  const handleOnRecognizeText = (text: string) => {
    setRecognizedText(text);
    setIsListeningView(false);
  };

  const handleHowToReplyClick = async () => {
    const requestBody: ReplyRequestBody = {
      ...replyOptions,
      sentence: recognizedText,
      chat_history: [],
    };
    const requestHeaders = new Headers({ 'Content-Type': 'application/json' });

    const body: string = JSON.stringify(requestBody);
    try {
      const response = await fetch('/api/flow', {
        method: 'POST',
        headers: requestHeaders,
        body: body,
      });
      const { answer } = await response.json();
      const answerObj = JSON.parse(answer);
      const replies = answerObj.replies;
      if (!replies) throw Error('empty suggestions returned');
      setRepliesSuggestions(replies);
    } catch (error) {
      console.error(error);
    }
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
            setReplyOptions={setReplyOptions}
            replyOptions={replyOptions}
            onHowToReplyClick={handleHowToReplyClick}
          />
        )}
      </div>
    </main>
  );
}
