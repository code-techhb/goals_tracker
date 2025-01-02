import Navbar from "./NavBar/NavBar";
import LandingPage from "./Landing/LandingPage";
import Footer from "./Footer/Footer";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./Authentication/AuthPage";
import Dashboard from "./Dashboard/Dashboard";
import Notes from "./NotesCollection/NotesCollection";

function App() {
  return (
    <BrowserRouter>
      <div className="appContainer">
        <Navbar />

        {/* envelop landing page in routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
          {/* temp */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>

        {/* end routes here */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
