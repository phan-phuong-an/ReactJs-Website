import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab }) 
{
    const menus = [
       { key: "about", label: "About" },
       { key: "experience", label: "Experience" }, 
       { key: "education", label: "Education" },
       { key: "skills", label: "Skills" },
       { key: "interests", label: "Interests" },
    { key: "softskills", label: "Soft Skills" },
    { key: "todoList", label: "TodoList" },
    { key: "studentmanagement", label: "Student Management" }
    ];

    return (
        <div className="sidebar">
            <img className="avatar" src="/meo.jpg" alt="Avatar" />

            <ul>
                {menus.map((m) => 
                (
                    <li 
                        key={m.key} 
                        className={activeTab === m.key ? "active" : ""} 
                        onClick={() => setActiveTab(m.key)}
                    >
                        {m.label.toUpperCase()}
                    </li>                 
                ))}
            </ul>
        </div>
    );
}
