import { useState } from "react";
import NoteCard from "../Notes/NoteCard";
import styles from "./NotesCollection.module.css";

function Notes() {
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Mock data for now - will be replaced with DB data later
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const mockNotes = {
    January: [
      {
        id: 1,
        goalName: "Learn React",
        growth: "I've become more confident in building complex UIs",
        memorable: "Successfully building my first custom hook!",
      },
      {
        id: 2,
        goalName: "Exercise 3x weekly",
        growth: "Developed better discipline and routine",
        memorable: "Completing my first 5K run",
      },
      {
        id: 3,
        goalName: "Exercise 3x weekly",
        growth: "Developed better discipline and routine",
        memorable: "Completing my first 5K run",
      },
      {
        id: 4,
        goalName: "Exercise 3x weekly",
        growth: "Developed better discipline and routine",
        memorable: "Completing my first 5K run",
      },
    ],
    February: [
      {
        id: 3,
        goalName: "Read 2 books",
        growth:
          "Expanded my knowledge in software architecture. Expanded my knowledge in software architectureExpanded my knowledge in software architectureExpanded my knowledge in software architectureExpanded my knowledge in software architectureExpanded my knowledge in software architectureExpanded my knowledge in software architectureExpanded my knowledge in software architecture",
        memorable: "The aha moment understanding design patterns",
      },
    ],
  };

  return (
    <div className={styles.notesContainer}>
      <header className={styles.header}>
        <h1>Your Goal Reflections</h1>
        <p>Review your journey and celebrate your growth!</p>
      </header>

      <div className={styles.monthButtons}>
        {months.map((month) => (
          <button
            key={month}
            className={`${styles.monthButton} ${
              selectedMonth === month ? styles.active : ""
            }`}
            onClick={() => setSelectedMonth(month)}
            disabled={!mockNotes[month]}
          >
            {month}
            {mockNotes[month] && (
              <span className={styles.noteCount}>
                {mockNotes[month].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedMonth && mockNotes[selectedMonth] && (
        <div
          className={`${styles.cardsGrid} ${
            styles[`grid${Math.min(mockNotes[selectedMonth].length, 4)}`]
          }`}
        >
          {mockNotes[selectedMonth].map((note) => (
            <NoteCard
              key={note.id}
              goalName={note.goalName}
              growth={note.growth}
              memorable={note.memorable}
            />
          ))}
        </div>
      )}

      {selectedMonth && !mockNotes[selectedMonth] && (
        <div className={styles.emptyState}>
          <p>No reflections found for {selectedMonth}</p>
        </div>
      )}
    </div>
  );
}

export default Notes;
