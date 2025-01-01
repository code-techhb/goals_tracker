import styles from "./Dashboard.module.css";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import GoalTracker from "../Goals/GoalTracker";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Dashboard() {
  const { user } = useUser();
  const [monthlyCards, setMonthlyCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState(null);

  // Load user's monthly cards from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.id));

        if (userDoc.exists() && userDoc.data().monthlyCards) {
          setMonthlyCards(userDoc.data().monthlyCards);
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
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Debounced save function
  const debouncedSave = useCallback(
    (newMonthlyCards) => {
      // Clear any existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout
      const timeoutId = setTimeout(async () => {
        if (!user) return;

        try {
          await setDoc(
            doc(db, "users", user.id),
            {
              monthlyCards: newMonthlyCards,
            },
            { merge: true }
          );
        } catch (error) {
          console.error("Error saving data:", error);
        }
      }, 3000);

      setSaveTimeout(timeoutId);

      // Cleanup timeout on component unmount
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [user, saveTimeout]
  );

  const getGridClass = (cardCount) => {
    if (cardCount === 1) return styles.gridOne;
    if (cardCount === 2) return styles.gridTwo;
    if (cardCount === 3) return styles.gridThree;
    return styles.gridFour;
  };

  const addNewMonth = () => {
    if (monthlyCards.length >= 12) {
      alert(
        " 🚨 Maximum of 12 months reached. How do you feel about your 2025 year? The 2026 planner is coming soon."
      );
      return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    // Check if the current month already exists
    const monthExists = monthlyCards.some(
      (card) => card.month === currentMonth && card.year === currentYear
    );

    if (monthExists) {
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
  };

  const handleGoalsUpdate = (cardId, updatedGoals) => {
    const updatedCards = monthlyCards.map((card) =>
      card.id === cardId ? { ...card, goals: updatedGoals } : card
    );
    setMonthlyCards(updatedCards);
    debouncedSave(updatedCards);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.textContainerDash}>
          <h2>Hey {user ? user.firstName : "welcome to your dashboard"}</h2>
          <p>
            Turn your dreams into milestones and let your progress be your
            motivation ⚡️.
            <br /> With StepBy25, stay Inspired, stay Focused, and celebrate
            every victory 🎯
            <br /> – no matter how small! 🎉
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
            onGoalsUpdate={(updatedGoals) =>
              handleGoalsUpdate(card.id, updatedGoals)
            }
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
