'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import ResponseDashboard from '@/src/components/ResponseDashboard/ResponseDashboard';
import { useState } from 'react';
import { Button, Label } from '@fluentui/react-components';
import { SlideMicrophone32Regular } from '@fluentui/react-icons';
import type {
  CommonBodyOptions,
  ReplyOptions,
  ReplyRequestBody,
  ChatHistory,
  HowToReply,
  Tone,
  TalkRequestBody,
} from '@/src/commonTypes/replyOptions';
import type { ReplySuggestion, ReplySuggestions } from '@/src/commonTypes/replySuggestions';
import { speak } from '@/textToSpeech/synthesizeSpeech';
import { useLocale, useTranslations } from 'next-intl';
import enUsMessages from '@/src/../messages/en-US.json';
import { WordPerMinuteCalculator } from '@/src/components/Helpers/wordsPerMinuteCalculator';

const LocaleSwitcher = enUsMessages.LocaleSwitcher;

const wpmCalculator = new WordPerMinuteCalculator();

export default function Home() {
  const [isListeningView, setIsListeningView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const appLocale = useLocale();
  const language = LocaleSwitcher[appLocale as keyof typeof LocaleSwitcher];
  const [commonOptions, setCommonOptions] = useState<CommonBodyOptions>({
    user_pref: `Alex Johnson, born July 12, 1985, is an American software engineer residing in Austin, Texas. Raised in Seattle, his parents are Michael, a retired teacher, and Laura, a freelance graphic designer. He has one sister, Emily, a veterinarian in Portland. Alex is married to Rachel, an elementary school teacher, and they have two children: Oliver (2014) and Lily (2017). 

Alex holds a Computer Science degree from the University of Washington (2007) and works as a Senior Software Engineer in Austin, specializing in machine learning and UX design. He previously worked at a Seattle startup before relocating in 2012. 

He enjoys hiking, playing guitar, cooking, and traveling. Notable trips include Europe (2018), South America (2021), and Japan (2023). He’s also a rock climber and volunteers in tech education for kids. 

Alex is highly organized at home, with designated spaces for essentials like work documents, kitchen items, and kids' toys. He has Type 1 Diabetes, using an insulin pump and continuous glucose monitor for management, maintaining an active lifestyle despite his condition. `,
    lang: language || 'English (United States)',
    chat_history: [],
    tone: 'Friendly',
    keywords: '',
    how_to_respond: null,
  });
  const [replyOptions, setReplyOptions] = useState<ReplyOptions>({
    selected_sentence: '',
    is_rag: false,
    is_suggest: false,
    is_finish: false,
    requested_change: '',
  });
  const [chatHistory, setChatHistory] = useState<ChatHistory>([]);

  const nullHowToReplySuggestions = [null, null, null, null];
  const [howToReplySuggestions, setHowToReplySuggestions] = useState<ReplySuggestions | null[]>(
    nullHowToReplySuggestions,
  );

  const nullRepliesSuggestions = [null, null, null, null];
  const [repliesSuggestions, setRepliesSuggestions] = useState<ReplySuggestions | null[]>(
    nullRepliesSuggestions,
  );

  const [talkSuggestions, setTalkSuggestions] = useState<ReplySuggestions | null[]>(
    nullRepliesSuggestions,
  );

  const [isReplying, setIsReplying] = useState(false);

  //Fetches reply suggestions for a given sentence using ASM
  const fetchWithSentence = async (sentence: string) => {
    const requestBody = {
      ...commonOptions,
      ...replyOptions,
      sentence,
      chat_history: [],
      is_suggest: true,
    };
    setHowToReplySuggestions(nullHowToReplySuggestions);
    const response = await fetchSuggestions(requestBody);
    const answer = JSON.parse(response.answer);
    const howToReplySuggestions = answer.replies;
    setHowToReplySuggestions(howToReplySuggestions);
  };
  //Get text from speech recognition
  const handleOnRecognizeText = async ({ text = '' }: { text: string }) => {
    wpmCalculator.startTimer();
    if (isReplying) return console.log(`ignored: ${text}`);
    setRecognizedText((prevRecognition) => {
      const sentence = `${prevRecognition} ${text}`;
      if (!isUserComposing) {
        setIsListeningView(false);
        fetchWithSentence(sentence);
      }
      return sentence;
    });
  };

  const fetchSuggestions = async (requestBody: ReplyRequestBody) => {
    setRepliesSuggestions(nullRepliesSuggestions);
    const requestHeaders = new Headers({ 'Content-Type': 'application/json' });

    const body: string = JSON.stringify(requestBody);

    const response = await fetch('/api/flow', {
      method: 'POST',
      headers: requestHeaders,
      body: body,
    });
    return await response.json();
  };

  //Fetches final response for a given sentence using RAG
  const handleHowToReplyClick = async (how_to_respond: HowToReply, keywords: string) => {
    setIsReplying(true);
    const requestBody: ReplyRequestBody = {
      ...commonOptions,
      ...replyOptions,
      how_to_respond,
      keywords,
      sentence: recognizedText,
      chat_history: chatHistory,
      is_rag: true,
    };

    try {
      const response = await fetchSuggestions(requestBody);
      const answer = JSON.parse(response.replies);
      const replies = answer.replies;
      if (!replies) throw Error('empty suggestions returned');
      setRepliesSuggestions(replies);
    } catch (error) {
      console.error(error);
    }
  };
  //Fetches edited sentence using Edit 
  const handleSuggestionEditClick = async ({
    selected_sentence,
    requested_change,
  }: {
    selected_sentence: string;
    requested_change: string;
  }) => {
    setReplyOptions((prevOptions) => ({ ...prevOptions, selected_sentence, requested_change }));

    const requestBody: ReplyRequestBody = {
      ...commonOptions,
      ...replyOptions,
      sentence: recognizedText,
      selected_sentence,
      requested_change,
      chat_history: chatHistory,
      is_finish: true,
    };

    try {
      const response = await fetchSuggestions(requestBody);
      const changed = JSON.parse(response.changed);
      setRepliesSuggestions(changed.replies);
    } catch (error) {
      console.error(error);
    }
  };

  const changeToListening = () => {
    // setRepliesSuggestions(nullRepliesSuggestions);
    setIsReplying(false);
    setIsListeningView(true);
  };

  const handleSuggestionPlayClick = (suggestion: ReplySuggestion) => {
    console.log(`SPEAK: ${suggestion.text}`);
    wpmCalculator.finishTimer();
    console.log(`WPM: ${wpmCalculator.calculateWpm(suggestion.text)}`);
    //Log average
    console.log(`Average WPM: ${wpmCalculator.calculateAverageWpm()}`);

    speak(suggestion.text);
    setChatHistory((prevChatHistory) =>
      prevChatHistory.concat([
        {
          inputs: { sentence: recognizedText },
          outputs: { answer: suggestion.text, changed: null },
        },
      ]),
    );
    setTalkSuggestions([null, null, null, null]);
    changeToListening();
    setRecognizedText('');
    setIsUserComposing(false);
  };

  const fetchTalkSuggestions = async (requestBody: TalkRequestBody) => {
    setRepliesSuggestions(nullRepliesSuggestions);
    const requestHeaders = new Headers({ 'Content-Type': 'application/json' });

    const body: string = JSON.stringify(requestBody);

    const response = await fetch('/api/talk', {
      method: 'POST',
      headers: requestHeaders,
      body: body,
    });
    return await response.json();
  };

  const handleSetHowToReply = ({
    how_to_respond,
    keywords,
  }: {
    how_to_respond: CommonBodyOptions['how_to_respond'];
    keywords: CommonBodyOptions['keywords'];
  }) => {
    setCommonOptions((replyOptions) => ({
      ...replyOptions,
      how_to_respond,
      keywords,
    }));
  };

  const handleToneChange = (tone: Tone) => {
    setCommonOptions((replyOptions) => ({
      ...replyOptions,
      tone,
    }));
  };

  const [isUserComposing, setIsUserComposing] = useState(false);
  const handleHowToTalkClick = async (how_to_respond: HowToReply, keywords: string) => {
    setIsReplying(true);
    const requestBody: TalkRequestBody = {
      ...commonOptions,
      how_to_respond,
      keywords,
      sentence: recognizedText,
      chat_history: chatHistory,
    };

    try {
      const response = await fetchTalkSuggestions(requestBody);
      console.log(response);
      const answer = JSON.parse(response.answer);
      console.log(answer);
      const replies = answer.replies;
      if (!replies) throw Error('empty suggestions returned');
      setTalkSuggestions(replies);
    } catch (error) {
      console.error(error);
    }
  };

  const intentions = [
    { id: 1, text: 'Make a Statement' },
    { id: 2, text: 'Ask a Question' },
    { id: 3, text: 'Social Interaction' },
    { id: 4, text: 'Make Plans' },
  ];

  const changeToReply = () => {
    setIsListeningView(false);
    fetchWithSentence(recognizedText);
  };

  const t = useTranslations('Home');

  return (
    <main className={styles.main}>
      <div className={styles.recognizedTextContainer}>
        {!isListeningView && (
          <Button
            appearance="primary"
            className={styles.listenButton}
            onClick={() => {
              changeToListening();
              setIsUserComposing(true);
            }}
          >
            {t('SpeakButton')}
          </Button>
        )}
        {isListeningView && recognizedText.length > 0 && (
          <Button
            appearance="primary"
            className={styles.listenButton}
            onClick={() => {
              changeToReply();
            }}
          >
            {t('ReplyButton')}
          </Button>
        )}
        <SpeechRecognition
          show={isListeningView}
          setRecognizedText={setRecognizedText}
          onRecognizeText={handleOnRecognizeText}
        />
        <div className={styles.recognizedText}>
          <SlideMicrophone32Regular />
          <Label size="large">{recognizedText}</Label>
        </div>
      </div>
      <div className={styles.controlContainer}>
        {!isListeningView && (
          <ResponseDashboard
            howToReplySuggestions={howToReplySuggestions}
            onSetHowTo={handleSetHowToReply}
            selectedTone={commonOptions.tone}
            onToneChange={handleToneChange}
            onHowToReplyClick={handleHowToReplyClick}
            suggestions={repliesSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
          />
        )}
        {isListeningView && (
          <ResponseDashboard
            howToReplySuggestions={intentions}
            onSetHowTo={handleSetHowToReply}
            selectedTone={commonOptions.tone}
            onToneChange={handleToneChange}
            onHowToReplyClick={handleHowToTalkClick}
            suggestions={talkSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
          />
        )}
      </div>
    </main>
  );
}
