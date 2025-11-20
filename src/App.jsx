import { HashRouter, Route, Routes } from "react-router-dom";

import NavBar from './components/NavBar.jsx'
import Home from './components/Home.jsx'
import AboutMe from './components/AboutMe.jsx'
import Resume from './components/Work.jsx'
import Contact from './components/Contact.jsx'

import './App.css'

function App() {
  return (
    <HashRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<AboutMe />}/>
        <Route path="/resume" element={<Resume />}/>
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
