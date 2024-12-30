import Navbar from "./NavBar/NavBar";
import LandingPage from "./Landing/LandingPage";
import Footer from "./Footer/Footer";
import "./global.css";

function App() {
  return (
    <div className="appContainer">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
