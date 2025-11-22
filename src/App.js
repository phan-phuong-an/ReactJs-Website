import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { sampleTasks } from './data/sampleTasks';
import Sidebar from './components/sections/Sidebar.js';
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Skills from "./components/sections/Skills";
import Interests from "./components/sections/Interests";
import SoftSkills from "./components/sections/SoftSkills";  
import TodoList from "./components/todolist/TodoList";
import StudentManagement from "./components/studentsmanagements/StudentManagement.js"; 
import Login from "./components/login/login.js";
import Dashboard from "./dashboard/Dashboard.js";
import "./App.css";


function MainLayout() {
  const [activeTab, setActiveTab] = useState("about");
  const [aboutEnterTime, setAboutEnterTime] = useState(null);
  const [educationElapsedSeconds, setEducationElapsedSeconds] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [tasks, setTasks] = useState(sampleTasks);
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
      case "todoList": return <TodoList tasks={tasks} setTasks={setTasks} selectedId={selectedId} setSelectedId={setSelectedId} />;
      case "studentmanagement": return <StudentManagement />;
      case "login": return <Login onSuccess = {() => { setActiveTab ('studentmanagement'); }} />;
      default: return <TodoList tasks={tasks} setTasks={setTasks} selectedId={selectedId} setSelectedId={setSelectedId} />;
    }
  };

  return (
    <div className="layout">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="content">{renderContent()}</div>
    </div>
  );
}

const App = () => {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<MainLayout />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/dashboard" element = {<Dashboard />} />
        <Route path = "*" element = {<Navigate to = "/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
 