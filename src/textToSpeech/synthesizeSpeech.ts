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
  azureSynthesizer.properties.setProperty(
    'SpeechServiceConnection_SynthVoice',
    'en-US-BrianNeural',
  );
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
initAzureSynthesizer();

export { speak };
