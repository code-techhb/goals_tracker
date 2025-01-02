import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";

function LandingPage() {
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
          <Link to="/sign-in" className="button">
            Get your Digital Tracker now
          </Link>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
