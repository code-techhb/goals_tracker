import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <>
      <section className={styles.landingPage}>
        <div className={styles.textContainer}>
          <h1>300 Goals, One Year, Your Journey!</h1>
          <p>
            Turn your dreams into milestones!
            <br />
            With 25 new goals each month, our tracker keeps you inspired,
            focused, and excited.
            <br />
            Work toward 300 amazing achievements in 2025.
            <br />
            Start small, dream big, and celebrate every step of the journey!
          </p>
          <button>Get your Digital Planner now</button>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
