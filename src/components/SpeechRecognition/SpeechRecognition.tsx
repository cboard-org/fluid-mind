'use client';
import { useEffect, useRef, useState } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Button } from '@fluentui/react-components';
import MicAnimation from './MicAnimation';
import styles from './SpeechRecognition.module.css';

type Props = {
  show: boolean;
  setRecognizedText: (text: string) => void;
  onRecognizeText: (text: string) => void;
};

export default function SpeechRecognition({ show, setRecognizedText, onRecognizeText }: Props) {
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const recognizer = recognizerRef.current;
    if (!recognizer) return;
    recognizer.recognizing = (s, e) => {
      if (!show) return;
      setRecognizedText(e.result.text);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
        if (!show) return;
        onRecognizeText(e.result.text);
        setIsListening(false);
        // if (recognizer) recognizer.stopContinuousRecognitionAsync();
      }
    };
    // recognizer.startContinuousRecognitionAsync();
  }, [show, setRecognizedText, onRecognizeText, setIsListening]);

  useEffect(() => {
    // Clean up the recognizer when the component unmounts
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, []);

  const startListening = async () => {
    if (!(process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY && process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION))
      return;
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
    );
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizerRef.current = recognizer;

    recognizer.recognizing = (s, e) => {
      if (!show) return;
      setRecognizedText(e.result.text);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: ${e.result.text}`);
        if (!show) return;
        onRecognizeText(e.result.text);
        setIsListening(false);
      }
    };

    recognizer.canceled = (s, e) => {
      console.log(`CANCELED: Reason=${e.reason}`);
      if (e.reason === sdk.CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log('CANCELED: Did you update the subscription info?');
      }
      stopListening();
    };

    recognizer.sessionStopped = () => {
      console.log('Microphone stopped');
      stopListening();
    };

    recognizer.startContinuousRecognitionAsync();
    setIsListening(true);
  };

  const stopListening = async () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
      recognizerRef.current.close();
      recognizerRef.current = null;
    }
    setIsListening(false);
  };

  const handleListenButton = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!show) return;

  return (
    <div className={styles.container}>
      <MicAnimation isActive={isListening} />
      <Button onClick={handleListenButton} size="large">
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </Button>
    </div>
  );
}
