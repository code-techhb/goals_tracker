import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <section className={styles.landingPage}>
      <h1>300 Goals, One Year, Your Journey!</h1>
      <p>
        Turn your dreams into milestones! With 25 new goals each month, our
        tracker is here to keep you inspired, focused, and excited as you work
        toward 300 amazing achievements in 2025. Start small, dream big, and
        celebrate every step of the journey!
      </p>
      <button>Get your Digital Planner now</button>
    </section>
  );
}

export default LandingPage;
