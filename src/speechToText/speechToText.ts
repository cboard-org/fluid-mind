import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { getUserSTTLocale, setUserSTTLocale } from '@/src/services/locale';

let speechConfig: null | sdk.SpeechConfig;
const createSpeechConfig = async () => {
  if (!(process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY && process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION))
    throw Error('error during speech config');

  speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
  );
  const userLocale = await getUserSTTLocale();
  await changeSpeechRecognizerLanguage(userLocale);
  return speechConfig;
};

export const changeSpeechRecognizerLanguage = async (locale: string) => {
  if (speechConfig) {
    speechConfig.speechRecognitionLanguage = locale;
    setUserSTTLocale(locale);
    return;
  }
  const newSpeechConfig = await createSpeechConfig();
  newSpeechConfig.speechRecognitionLanguage = locale;
  await setUserSTTLocale(locale);
  speechConfig = newSpeechConfig;
};

export const getSpeechRecognizerLanguage = () => {
  if (!speechConfig) return null;
  return speechConfig.speechRecognitionLanguage;
};

const createOrGetSpeechConfig = async () => {
  if (speechConfig) return speechConfig;
  return await createSpeechConfig();
};

export const startSpeechRecognizer = async () => {
  try {
    const speechConfig = await createOrGetSpeechConfig();
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
  } catch (error) {
    throw error;
  }
};
