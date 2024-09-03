import React, { type Dispatch, type SetStateAction, useState } from 'react';
import styles from './ResponseDashboard.module.css';
import type { HowToReply, ReplyOptions, Tone } from '@/src/commonTypes/replyOptions';
import type { ReplySuggestions, ReplySuggestion } from '@/src/commonTypes/replySuggestions';

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

const tones: Tone[] = ['Friendly' , 'Professional' , 'Empathetic' , 'Sarcastic' , 'Inquisitive'  ];

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
  const [selectedSuggestion, setSelectedSuggestion] = useState<null | ReplySuggestion>(null);
  const [isEditView, setIsEditView] = useState(false);
  const [keywords, setKeywords] = useState('');

  const handleToneChange = (tone: Tone) => {
    setReplyOptions((currentValue) => {
      return { ...currentValue, tone };
    });
  };

  const handleSetHowToReply = (how_to_respond: string) => {
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

  const handlePlay = () => {
    // Logic to play
  };

  const HowToReplyView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.toneSection}>
        <div className={styles.toneLabel}>Tone</div>
        <div className={styles.toneValue}>
          {tones.map((tone) => {
            if (tone === replyOptions.tone)
              return (
                <div className={styles.selectedTone} key={tone}>
                  {tone}
                </div>
              );
            return (
              <button
                onClick={() => handleToneChange(tone)}
                className={styles.toneButton}
                key={tone}
              >
                {tone}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.mainOptionsContainer}>
        {howToReplySuggestions.map((suggestion, index) => (
          <button
            key={suggestion?.id || index}
            onClick={() => {
              if (suggestion?.text) handleSetHowToReply(suggestion?.text);
            }}
            className={styles.actionButton}
          >
            {suggestion?.text || '...'}
          </button>
        ))}
      </div>
    </div>
  );

  const SuggestionsView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion, index) => (
          <button
            onClick={() => setSelectedSuggestion(suggestion)}
            key={suggestion?.id || index}
            className={styles.actionButton}
          >
            {suggestion?.text || '...'}
          </button>
        ))}
      </div>
    </div>
  );

  const SelectedSuggestionView = () => (
    <div className={styles.topOptionsContainer}>
      <div className={styles.suggestions}>
        <button className={styles.actionButton}>{selectedSuggestion?.text}</button>
        <div className={styles.playOrEditContainer}>
          <button
            onClick={() => {
              if (selectedSuggestion) onSuggestionPlayClick(selectedSuggestion);
            }}
            className={styles.actionButton}
          >
            Play
          </button>
          <button onClick={() => setIsEditView(true)} className={styles.actionButton}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  const handleEditSuggestionOptionClick = (requested_change: string) => {
    setIsEditView(false);
    if (!selectedSuggestion) return;
    onSuggestionEditClick({ selected_sentence: selectedSuggestion.text, requested_change });
    setSelectedSuggestion(null);
  };

  const EditSuggestionView = () => {
    const [editIntention, setEditIntention] = useState('');

    return (
      <div className={styles.topOptionsContainer}>
        <div className={styles.suggestions}>
          <button className={styles.actionButton}>{selectedSuggestion?.text}</button>
          <div className={styles.playOrEditContainer}>
            <button
              onClick={() => {
                if (selectedSuggestion) onSuggestionPlayClick(selectedSuggestion);
              }}
              className={styles.actionButton}
            >
              Play
            </button>
            <div className={styles.editInputContainer}>
              <input
                type="text"
                className={styles.keywordInput}
                placeholder="Make the sentence..."
                value={editIntention}
                onChange={(e) => setEditIntention(e.target.value)}
              />
              <button
                onClick={() => handleEditSuggestionOptionClick(editIntention)}
                style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
              >
                Apply
              </button>
            </div>
          </div>
          <div className={styles.fastEditOptions}>
            <button
              onClick={() => {
                handleEditSuggestionOptionClick('Confident');
              }}
              className={styles.actionButton}
            >
              Confident
            </button>
            <button
              onClick={() => {
                handleEditSuggestionOptionClick('Funny');
              }}
              className={styles.actionButton}
            >
              Funny
            </button>
            <button
              onClick={() => {
                handleEditSuggestionOptionClick('Sarcastic');
              }}
              className={styles.actionButton}
            >
              Sarcastic
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      {isSuggestionView ? (
        selectedSuggestion ? (
          !isEditView ? (
            <SelectedSuggestionView />
          ) : (
            <EditSuggestionView />
          )
        ) : (
          <SuggestionsView />
        )
      ) : (
        <HowToReplyView />
      )}
      {!isEditView && (
        <div className={styles.bottomOptionsContainer}>
          <button onClick={handleClose} className={styles.actionButton}>
            Close
          </button>
          <div className={styles.keywordSection}>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Add Keyword"
              className={styles.keywordInput}
            />
          </div>
          <button onClick={handlePlay} className={styles.actionButton}>
            Play
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponseDashboard;
