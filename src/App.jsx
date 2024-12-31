import Navbar from "./NavBar/NavBar";
import LandingPage from "./Landing/LandingPage";
import Footer from "./Footer/Footer";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./Authentication/AuthPage";
import Dashboard from "./Dashboard/Dashboard";
import GoalTracker from "./Goals/GoalTracker";

function App() {
  return (
    <BrowserRouter>
      <div className="appContainer">
        <Navbar />

        {/* envelop landing page in routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          {/* temp */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goals" element={<GoalTracker />} />
        </Routes>

        {/* end routes here */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
