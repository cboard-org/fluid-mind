'use client';
import { useEffect, useRef, useState } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Button } from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import { startSpeechRecognizer } from '@/src/speechToText/speechToText';

type Props = {
  show: boolean;
  setRecognizedText: (text: string) => void;
  onRecognizeText: ({ text }: { text: string }) => void;
};

export default function SpeechRecognition({ show, setRecognizedText, onRecognizeText }: Props) {
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const recognizer = recognizerRef.current;
    if (!recognizer) return;
    setIsListening(true);
    // recognizer.recognizing = (s, e) => {
    //   if (!show) return;
    //   //setRecognizedText(e.result.text);
    // };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        onRecognizeText({ text: e.result.text });
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
    try {
      const recognizer = await startSpeechRecognizer();
      recognizerRef.current = recognizer;

      // recognizer.recognizing = (s, e) => {
      //   if (!show) return;
      //   setRecognizedText(e.result.text);
      // };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          console.log(`RECOGNIZED: ${e.result.text}`);
          if (!show) return;
          onRecognizeText({ text: e.result.text });
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
    } catch {
      const errorMessage = 'error during start listening';
      console.error(errorMessage);
    }
  };

  const stopListening = async () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
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

  const translations = useTranslations('SpeechRecognition');

  if (!show) return;

  if (isListening) return null;
  return (
    <Button onClick={handleListenButton} size="large">
      {isListening ? translations('StopListening') : translations('StartListening')}
    </Button>
  );
}
