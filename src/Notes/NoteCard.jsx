import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./NoteCard.module.css";

function NoteCard({ goalName, growth, memorable }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`${styles.flashcard} ${isFlipped ? styles.flipped : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={styles.flashcardInner}>
        <div className={styles.front}>
          <h3>Goal: {goalName}</h3>
          <p className={styles.clickPrompt}>Click to see Notes</p>
        </div>

        <div className={styles.back}>
          <div className={styles.reflectionContent}>
            <h4>How Ive grown:</h4>
            <p>{growth}</p>
            <hr />
            <h4>Most memorable moment:</h4>
            <p>{memorable}</p>
          </div>
          <p className={styles.clickPrompt}>Click to see goal</p>
        </div>
      </div>
    </div>
  );
}

NoteCard.propTypes = {
  goalName: PropTypes.string.isRequired,
  growth: PropTypes.string.isRequired,
  memorable: PropTypes.string.isRequired,
};

export default NoteCard;
