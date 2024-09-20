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
  TalkOptions,
  Tone,
  TalkRequestBody,
} from '@/src/commonTypes/replyOptions';
import type { ReplySuggestion, ReplySuggestions } from '@/src/commonTypes/replySuggestions';
import { speak } from '@/textToSpeech/synthesizeSpeech';
import { useLocale, useTranslations } from 'next-intl';
import enUsMessages from '@/src/../messages/en-US.json';

const LocaleSwitcher = enUsMessages.LocaleSwitcher;

export default function Home() {
  const [isListeningView, setIsListeningView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const appLocale = useLocale();
  const language = LocaleSwitcher[appLocale as keyof typeof LocaleSwitcher];
  const [commonOptions, setCommonOptions] = useState<CommonBodyOptions>({
    user_pref: `Soy Hector y tengo una niña de 11 meses. soy un ingeniero biomedico y vivo en carlos paz`,
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

  const handleOnRecognizeText = async ({ text = '' }: { text: string }) => {
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
    if (isReplying) return console.log(`ignored: ${text}`);
    setRecognizedText((prevRecognition) => {
      const sentence = isListeningView ? text : `${prevRecognition} ${text}`;
      setIsListeningView(false);
      fetchWithSentence(sentence);
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
    setRecognizedText('');
    // setRepliesSuggestions(nullRepliesSuggestions);
    setIsReplying(false);
    setIsListeningView(true);
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

  const [isSpeakView] = useState(false);
  const [talkOptions] = useState<TalkOptions>({
    sentence: '', //Send an empty sentence if it is the first, send the last sentence if the user selects a sentence from the chat history.
  });
  const handleHowToTalkClick = async (how_to_respond: HowToReply, keywords: string) => {
    setIsReplying(true);
    const requestBody: TalkRequestBody = {
      ...commonOptions,
      ...talkOptions,
      how_to_respond,
      keywords,
      sentence: '',
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
    { id: 1, text: 'Ask a Question' },
    { id: 1, text: 'Social Interaction' },
    { id: 1, text: 'Make Plans' },
  ];

  const t = useTranslations('Home');

  return (
    <main className={styles.main}>
      <div className={styles.recognizedTextContainer}>
        {!isListeningView && (
          <Button appearance="primary" className={styles.listenButton} onClick={changeToListening}>
            {t('ListenButton')}
          </Button>
        )}
        <div className={styles.recognizedText}>
          <SlideMicrophone32Regular />
          <Label size="large">{recognizedText}</Label>
        </div>
      </div>
      <div className={styles.controlContainer}>
        <SpeechRecognition
          show={isListeningView}
          setRecognizedText={setRecognizedText}
          onRecognizeText={handleOnRecognizeText}
        />

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
        {isSpeakView && (
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
