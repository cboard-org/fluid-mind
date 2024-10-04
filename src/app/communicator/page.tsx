'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';
import CommunicatorInterface from '@/src/components/CommunicatorInterface/CommunicatorInterface';
import { useRef, useState } from 'react';
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
} from '@/src/commonTypes/communicatorModelsOptions';
import type { Suggestion, Suggestions } from '@/src/commonTypes/suggestions';
import { speak } from '@/textToSpeech/synthesizeSpeech';
import { useLocale, useTranslations } from 'next-intl';
import enUsMessages from '@/src/../messages/en-US.json';
import KeywordsField from '@/src/components/KeywordsField/keywordsField';
import { createWpmCalculator } from '@/src/utils/wordPerMinuteCalculator';

const LocaleSwitcher = enUsMessages.LocaleSwitcher;

let wpmCalculator = createWpmCalculator();

export default function Home() {
  const [isSpeakView, setIsSpeakView] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');
  const appLocale = useLocale();
  const language = LocaleSwitcher[appLocale as keyof typeof LocaleSwitcher];
  const [commonOptions, setCommonOptions] = useState<CommonBodyOptions>({
    user_pref: ``, // Add here the user biography
    lang: language || 'English (United States)',  
    chat_history: [],
    tone: 'Friendly', //Set the default tone
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
  const [howToReplySuggestions, setHowToReplySuggestions] = useState<Suggestions | null[]>(
    nullHowToReplySuggestions,
  );

  const nullRepliesSuggestions = [null, null, null, null];
  const [repliesSuggestions, setRepliesSuggestions] = useState<Suggestions | null[]>(
    nullRepliesSuggestions,
  );

  const [speakSuggestions, setSpeakSuggestions] = useState<Suggestions | null[]>(
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
    if (!response) return;
    const answer = JSON.parse(response.answer);
    const removeEmojis = (text: string) =>
      text.replace(/[\p{Extended_Pictographic}\u2600-\u26FF]/gu, '');
    const howToReplySuggestions = answer.replies.map(
      ({ text, short }: { text: string; short: string }) => {
        return {
          text: removeEmojis(text),
          short: removeEmojis(short),
        };
      },
    );

    setHowToReplySuggestions(howToReplySuggestions);
  };

  /**
 * Handles the event when text is recognized.
 * If the user is currently replying, ignores the recognized text.
 * Updates the recognized text by appending the new text to the previous recognition.
 *
 * @param {Object} params - The event parameters.
 * @param {string} params.text - The recognized text.
 */
  const handleOnRecognizeText = async ({ text = '' }: { text: string }) => {
    wpmCalculator = wpmCalculator.start();
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

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = async (requestBody: ReplyRequestBody) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    setRepliesSuggestions(nullRepliesSuggestions);
    const requestHeaders = new Headers({ 'Content-Type': 'application/json' });

    const body: string = JSON.stringify(requestBody);

    try {
      const response = await fetch('/api/flow', {
        method: 'POST',
        headers: requestHeaders,
        body: body,
        signal,
      });
      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      throw error;
    }
  };

  /**
 * Handles the click event to show how to reply suggestions.
 * Sends a request to the server to fetch new suggestions based on the how to respond value.
 * Updates the replies suggestions with the new suggestions from the server.
 *
 * @param {HowToReply} how_to_respond - The selected how to respond value.
 */
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
      if (!response) return;
      const answer = JSON.parse(response.replies);
      const replies = answer.replies;
      if (!replies) throw Error('empty suggestions returned');
      setRepliesSuggestions(replies);
    } catch (error) {
      console.error(error);
    }
  };

  /**
 * Handles the edit click event on a suggestion.
 * Sends a request to the server to fetch new suggestions based on the edited sentence.
 * Updates the replies and speak suggestions with the new suggestions from the server.
 *
 * @param {Object} params - The event parameters.
 * @param {string} params.selected_sentence - The sentence to be edited.
 * @param {string} params.requested_change - The requested change to the sentence.
 */
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
      if (!response) return;
      const changed = JSON.parse(response.changed);
      setRepliesSuggestions(changed.replies);
      setSpeakSuggestions(changed.replies);
    } catch (error) {
      console.error(error);
    }
  };

  const backToInitialView = () => {
    setIsSpeakView(true);
    setIsReplying(false);
    setIsUserComposing(false);
    setSpeakSuggestions(nullRepliesSuggestions);
    setRepliesSuggestions(nullRepliesSuggestions);
  };

  const changeToSpeakView = () => {
    setSpeakSuggestions(nullRepliesSuggestions);
    setRepliesSuggestions(nullRepliesSuggestions);
    setIsReplying(false);
    setIsSpeakView(true);
  };
  /**
 * This function is called when a suggestion is played.
 * Logs the WPM and average WPM to the console.
 * It speaks the suggestion text using the speak function.
 * It updates the chat history with the suggestion text.
 *
 * @param {Suggestion} suggestion - The suggestion to be played.
 */
  const handleSuggestionPlayClick = (suggestion: Suggestion) => {
    console.log(`SPEAK: ${suggestion.text}`);
    wpmCalculator = wpmCalculator.finish();  // returns a new instance with the finish time
    const wpm = wpmCalculator.calculateWpm(suggestion.text);
    console.log(`WPM: ${wpm}`);
    console.log(`Average WPM: ${wpmCalculator.calculateAvearageWpm()}`);
    speak(suggestion.text);
    setChatHistory((prevChatHistory) =>
      prevChatHistory.concat([
        {
          inputs: { sentence: recognizedText },
          outputs: { answer: suggestion.text, changed: null },
        },
      ]),
    );
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
      const answer = JSON.parse(response.answer);
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
            backToInitialView={backToInitialView}
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
            backToInitialView={backToInitialView}
          />
        )}
      </div>
    </main>
  );
}
