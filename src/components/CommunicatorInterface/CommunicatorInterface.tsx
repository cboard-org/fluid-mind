import React, { useState } from 'react';
import styles from './CommunicatorInterface.module.css';
import type { HowToReply, Tone } from '@/src/commonTypes/replyOptions';
import type { ReplySuggestions, ReplySuggestion } from '@/src/commonTypes/replySuggestions';
import { Button, DrawerBody } from '@fluentui/react-components';
import { CodeTextEditRegular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type Props = {
  howToSuggestions: ReplySuggestions | null[];
  selectedTone: Tone;
  onHowToClick: (howToReply: HowToReply) => void;
  suggestions: ReplySuggestions | null[];
  onSuggestionPlayClick: (suggestion: ReplySuggestion) => void;
  onSuggestionEditClick: ({
    selected_sentence,
    requested_change,
  }: {
    selected_sentence: string;
    requested_change: string;
  }) => void;
  onToneChange: (tone: Tone) => void;
  keywordsField: React.ReactNode;
};

const tones: Tone[] = ['Friendly', 'Professional', 'Empathetic', 'Sarcastic', 'Inquisitive'];
type SelectedSuggestionType = null | ReplySuggestion;

const editOptions = ['Confident', 'Funny', 'Sarcastic'];

const CommunicatorInterface: React.FC<Props> = ({
  howToSuggestions,
  selectedTone,
  onHowToClick,
  suggestions,
  onSuggestionPlayClick,
  onSuggestionEditClick,
  onToneChange,
  keywordsField,
}: Props) => {
  const [isSuggestionView, setIsSuggestionView] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SelectedSuggestionType>(null);

  const [showKeywordField, setShowKeywordField] = useState(true);
  const handleSetHowToReply = (how_to_respond: string) => {
    setShowKeywordField(false);
    onHowToClick(how_to_respond);
    setIsSuggestionView(true);
  };

  const translations = useTranslations('ReplyDashboard');

  const handleSuggestionPlayClick = (suggestion: ReplySuggestion) => {
    onSuggestionPlayClick(suggestion);
    setIsSuggestionView(false);
    setShowKeywordField(true);
  };

  const HowToReplyView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.toneSection}>
        <DrawerBody className={styles.toneValue}>
          {tones.map((tone) => {
            if (tone === selectedTone)
              return (
                <Button className={styles.toneOption} key={tone}>
                  {translations(`Tones.${tone}`)}
                </Button>
              );
            return (
              <Button
                appearance="transparent"
                onClick={() => onToneChange(tone)}
                className={styles.toneOption}
                key={tone}
              >
                {translations(`Tones.${tone}`)}
              </Button>
            );
          })}
        </DrawerBody>
      </div>
      <div className={styles.mainOptionsContainer}>
        {howToSuggestions.map((suggestion, index) => (
          <Button
            key={suggestion?.id || index}
            onClick={() => {
              if (suggestion?.text) handleSetHowToReply(suggestion?.text);
            }}
            className={`${styles.actionButton} ${styles.suggestionButton}`}
          >
            {suggestion?.translation || suggestion?.text || '...'}
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
              handleSuggestionPlayClick(suggestion);
            }}
            key={suggestion?.id || index}
            className={`${styles.actionButton} ${styles.suggestionButton}`}
          >
            {suggestion?.translation || suggestion?.text || '...'}
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
              if (selectedSuggestion) handleSuggestionPlayClick(selectedSuggestion);
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
              placeholder={translations('EditInput')}
              value={editIntention}
              onChange={(e) => setEditIntention(e.target.value)}
            />
            <Button
              appearance="primary"
              onClick={() => handleEditSuggestionOptionClick(editIntention)}
              style={{ flexGrow: 0.5, paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              {translations('ApplyEditonButton')}
            </Button>
          </div>
          <div className={styles.fastEditOptions}>
            {editOptions.map((option, index) => (
              <Button
                key={index}
                onClick={() => {
                  handleEditSuggestionOptionClick(translations(`EditOptions.${option}`));
                }}
                className={styles.actionButton}
              >
                {translations(`EditOptions.${option}`)}
              </Button>
            ))}
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
          <Link href={'/'}>
            <Button className={styles.closeButton}>{translations('CloseButton')}</Button>
          </Link>
          {showKeywordField && <div className={styles.keywordSection}>{keywordsField}</div>}
        </div>
      )}
    </div>
  );
};

export default CommunicatorInterface;
