import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';

type AzureSynthesizerType = sdk.SpeechSynthesizer | null;

let azureSynthesizer: AzureSynthesizerType = null;

const initAzureSynthesizer = () => {
  azureSynthesizer = null;
  if (!process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || !process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION)
    return;
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
  );
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  azureSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
};

const speak = (text: string) => {
  if (azureSynthesizer)
    azureSynthesizer.speakTextAsync(
      text,
      (result) => {
        if (result) {
          azureSynthesizer?.close();
          initAzureSynthesizer();
        }
      },
      (error) => {
        console.log(error);
        azureSynthesizer?.close();
        initAzureSynthesizer();
      },
    );
};

export const getVoicesList = async () => {
  if (!azureSynthesizer) initAzureSynthesizer();
  if (!azureSynthesizer) throw Error("Couldn't init Azure Synthesizer");
  try {
    const result = await azureSynthesizer.getVoicesAsync();
    if (result.errorDetails) {
      console.error('Error fetching voices: ', result.errorDetails);
      throw Error(result.errorDetails);
    }
    return result.voices;
  } catch (error) {
    console.error('Error fetching voices: ', error);
  }
};

export const setVoice = (shortName: sdk.VoiceInfo['shortName']) => {
  if (!azureSynthesizer) initAzureSynthesizer();
  if (!azureSynthesizer) throw Error("Couldn't init Azure Synthesizer");
  azureSynthesizer.properties.setProperty('SpeechServiceConnection_SynthVoice', shortName);
};

initAzureSynthesizer();

export { speak };
