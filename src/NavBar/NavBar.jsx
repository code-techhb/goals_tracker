import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navContainer}>
      <h1>StepBy25</h1>
      <ul>
        <li>
          <a href="#">Login</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
