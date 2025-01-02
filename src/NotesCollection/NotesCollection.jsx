import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { generateEncryptionKey, decryptGoals } from "../utils/encryption";
import NoteCard from "../Notes/NoteCard";
import styles from "./NotesCollection.module.css";

// eslint-disable-next-line react/display-name, react/prop-types
const MemoizedNoteCard = memo(({ goalName, growth, memorable }) => (
  <NoteCard goalName={goalName} growth={growth} memorable={memorable} />
));

// eslint-disable-next-line react/display-name
const MonthButton = memo(
  // eslint-disable-next-line react/prop-types
  ({ month, noteCount, isSelected, isDisabled, onClick }) => (
    <button
      onClick={() => onClick(month)}
      disabled={isDisabled}
      className={`${styles.monthButton} ${isSelected ? styles.active : ""}`}
    >
      {month}
      {noteCount > 0 && <span className={styles.noteCount}>{noteCount}</span>}
    </button>
  )
);

function NotesCollection() {
  const { user } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [notesData, setNotesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);

  // Memoize months array
  const months = useMemo(
    () => [
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
    ],
    []
  );

  // Initialize encryption key
  useEffect(() => {
    const initializeEncryption = async () => {
      if (!user) return;
      try {
        const { key } = await generateEncryptionKey(user.id);
        setEncryptionKey(key);
      } catch (error) {
        console.error("Error generating encryption key:", error);
        setError("Failed to initialize encryption. Please try again later.");
      }
    };

    initializeEncryption();
  }, [user]);

  // Transform and decrypt monthly cards data into notes format
  const transformMonthlyCards = useCallback(
    async (monthlyCards) => {
      if (!encryptionKey) return {};

      const notes = {};

      try {
        await Promise.all(
          monthlyCards?.map(async (card) => {
            const decryptedGoals = await decryptGoals(
              encryptionKey,
              card.goals || []
            );

            const monthNotes = decryptedGoals
              .filter((goal) => goal.completed && goal.reflection)
              .map((goal, index) => ({
                id: goal.id || `${card.month}-${index}`,
                goalName: goal.text,
                growth: goal.reflection.growth,
                memorable: goal.reflection.memorable,
              }));

            if (monthNotes?.length > 0) {
              notes[card.month] = monthNotes;
            }
          }) || []
        );

        return notes;
      } catch (error) {
        console.error("Error transforming and decrypting notes:", error);
        throw new Error("Failed to process your notes data");
      }
    },
    [encryptionKey]
  );

  // Set up real-time listener for notes data
  useEffect(() => {
    if (!user || !encryptionKey) {
      !user && setIsLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.id);
    let unsubscribe;

    try {
      unsubscribe = onSnapshot(
        userRef,
        async (docSnap) => {
          try {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              const notes = await transformMonthlyCards(userData.monthlyCards);
              setNotesData(notes);
            } else {
              setNotesData({});
            }
            setError(null);
          } catch (error) {
            console.error("Error processing notes:", error);
            setError("Failed to decrypt your notes. Please try again later.");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching notes:", error);
          setError("Failed to load your notes. Please try again later.");
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up notes listener:", error);
      setError("Failed to connect to the database. Please try again later.");
      setIsLoading(false);
    }

    return () => unsubscribe?.();
  }, [user, encryptionKey, transformMonthlyCards]);

  // Handle month selection
  const handleMonthSelect = useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  // Memoize selected month's notes
  const selectedMonthNotes = useMemo(() => {
    return selectedMonth ? notesData[selectedMonth] || [] : [];
  }, [selectedMonth, notesData]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading your reflections...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Goal Reflections</h1>
        <p>Review your journey and celebrate your growth!</p>
      </div>

      <div className={styles.monthButtons}>
        {months.map((month) => (
          <MonthButton
            key={month}
            month={month}
            noteCount={notesData[month]?.length || 0}
            isSelected={selectedMonth === month}
            isDisabled={!notesData[month]}
            onClick={handleMonthSelect}
          />
        ))}
      </div>

      {selectedMonth && (
        <div className={styles.notesGrid}>
          {selectedMonthNotes.length > 0 ? (
            selectedMonthNotes.map((note) => (
              <MemoizedNoteCard
                key={note.id}
                goalName={note.goalName}
                growth={note.growth}
                memorable={note.memorable}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No reflections found for {selectedMonth}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(NotesCollection);
