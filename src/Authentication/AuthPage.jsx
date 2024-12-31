import { SignIn, SignUp } from "@clerk/clerk-react";
import styles from "./AuthPage.module.css";
import PropTypes from "prop-types";

// FIX THIS LATER : Fix the size of the clerk component for better readability

function AuthPage({ mode }) {
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {mode === "sign-in" ? (
          <SignIn path="/sign-in" routing="path" />
        ) : (
          <SignUp
            path="/sign-up"
            routing="path"
            appearance={{
              elements: {
                rootBox: styles.clerkAuthBox,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  mode: PropTypes.oneOf(["sign-in", "sign-up"]).isRequired,
};

export default AuthPage;
