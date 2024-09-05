import React, { type Dispatch, type SetStateAction, useState } from 'react';
import styles from './ResponseDashboard.module.css';
import type { HowToReply, ReplyOptions, Tone } from '@/src/commonTypes/replyOptions';
import type { ReplySuggestions, ReplySuggestion } from '@/src/commonTypes/replySuggestions';
import { Button, DrawerBody } from '@fluentui/react-components';
import { CodeTextEditRegular } from '@fluentui/react-icons';

type Props = {
  howToReplySuggestions: ReplySuggestions | null[];
  setReplyOptions: Dispatch<SetStateAction<ReplyOptions>>;
  replyOptions: ReplyOptions;
  onHowToReplyClick: (howToReply: HowToReply, keywords: string) => void;
  suggestions: ReplySuggestions | null[];
  onSuggestionPlayClick: (suggestion: ReplySuggestion) => void;
  onSuggestionEditClick: ({
    selected_sentence,
    requested_change,
  }: {
    selected_sentence: string;
    requested_change: string;
  }) => void;
};

const tones: Tone[] = ['Friendly', 'Professional', 'Empathetic', 'Sarcastic', 'Inquisitive'];
type SelectedSuggestionType = null | ReplySuggestion;

const ResponseDashboard: React.FC<Props> = ({
  howToReplySuggestions,
  setReplyOptions,
  replyOptions,
  onHowToReplyClick,
  suggestions,
  onSuggestionPlayClick,
  onSuggestionEditClick,
}: Props) => {
  const [isSuggestionView, setIsSuggestionView] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SelectedSuggestionType>(null);
  const [keywords, setKeywords] = useState('');

  const handleToneChange = (tone: Tone) => {
    setReplyOptions((currentValue) => {
      return { ...currentValue, tone };
    });
  };

  const [showKeywordField, setShowKeywordField] = useState(true);
  const handleSetHowToReply = (how_to_respond: string) => {
    setShowKeywordField(false);
    setReplyOptions((replyOptions) => {
      return {
        ...replyOptions,
        how_to_respond,
        keywords,
      };
    });
    onHowToReplyClick(how_to_respond, keywords);
    setIsSuggestionView(true);
  };

  const handleClose = () => {
    // Logic to close the dashboard
  };

  const HowToReplyView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.toneSection}>
        <DrawerBody className={styles.toneValue}>
          {tones.map((tone) => {
            if (tone === replyOptions.tone)
              return (
                <Button className={styles.toneButton} key={tone}>
                  {tone}
                </Button>
              );
            return (
              <Button
                appearance="transparent"
                onClick={() => handleToneChange(tone)}
                className={styles.toneButton}
                key={tone}
              >
                {tone}
              </Button>
            );
          })}
        </DrawerBody>
      </div>
      <div className={styles.mainOptionsContainer}>
        {howToReplySuggestions.map((suggestion, index) => (
          <Button
            key={suggestion?.id || index}
            onClick={() => {
              if (suggestion?.text) handleSetHowToReply(suggestion?.text);
            }}
            className={`${styles.actionButton} ${styles.suggestionButton}`}
          >
            {suggestion?.text || '...'}
          </Button>
        ))}
      </div>
    </div>
  );

  const handleEditSuggestionClick = (suggestion: SelectedSuggestionType) => {
    setSelectedSuggestion(suggestion);
  };

  const SuggestionsView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.editSuggestionsButtonsContainer}>
        {suggestions.map((suggestion, index) => {
          return (
            <Button
              appearance="transparent"
              onClick={() => handleEditSuggestionClick(suggestion)}
              key={suggestion?.id || index}
              className={`${styles.actionButton} ${styles.editSuggestionButton}`}
            >
              <CodeTextEditRegular fontSize={'1.5rem'} />
            </Button>
          );
        })}
      </div>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion, index) => (
          <Button
            onClick={() => {
              if (!suggestion) return;
              setSelectedSuggestion(suggestion);
              onSuggestionPlayClick(suggestion);
            }}
            key={suggestion?.id || index}
            className={`${styles.actionButton} ${styles.suggestionButton}`}
          >
            {suggestion?.text || '...'}
          </Button>
        ))}
      </div>
    </div>
  );

  const handleEditSuggestionOptionClick = (requested_change: string) => {
    if (!selectedSuggestion) return;
    onSuggestionEditClick({ selected_sentence: selectedSuggestion.text, requested_change });
    setSelectedSuggestion(null);
  };

  const EditSuggestionView = () => {
    const [editIntention, setEditIntention] = useState('');

    return (
      <div className={styles.topOptionsContainer}>
        <div className={styles.suggestions}>
          <Button
            onClick={() => {
              if (selectedSuggestion) onSuggestionPlayClick(selectedSuggestion);
            }}
            className={styles.suggestionButton}
            size="large"
          >
            {selectedSuggestion?.text}
          </Button>
          <div className={styles.editInputContainer}>
            <input
              type="text"
              className={styles.keywordInput}
              placeholder="Make the sentence..."
              value={editIntention}
              onChange={(e) => setEditIntention(e.target.value)}
            />
            <Button
              appearance="primary"
              onClick={() => handleEditSuggestionOptionClick(editIntention)}
              style={{ flexGrow: 0.5, paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              Apply
            </Button>
          </div>
          <div className={styles.fastEditOptions}>
            <Button
              onClick={() => {
                handleEditSuggestionOptionClick('Confident');
              }}
              className={styles.actionButton}
            >
              Confident
            </Button>
            <Button
              onClick={() => {
                handleEditSuggestionOptionClick('Funny');
              }}
              className={styles.actionButton}
            >
              Funny
            </Button>
            <Button
              onClick={() => {
                handleEditSuggestionOptionClick('Sarcastic');
              }}
              className={styles.actionButton}
            >
              Sarcastic
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      {isSuggestionView ? (
        selectedSuggestion ? (
          <EditSuggestionView />
        ) : (
          <SuggestionsView />
        )
      ) : (
        <HowToReplyView />
      )}
      {!selectedSuggestion && (
        <div className={styles.bottomOptionsContainer}>
          <Button onClick={handleClose} className={styles.navActionButtons}>
            Close
          </Button>
          {showKeywordField && (
            <div className={styles.keywordSection}>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Add Keyword"
                className={styles.keywordInput}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseDashboard;
