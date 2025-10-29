import { useState, useEffect, useRef } from 'react';
// import { sampleTasks } from './data/sampleTasks';
import Sidebar from './components/Sidebar';
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Skills from "./components/sections/Skills";
import Interests from "./components/sections/Interests";
import SoftSkills from "./components/sections/SoftSkills";  
import TodoList from './components/sections/TodoList';
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
      case "todoList": return <TodoList />;
      default: return <About />;               
    }
  };

  return (
    <div className="layout">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="content">{renderContent()}</div>
    </div>
  );

//   export const sampleTasks = [
//     { id: 1, title: 'Research project ideas', completed: false, due: '', list: 'Personal', tags: [] },
//     { id: 2, title: 'Create a database of guest authors', completed: false, due: '', list: 'Work', tags: [] },
//     { id: 3, title: "Renew driver's license", completed: true, due: '2025-11-03', list: 'Personal', tags: ['Tag1'] },
//     { id: 4, title: 'Consult accountant', completed: false, due: '', list: '', tags: [] },
//   ]
};

export default App;
