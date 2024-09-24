'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import CommunicatorInterface from '@/src/components/CommunicatorInterface/CommunicatorInterface';
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
  SpeakRequestBody,
} from '@/src/commonTypes/replyOptions';
import type { ReplySuggestion, ReplySuggestions } from '@/src/commonTypes/replySuggestions';
import { speak } from '@/textToSpeech/synthesizeSpeech';
import { useLocale, useTranslations } from 'next-intl';
import enUsMessages from '@/src/../messages/en-US.json';
import KeywordsField from '@/src/components/KeywordsField/keywordsField';

const LocaleSwitcher = enUsMessages.LocaleSwitcher;

export default function Home() {
  const [isSpeakView, setIsSpeakView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const appLocale = useLocale();
  const language = LocaleSwitcher[appLocale as keyof typeof LocaleSwitcher];
  const [commonOptions, setCommonOptions] = useState<CommonBodyOptions>({
    user_pref: ``,
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

  const [speakSuggestions, setSpeakSuggestions] = useState<ReplySuggestions | null[]>(
    nullRepliesSuggestions,
  );

  const [isReplying, setIsReplying] = useState(false);

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
  const handleOnRecognizeText = async ({ text = '' }: { text: string }) => {
    if (isReplying) return console.log(`ignored: ${text}`);
    setRecognizedText((prevRecognition) => {
      const sentence = `${prevRecognition} ${text}`;
      if (!isUserComposing) {
        setIsSpeakView(false);
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

  const handleHowToReplyClick = async (how_to_respond: HowToReply) => {
    setIsReplying(true);
    setCommonOptions((replyOptions) => ({
      ...replyOptions,
      how_to_respond,
    }));
    const requestBody: ReplyRequestBody = {
      ...commonOptions,
      ...replyOptions,
      how_to_respond,
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
    setSpeakSuggestions(nullRepliesSuggestions);
    setRepliesSuggestions(nullRepliesSuggestions);
    try {
      const response = await fetchSuggestions(requestBody);
      const changed = JSON.parse(response.changed);
      setRepliesSuggestions(changed.replies);
      setSpeakSuggestions(changed.replies);
    } catch (error) {
      console.error(error);
    }
  };

  const changeToSpeakView = () => {
    // setRepliesSuggestions(nullRepliesSuggestions);
    setIsReplying(false);
    setIsSpeakView(true);
  };

  const handleSuggestionPlayClick = (suggestion: ReplySuggestion) => {
    console.log(`SPEAK: ${suggestion.text}`);
    speak(suggestion.text);
    setChatHistory((prevChatHistory) =>
      prevChatHistory.concat([
        {
          inputs: { sentence: recognizedText },
          outputs: { answer: suggestion.text, changed: null },
        },
      ]),
    );
    setSpeakSuggestions([null, null, null, null]);
    changeToSpeakView();
    setRecognizedText('');
    handleKeywordsChange('');
    setIsUserComposing(false);
  };

  const fetchSpeakSuggestions = async (requestBody: SpeakRequestBody) => {
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

  const handleToneChange = (tone: Tone) => {
    setCommonOptions((replyOptions) => ({
      ...replyOptions,
      tone,
    }));
  };

  const handleKeywordsChange = (keywords: string) => {
    setCommonOptions((replyOptions) => ({
      ...replyOptions,
      keywords,
    }));
  };

  const [isUserComposing, setIsUserComposing] = useState(false);
  const handleHowToSpeakClick = async (how_to_respond: HowToReply) => {
    setIsReplying(true);
    const requestBody: SpeakRequestBody = {
      ...commonOptions,
      how_to_respond,
      sentence: recognizedText,
      chat_history: chatHistory,
    };

    try {
      const response = await fetchSpeakSuggestions(requestBody);
      console.log(response);
      const answer = JSON.parse(response.answer);
      console.log(answer);
      const replies = answer.replies;
      if (!replies) throw Error('empty suggestions returned');
      setSpeakSuggestions(replies);
    } catch (error) {
      console.error(error);
    }
  };

  const changeToReply = () => {
    setIsSpeakView(false);
    fetchWithSentence(recognizedText);
  };

  const t = useTranslations('communicator');

  const intentions = [
    {
      id: 1,
      text: 'Make a statement',
      translation: t('SpeakIntentions.MakeStatement'),
      emoji: '💬',
    },
    { id: 2, text: 'Ask a question', translation: t('SpeakIntentions.AskQuestion'), emoji: '❓' },
    {
      id: 3,
      text: 'Social interaction',
      translation: t('SpeakIntentions.SocialInteraction'),
      emoji: '🤝',
    },
    { id: 4, text: 'Make plans', translation: t('SpeakIntentions.MakePlans'), emoji: '🗓️' },
  ];
  const keywordsField = (
    <KeywordsField keywords={commonOptions.keywords} setKeywords={handleKeywordsChange} />
  );

  return (
    <main className={styles.main}>
      <div className={styles.recognizedTextContainer}>
        {!isSpeakView && (
          <Button
            appearance="primary"
            className={styles.listenButton}
            onClick={() => {
              changeToSpeakView();
              setIsUserComposing(true);
            }}
          >
            {t('SpeakButton')}
          </Button>
        )}
        {isSpeakView && recognizedText.length > 0 && (
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
          show={isSpeakView}
          setRecognizedText={setRecognizedText}
          onRecognizeText={handleOnRecognizeText}
        />
        <div className={styles.recognizedText}>
          <SlideMicrophone32Regular />
          <Label size="large">{recognizedText}</Label>
        </div>
      </div>
      <div className={styles.controlContainer}>
        {!isSpeakView && (
          <CommunicatorInterface
            howToSuggestions={howToReplySuggestions}
            selectedTone={commonOptions.tone}
            onToneChange={handleToneChange}
            onHowToClick={handleHowToReplyClick}
            suggestions={repliesSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
            keywordsField={keywordsField}
          />
        )}
        {isSpeakView && (
          <CommunicatorInterface
            howToSuggestions={intentions}
            selectedTone={commonOptions.tone}
            onToneChange={handleToneChange}
            onHowToClick={handleHowToSpeakClick}
            suggestions={speakSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
            keywordsField={keywordsField}
          />
        )}
      </div>
    </main>
  );
}
