import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./Landing/LandingPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
