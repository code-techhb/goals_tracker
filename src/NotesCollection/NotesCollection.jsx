import NoteCard from "../Notes/NoteCard";
import styles from "./NotesCollection.module.css";
import { useState } from "react";

function NotesCollection() {
  const [selectedMonth, setSelectedMonth] = useState(null);

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
        goalName: "Read More Books",
        growth:
          "This month, I’ve read two thought-provoking books on productivity and personal development. Each book offered unique perspectives that reshaped how I approach time management and prioritize tasks effectively.",
        memorable:
          "One memorable moment was when I applied a technique from the book to my daily schedule and saw immediate positive results—it was a lightbulb moment!",
      },
      {
        id: 4,
        goalName: "Learn React",
        growth:
          "I've mastered the ability to build reusable and dynamic components in React. Understanding how hooks work has completely transformed how I think about managing state and side effects in my applications. The process was challenging but extremely rewarding.",
        memorable:
          "Completing a fully functional to-do app using custom hooks and context API was an incredible achievement!",
      },
      {
        id: 5,
        goalName: "Exercise 3x Weekly",
        growth:
          "Building a consistent exercise routine has significantly improved my mental and physical health. Over the past month, I’ve started to enjoy the process rather than seeing it as a chore. This change in mindset is a major win.",
        memorable:
          "Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing! Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing.Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing",
      },
      {
        id: 6,
        goalName: "Read More Books",
        growth:
          "This month, I’ve read two thought-provoking books on productivity and personal development. Each book offered unique perspectives that reshaped how I approach time management and prioritize tasks effectively.",
        memorable:
          "One memorable moment was when I applied a technique from the book to my daily schedule and saw immediate positive results—it was a lightbulb moment!",
      },
      {
        id: 7,
        goalName: "Exercise 3x Weekly",
        growth:
          "Building a consistent exercise routine has significantly improved my mental and physical health. Over the past month, I’ve started to enjoy the process rather than seeing it as a chore. This change in mindset is a major win.",
        memorable:
          "Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing! Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing.Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing",
      },
    ],
    February: [
      {
        id: 0,
        goalName: "Read 2 books",
        growth:
          "Expanded my knowledge in software architecture and design patterns",
        memorable: "The aha moment understanding design patterns",
      },
      {
        id: 1,
        goalName: "Learn React",
        growth:
          "I've mastered the ability to build reusable and dynamic components in React. Understanding how hooks work has completely transformed how I think about managing state and side effects in my applications. The process was challenging but extremely rewarding.",
        memorable:
          "Completing a fully functional to-do app using custom hooks and context API was an incredible achievement!",
      },
      {
        id: 2,
        goalName: "Exercise 3x Weekly",
        growth:
          "Building a consistent exercise routine has significantly improved my mental and physical health. Over the past month, I’ve started to enjoy the process rather than seeing it as a chore. This change in mindset is a major win.",
        memorable:
          "Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing! Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing.Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing",
      },
      {
        id: 3,
        goalName: "Read More Books",
        growth:
          "This month, I’ve read two thought-provoking books on productivity and personal development. Each book offered unique perspectives that reshaped how I approach time management and prioritize tasks effectively.",
        memorable:
          "One memorable moment was when I applied a technique from the book to my daily schedule and saw immediate positive results—it was a lightbulb moment!",
      },
      {
        id: 4,
        goalName: "Exercise 3x Weekly",
        growth:
          "Building a consistent exercise routine has significantly improved my mental and physical health. Over the past month, I’ve started to enjoy the process rather than seeing it as a chore. This change in mindset is a major win.",
        memorable:
          "Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing! Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing. Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing.Running my first 10K marathon with friends was an unforgettable milestone. The energy and camaraderie during the event were amazing",
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Goal Reflections</h1>
        <p>Review your journey and celebrate your growth!</p>
      </div>

      <div className={styles.monthButtons}>
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            disabled={!mockNotes[month]}
            className={`${styles.monthButton} ${
              selectedMonth === month ? styles.active : ""
            }`}
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
        <div className={styles.notesGrid}>
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

export default NotesCollection;
