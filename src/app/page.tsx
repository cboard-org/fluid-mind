'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import ResponseDashboard from '@/src/components/ResponseDashboard/ResponseDashboard';
import { useState } from 'react';
import { Button } from '@fluentui/react-components';

export default function Home() {
  const [isListeningView, setIsListeningView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');

  const handleOnRecognizeText = (text: string) => {
    setRecognizedText(text);
    setIsListeningView(false);
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

        {!isListeningView && <ResponseDashboard />}
      </div>
    </main>
  );
}
