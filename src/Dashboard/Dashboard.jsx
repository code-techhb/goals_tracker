import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { db } from "../config/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  generateEncryptionKey,
  encryptGoals,
  decryptGoals,
} from "../utils/encryption";
import GoalTracker from "../Goals/GoalTracker";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user } = useUser();
  const [monthlyCards, setMonthlyCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const saveTimeoutRef = useRef(null);
  const unsubscribeRef = useRef(null);

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

  // Load and subscribe to user's monthly cards
  useEffect(() => {
    if (!user || !encryptionKey) {
      !user && setIsLoading(false);
      return;
    }

    const userDocRef = doc(db, "users", user.id);
    setIsLoading(true);
    setError(null);

    try {
      // Set up real-time listener
      unsubscribeRef.current = onSnapshot(
        userDocRef,
        async (docSnapshot) => {
          try {
            if (docSnapshot.exists() && docSnapshot.data().monthlyCards) {
              const encryptedCards = docSnapshot.data().monthlyCards;

              // Process each card and decrypt its goals
              const decryptedCards = await Promise.all(
                encryptedCards.map(async (card) => ({
                  ...card,
                  goals: await decryptGoals(encryptionKey, card.goals || []),
                }))
              );

              setMonthlyCards(decryptedCards);
            } else {
              // Initialize with current month if no data exists
              const currentDate = new Date();
              const initialCard = {
                id: 1,
                month: currentDate.toLocaleString("default", { month: "long" }),
                year: currentDate.getFullYear(),
                timestamp: currentDate.getTime(),
                goals: [],
              };
              setMonthlyCards([initialCard]);

              // Set initial data in Firestore
              await setDoc(userDocRef, { monthlyCards: [initialCard] });
            }
          } catch (error) {
            console.error("Error processing encrypted data:", error);
            setError("Failed to decrypt your data. Please try again later.");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error loading user data:", error);
          setError("Failed to load your data. Please try again later.");
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up data listener:", error);
      setError("Failed to connect to the database. Please try again later.");
      setIsLoading(false);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user, encryptionKey]);

  // Debounced save function with encryption
  const debouncedSave = useCallback(
    async (newMonthlyCards) => {
      if (!user || !encryptionKey) return;

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          // Encrypt each card's goals before saving
          const encryptedCards = await Promise.all(
            newMonthlyCards.map(async (card) => ({
              ...card,
              goals: await encryptGoals(encryptionKey, card.goals || []),
            }))
          );

          const userDocRef = doc(db, "users", user.id);
          await setDoc(
            userDocRef,
            {
              monthlyCards: encryptedCards,
              lastUpdated: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.error("Error saving encrypted data:", error);
          setError("Failed to save your changes. Please try again.");
        }
      }, 2000);
    },
    [user, encryptionKey]
  );

  const getGridClass = useCallback((cardCount) => {
    if (cardCount === 1) return styles.gridOne;
    if (cardCount === 2) return styles.gridTwo;
    if (cardCount === 3) return styles.gridThree;
    return styles.gridFour;
  }, []);

  const addNewMonth = useCallback(() => {
    if (monthlyCards.length >= 12) {
      alert("🚨 Maximum of 12 months reached.");
      return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    if (
      monthlyCards.some(
        (card) => card.month === currentMonth && card.year === currentYear
      )
    ) {
      alert(`A goal card for ${currentMonth} ${currentYear} already exists!`);
      return;
    }

    const newCard = {
      id: monthlyCards.length + 1,
      month: currentMonth,
      year: currentYear,
      timestamp: currentDate.getTime(),
      goals: [],
    };

    const updatedCards = [newCard, ...monthlyCards];
    setMonthlyCards(updatedCards);
    debouncedSave(updatedCards);
  }, [monthlyCards, debouncedSave]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading your dashboard...</div>;
  }

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.textContainerDash}>
          <h2>Hey {user?.firstName ?? "there"}</h2>
          <p>
            Welcome to StepBy25 where you turn your dreams into milestones and
            let <br />
            your progress be your motivation ⚡️
          </p>
          <button onClick={addNewMonth} className={styles.button}>
            Add New Month
          </button>
        </div>
      </div>

      <div className={`${styles.goals} ${getGridClass(monthlyCards.length)}`}>
        {monthlyCards.map((card) => (
          <GoalTracker
            key={card.id}
            month={card.month}
            year={card.year}
            goals={card.goals || []}
            onGoalsUpdate={(updatedGoals) => {
              const updatedCards = monthlyCards.map((c) =>
                c.id === card.id ? { ...c, goals: updatedGoals } : c
              );
              setMonthlyCards(updatedCards);
              debouncedSave(updatedCards);
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
