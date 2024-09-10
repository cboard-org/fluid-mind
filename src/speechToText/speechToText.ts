import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const getSpeechConfig = () => {
  if (!(process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY && process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION))
    throw Error('error during speech config');

  return sdk.SpeechConfig.fromSubscription(
    process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
  );
};

export const startSpeechRecognizer = () => {
  try {
    const speechConfig = getSpeechConfig();
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
  } catch (error) {
    throw error;
  }
};
