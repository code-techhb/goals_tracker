import styles from "./Dashboard.module.css";
import { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import GoalTracker from "../Goals/GoalTracker";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [monthlyCards, setMonthlyCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription
    return () => unsubscribe();
  }, [auth]);

  // Load user's monthly cards data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        // Check if user exists and has monthly cards - returning user case
        if (userDoc.exists() && userDoc.data().monthlyCards) {
          setMonthlyCards(userDoc.data().monthlyCards);
        } else {
          setMonthlyCards([]);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const debouncedSave = useCallback(
    (newMonthlyCards) => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout
      const timeoutId = setTimeout(async () => {
        if (!user) return;

        try {
          await setDoc(
            doc(db, "users", user.uid),
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
    return <div className="loading">Loading ⌛️...</div>;
  }

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.textContainerDash}>
          <h2>Hey {user ? user.displayName : "there"}!</h2>
          <p>
            Welcome to your StepBy25 Dashboard where you turn your dreams into
            <br />
            milestones and let your progress be your motivation ⚡️.
          </p>
          <button onClick={addNewMonth} className={styles.button}>
            Add New Month
          </button>
        </div>
      </div>

      {/* users with no cards */}
      {monthlyCards.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Click Add New Month to start tracking your goals.</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}

export default Dashboard;
