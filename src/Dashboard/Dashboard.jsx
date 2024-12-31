import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function Dashboard() {
  const { user } = useUser();
  return (
    <section className={styles.dashboard}>
      <div className={styles.header}>
        <div className={`textContainer ${styles.textContainerDash}`}>
          <h2>Hey {user ? user.firstName : " welcome to your dashboard"}</h2>
          <p>
            You’re one step closer to your dreams!
            <br />
            With 25 fresh goals every month, you’ve got the perfect roadmap to
            turn 2025 into your year of achievements. 🚀
            <br />
            Stay inspired, stay focused, and let’s celebrate every victory – no
            matter how small! 🎉
          </p>
          <Link to="/goals" className="button">
            Enter your monthly goals
          </Link>
        </div>
      </div>

      <div className={styles.goals}>{/* map here */}</div>
    </section>
  );
}

export default Dashboard;
