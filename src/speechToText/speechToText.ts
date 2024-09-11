import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

let speechConfig: null | sdk.SpeechConfig;
const createSpeechConfig = () => {
  if (!(process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY && process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION))
    throw Error('error during speech config');

  speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
  );
  return speechConfig;
};

export const changeSpeechRecognizerLanguage = (locale: string) => {
  if (speechConfig) speechConfig.speechRecognitionLanguage = locale;
  const newSpeechConfig = createSpeechConfig();
  newSpeechConfig.speechRecognitionLanguage = locale;
  speechConfig = newSpeechConfig;
};

export const getSpeechRecognizerLanguage = () => {
  if (!speechConfig) return null;
  return speechConfig.speechRecognitionLanguage;
};

const createOrGetSpeechConfig = () => {
  if (speechConfig) return speechConfig;
  return createSpeechConfig();
};

export const startSpeechRecognizer = () => {
  try {
    const speechConfig = createOrGetSpeechConfig();
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
  } catch (error) {
    throw error;
  }
};
