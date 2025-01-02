import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function LandingPage() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <section className={styles.landingPage}>
        <div className={`textContainer ${styles.textContainerLP}`}>
          <h1>300 Goals, One Year, Your Journey!</h1>
          <p>
            Turn your dreams into milestones ✅!
            <br />
            With 25 new goals each month, our goal tracker - StepBy25 keeps you
            inspired, focused,and excited. <br /> Work toward 300 amazing
            achievements in 2025. Start small, dream big, and <br />
            🎉 celebrate every step of the journey!
          </p>
          <Link to={user ? "/dashboard" : "/sign-in"} className="button">
            Get your Digital Tracker now
          </Link>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
