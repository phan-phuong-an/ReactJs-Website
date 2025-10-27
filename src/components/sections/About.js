import { useState, useEffect } from "react";
import "./About.css";

export default function About() {

  const [time, setTime] = useState(() => new Date()); 
 
  useEffect(() => { 
    let mounted = true; 

    const updateTime = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); 
      if (!mounted) return;
      setTime(new Date()); 
    };

    updateTime();
    const id = setInterval(updateTime, 1000); 

    return () => { 
      mounted = false;
      clearInterval(id); 
    };
  }, []);

  return (
    <div className="about-container">
      <h1>Phan Thi Phuong An</h1>
      <div className="clock">Current time: {time.toLocaleTimeString()}</div>
      <ui className="contact">Ho Chi Minh   - 0776593619   - phanthiphuongan1412@gmail.com</ui>
      <p>
        Software engineering is the process of designing, developing, and maintaining software systems in a structured and efficient way. 
        It combines technical knowledge with problem-solving skills to create applications that meet users’ needs.
        Software engineers use programming languages, frameworks, and tools to build reliable and scalable solutions. 
        They also follow principles like testing, documentation, and version control to ensure quality. 
        This field is always evolving with new technologies such as artificial intelligence, cloud computing, and cybersecurity, 
        making software engineering one of the most dynamic and important careers today.
      </p>
    </div>
  );
}