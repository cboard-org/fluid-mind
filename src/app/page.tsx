'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import ResponseDashboard from '@/src/components/ResponseDashboard/ResponseDashboard';
import { useState } from 'react';

export default function Home() {
  const [isListening, setIsListening] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');

  return (
    <main className={styles.main}>
      <div className={styles.recognizedTextContainer}>
        <div className={styles.recognizedText}>
          <p>{recognizedText}</p>
        </div>
      </div>
      <div className={styles.controlContainer}>
        {isListening ? (
          <SpeechRecognition
            setIsListening={setIsListening}
            isListening={isListening}
            setRecognizedText={setRecognizedText}
          />
        ) : (
          <ResponseDashboard />
        )}
      </div>
    </main>
  );
}
