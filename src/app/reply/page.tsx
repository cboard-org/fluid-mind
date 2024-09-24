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
import KeywordsField from '@/src/components/KeywordsField/keywordsField';

const LocaleSwitcher = enUsMessages.LocaleSwitcher;

export default function Home() {
  const [isTalkView, setIsTalkView] = useState(true);
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

  const [talkSuggestions, setTalkSuggestions] = useState<ReplySuggestions | null[]>(
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
        setIsTalkView(false);
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
    setTalkSuggestions(nullRepliesSuggestions);
    setRepliesSuggestions(nullRepliesSuggestions);
    try {
      const response = await fetchSuggestions(requestBody);
      const changed = JSON.parse(response.changed);
      setRepliesSuggestions(changed.replies);
      setTalkSuggestions(changed.replies);
    } catch (error) {
      console.error(error);
    }
  };

  const changeToListening = () => {
    // setRepliesSuggestions(nullRepliesSuggestions);
    setIsReplying(false);
    setIsTalkView(true);
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
    setTalkSuggestions([null, null, null, null]);
    changeToListening();
    setRecognizedText('');
    handleKeywordsChange('');
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
  }: {
    how_to_respond: CommonBodyOptions['how_to_respond'];
  }) => {
    setCommonOptions((replyOptions) => ({
      ...replyOptions,
      how_to_respond,
    }));
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
  const handleHowToTalkClick = async (how_to_respond: HowToReply) => {
    setIsReplying(true);
    const requestBody: TalkRequestBody = {
      ...commonOptions,
      how_to_respond,
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

  const changeToReply = () => {
    setIsTalkView(false);
    fetchWithSentence(recognizedText);
  };

  const t = useTranslations('communicator');

  const intentions = [
    { id: 1, text: 'Make a statement', translation: t('SpeakIntentions.MakeStatement') },
    { id: 2, text: 'ask a question', translation: t('SpeakIntentions.AskQuestion') },
    { id: 3, text: 'social interaction', translation: t('SpeakIntentions.SocialInteraction') },
    { id: 4, text: 'make plans', translation: t('SpeakIntentions.MakePlans') },
  ];
  const keywordsField = (
    <KeywordsField keywords={commonOptions.keywords} setKeywords={handleKeywordsChange} />
  );

  return (
    <main className={styles.main}>
      <div className={styles.recognizedTextContainer}>
        {!isTalkView && (
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
        {isTalkView && recognizedText.length > 0 && (
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
          show={isTalkView}
          setRecognizedText={setRecognizedText}
          onRecognizeText={handleOnRecognizeText}
        />
        <div className={styles.recognizedText}>
          <SlideMicrophone32Regular />
          <Label size="large">{recognizedText}</Label>
        </div>
      </div>
      <div className={styles.controlContainer}>
        {!isTalkView && (
          <ResponseDashboard
            howToReplySuggestions={howToReplySuggestions}
            onSetHowTo={handleSetHowToReply}
            selectedTone={commonOptions.tone}
            onToneChange={handleToneChange}
            onHowToReplyClick={handleHowToReplyClick}
            suggestions={repliesSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
            keywordsField={keywordsField}
          />
        )}
        {isTalkView && (
          <ResponseDashboard
            howToReplySuggestions={intentions}
            onSetHowTo={handleSetHowToReply}
            selectedTone={commonOptions.tone}
            onToneChange={handleToneChange}
            onHowToReplyClick={handleHowToTalkClick}
            suggestions={talkSuggestions}
            onSuggestionPlayClick={handleSuggestionPlayClick}
            onSuggestionEditClick={handleSuggestionEditClick}
            keywordsField={keywordsField}
          />
        )}
      </div>
    </main>
  );
}
