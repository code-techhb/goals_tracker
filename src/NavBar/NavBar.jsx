import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function Navbar() {
  const { isSignedIn, signOut } = useAuth();

  return (
    <nav className={styles.navContainer}>
      <ul>
        <li className={styles.logo}>
          <NavLink to="/">StepBy25</NavLink>
        </li>

        <div className={styles.navLinks}>
          {!isSignedIn && (
            <>
              <li>
                <NavLink to="/sign-in">Login</NavLink>
              </li>
              <li>
                <NavLink to="/sign-up">Sign Up</NavLink>
              </li>
            </>
          )}
          {isSignedIn && (
            <>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/notes">Notes</NavLink>
              </li>
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
