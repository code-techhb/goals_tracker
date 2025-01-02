import { signOut as firebaseSignOut, getAuth } from "firebase/auth";
import styles from "./NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const user = useAuth();
  console.log(user);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className={styles.navContainer}>
      <ul>
        <li className={styles.logo}>
          <NavLink to="/">StepBy25</NavLink>
        </li>

        <div className={styles.navLinks}>
          {!user && (
            <>
              <li>
                <NavLink to="/sign-in">Login</NavLink>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/notes">Notes</NavLink>
              </li>
              <li>
                <button className={styles.logout} onClick={handleSignOut}>
                  Logout
                </button>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
