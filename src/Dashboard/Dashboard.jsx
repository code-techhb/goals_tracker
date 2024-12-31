import styles from "./Dashboard.module.css";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import GoalTracker from "../Goals/GoalTracker";

function Dashboard() {
  const { user } = useUser();
  const [monthlyCards, setMonthlyCards] = useState(() => {
    const currentDate = new Date();
    return [
      {
        id: 1,
        month: currentDate.toLocaleString("default", { month: "long" }),
        year: currentDate.getFullYear(),
        timestamp: currentDate.getTime(),
      },
    ];
  });

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
    // const monthExists = monthlyCards.some(
    //   (card) => card.month === currentMonth && card.year === currentYear
    // );

    // if (monthExists) {
    //   alert(`A goal card for ${currentMonth} ${currentYear} already exists!`);
    //   return;
    // }

    const newCard = {
      id: monthlyCards.length + 1,
      month: currentMonth,
      year: currentYear,
      timestamp: currentDate.getTime(),
    };

    setMonthlyCards((prevCards) => [newCard, ...prevCards]);
  };

  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.textContainerDash}>
          <h2>Hey {user ? user.firstName : "welcome to your dashboard"}</h2>
          <p>
            You are one step closer to your dreams!
            <br />
            With 25 fresh goals every month, you have got the perfect roadmap to
            turn <br />
            2025 into your year of achievements. 🚀 <br />
            Stay inspired, stay focused, and let s celebrate every victory – no
            matter how small! 🎉
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
            initialMonth={card.month}
            year={card.year}
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
