import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./sign-in.module.css";

function SignIn() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope("profile");
      provider.addScope("email");

      // Set custom parameters
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);

      // Handle specific error cases
      switch (error.code) {
        case "auth/popup-blocked":
          setError(
            "Popup was blocked by your browser. Please enable popups or use a different browser."
          );
          break;
        case "auth/popup-closed-by-user":
          setError("Sign-in was cancelled.");
          break;
        case "auth/cancelled-popup-request":
          setError("Another sign-in attempt is in progress.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError("An error occurred during sign-in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Welcome to StepBy25</h2>
            <p className={styles.subtitle}>
              Sign in to continue to your account
            </p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
            disabled={isLoading}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className={styles.googleIcon}
                  width="18"
                  height="18"
                />
                Sign in with Google
              </>
            )}
          </button>

          <div className={styles.footer}>
            <p>And make your year unforgetable by reaching your goals!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
