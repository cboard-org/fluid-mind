import React, { type Dispatch, type SetStateAction, useState } from 'react';
import styles from './ResponseDashboard.module.css';
import type { HowToReply, ReplyOptions, Tone } from '@/src/commonTypes/replyOptions';
import { ReplySuggestions } from '@/src/commonTypes/replySuggestions';

type Props = {
  setReplyOptions: Dispatch<SetStateAction<ReplyOptions>>;
  replyOptions: ReplyOptions;
  onHowToReplyClick: (howToReply: HowToReply) => void;
  suggestions: ReplySuggestions | null[];
};

const ResponseDashboard: React.FC<Props> = ({
  setReplyOptions,
  replyOptions,
  onHowToReplyClick,
  suggestions,
}: Props) => {
  const [isSuggestionView, setIsSuggestionView] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleToneChange = (tone: Tone) => {
    setReplyOptions((currentValue) => {
      return { ...currentValue, tone };
    });
  };

  const handleSetHowToReply = (how_to_reply: HowToReply) => {
    setReplyOptions((replyOptions) => {
      return {
        ...replyOptions,
        how_to_reply,
      };
    });
    onHowToReplyClick(how_to_reply);
    setIsSuggestionView(true);
  };

  const handleClose = () => {
    // Logic to close the dashboard
  };

  const handlePlay = () => {
    // Logic to play
  };

  const HowToReplyView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.toneSection}>
        <div className={styles.toneLabel}>Tono predeterminado</div>
        <div className={styles.toneValue}>{replyOptions.tone}</div>
        <button onClick={() => handleToneChange('Critical')} className={styles.changeButton}>
          Cambiar
        </button>
      </div>
      <div className={styles.mainOptionsContainer}>
        <button onClick={() => handleSetHowToReply('Agree')} className={styles.actionButton}>
          Agree
        </button>
        <button onClick={() => handleSetHowToReply('Disagree')} className={styles.actionButton}>
          Disagree
        </button>
        <button onClick={() => handleSetHowToReply('Change topic')} className={styles.actionButton}>
          Change topic
        </button>
        <button
          onClick={() => handleSetHowToReply('Ask More info')}
          className={styles.actionButton}
        >
          Ask More info
        </button>
      </div>
    </div>
  );

  const SuggestionsView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion, index) => (
          <button key={suggestion?.id || index} className={styles.actionButton}>
            {suggestion?.text || '...'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      {isSuggestionView ? <SuggestionsView /> : <HowToReplyView />}
      <div className={styles.bottomOptionsContainer}>
        <button onClick={handleClose} className={styles.actionButton}>
          Close
        </button>
        <div className={styles.keywordSection}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Add Keyword"
            className={styles.keywordInput}
          />
        </div>
        <button onClick={handlePlay} className={styles.actionButton}>
          Play
        </button>
      </div>
    </div>
  );
};

export default ResponseDashboard;
