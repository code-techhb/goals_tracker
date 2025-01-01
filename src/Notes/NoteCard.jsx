import PropTypes from "prop-types";
import styles from "./NoteCard.module.css";

function NoteCard({ goalName, growth, memorable }) {
  return (
    <div className={styles.noteCard}>
      <h3>Goal: {goalName}</h3>
      <div className={styles.noteContent}>
        <div className={styles.section}>
          <h4>How Ive grown 🌱</h4>
          <p>{growth}</p>
        </div>
        <div className={styles.section}>
          <h4>Most memorable moment ♡</h4>
          <p>{memorable}</p>
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
