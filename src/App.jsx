import { HashRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import SkipLink from "./components/SkipLink.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import AboutMe from "./components/AboutMe.jsx";
import Work from "./components/Work.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <SkipLink />
        <NavBar />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutMe />} />
            <Route path="/work" element={<Work />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;