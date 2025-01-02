import NoteCard from "../Notes/NoteCard";
import styles from "./NotesCollection.module.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

function NotesCollection() {
  const [user, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [notesData, setNotesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

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

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription
    return () => unsubscribe();
  }, [auth]);

  // Fetch notes data from db
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();

          // Transform monthlyCards data into the notes format
          const notes = {};

          if (userData.monthlyCards) {
            userData.monthlyCards.forEach((card) => {
              const monthNotes = card.goals
                .filter((goal) => goal.completed && goal.reflection)
                .map((goal, index) => ({
                  id: goal.id || `${card.month}-${index}`,
                  goalName: goal.text,
                  growth: goal.reflection.growth,
                  memorable: goal.reflection.memorable,
                }));

              if (monthNotes.length > 0) {
                notes[card.month] = monthNotes;
              }
            });
          }

          setNotesData(notes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  if (isLoading) {
    return <div className="loading">Loading your reflections...📝</div>;
  }

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
            disabled={!notesData[month]}
            className={`${styles.monthButton} ${
              selectedMonth === month ? styles.active : ""
            }`}
          >
            {month}
            {notesData[month] && (
              <span className={styles.noteCount}>
                {notesData[month].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedMonth && notesData[selectedMonth] && (
        <div className={styles.notesGrid}>
          {notesData[selectedMonth].map((note) => (
            <NoteCard
              key={note.id}
              goalName={note.goalName}
              growth={note.growth}
              memorable={note.memorable}
            />
          ))}
        </div>
      )}

      {/* not necessary for now */}
      {/* {selectedMonth && !notesData[selectedMonth] && (
        <div className={styles.emptyState}>
          <p>No reflections found for {selectedMonth}</p>
        </div>
      )} */}
    </div>
  );
}

export default NotesCollection;
