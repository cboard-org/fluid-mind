import React, { useState } from 'react';
import styles from './ResponseDashboard.module.css';

const ResponseDashboard: React.FC = () => {
  const [predeterminedTone, setPredeterminedTone] = useState('FUNNY');
  const [keyword, setKeyword] = useState('');

  const handleToneChange = () => {
    // Logic to change the tone
  };

  const handleAgree = () => {
    // Logic for agree action
  };

  const handleDisagree = () => {
    // Logic for disagree action
  };

  const handleChangeTopic = () => {
    // Logic to change the topic
  };

  const handleMoreInfo = () => {
    // Logic to show more info
  };

  const handleClose = () => {
    // Logic to close the dashboard
  };

  const handlePlay = () => {
    // Logic to play
  };

  const handleAddKeyword = () => {
    // Logic to add keyword
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.bottomSection}>
        <div className={styles.toneSection}>
          <div className={styles.toneLabel}>Tono predeterminado</div>
          <div className={styles.toneValue}>{predeterminedTone}</div>
          <button onClick={handleToneChange} className={styles.changeButton}>
            Cambiar
          </button>
        </div>
        <div className={styles.mainOptionsContainer}>
          <button onClick={handleAgree} className={styles.actionButton}>
            Agree
          </button>
          <button onClick={handleDisagree} className={styles.actionButton}>
            Disagree
          </button>
          <button onClick={handleChangeTopic} className={styles.actionButton}>
            Change topic
          </button>
          <button onClick={handleMoreInfo} className={styles.actionButton}>
            More info
          </button>
        </div>
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
    </div>
  );
};

export default ResponseDashboard;
