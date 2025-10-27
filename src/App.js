import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Skills from "./components/sections/Skills";
import Interests from "./components/sections/Interests";
import SoftSkills from "./components/sections/SoftSkills";  
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [aboutEnterTime, setAboutEnterTime] = useState(null);
  const [educationElapsedSeconds, setEducationElapsedSeconds] = useState(null);
  const prevTabRef = useRef(null); 

  useEffect(() => { 
    const prevTab = prevTabRef.current; 

    if (activeTab === 'about') {
      setAboutEnterTime(Date.now());
      setEducationElapsedSeconds(null); 
    }

    if (prevTab === 'about' && activeTab === 'education') {
      const enter = aboutEnterTime || Date.now();
      const elapsedMs = Date.now() - enter;
      setEducationElapsedSeconds(Math.round(elapsedMs / 1000));
    }

    prevTabRef.current = activeTab; 
  }, [activeTab, aboutEnterTime]); 

  const renderContent = () => {
    switch (activeTab) {
      case "about": return <About />;          
      case "experience": return <Experience />;
      case "education": return <Education elapsedSeconds={educationElapsedSeconds} />;
      case "skills": return <Skills />;
      case "interests": return <Interests />;
      case "softskills": return <SoftSkills />;
      default: return <About />;              
    }
  };

  return (
    <div className="layout">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default App;
