import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { sampleTasks } from './data/sampleTasks';
import Sidebar from './components/layout/Sidebar.js';
import Header from './components/layout/Header.js';
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Skills from "./components/sections/Skills";
import Interests from "./components/sections/Interests";
import SoftSkills from "./components/sections/SoftSkills";  
import TodoList from "./components/todolist/TodoList";
import StudentManagement from "./components/studentsmanagements/StudentManagement.js"; 
import Login from "./components/login/login.js";
import "./App.css";


function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [aboutEnterTime, setAboutEnterTime] = useState(null);
  const [educationElapsedSeconds, setEducationElapsedSeconds] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [tasks, setTasks] = useState(sampleTasks);
  const [collapsed, setCollapsed] = useState(false);
  const prevTabRef = useRef(null); 

  useEffect(() => { 
    const requestedTab = location?.state?.tab;
    if (requestedTab) {
      setActiveTab(requestedTab);
      navigate(location.pathname, { replace: true, state: {} });
    }

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
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{flex:1, display:'flex', flexDirection:'column'}}>
        <div style={{flex:'0 0 auto'}}>
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
}

const App = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    const handleStorage = () => setIsAuth(!!localStorage.getItem('accessToken'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={isAuth ? <MainLayout /> : <Navigate to="/" replace />} />
        <Route path="/dashboard" element={isAuth ? <StudentManagement /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
 