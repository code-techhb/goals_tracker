import Navbar from "./NavBar/NavBar";
import LandingPage from "./Landing/LandingPage";
import Footer from "./Footer/Footer";
import "./global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protected/protectedRoute";
import Dashboard from "./Dashboard/Dashboard";
import Notes from "./NotesCollection/NotesCollection";
import SignIn from "./sign-in/sign-in";

function App() {
  return (
    <BrowserRouter>
      <div className="appContainer">
        <Navbar />

        {/* envelop landing page in routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* end routes here */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
