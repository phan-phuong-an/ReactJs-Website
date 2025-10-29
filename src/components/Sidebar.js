import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab }) 
{
    const menus = ["about", "experience", "education", "skills", "interests", "softskills", "todoList"];

    return (
        <div className="sidebar">
            <img className="avatar" src="/meo.jpg" alt="Avatar" />

            <ul>
                {menus.map((item) => 
                (
                    <li 
                        key={item} 
                        className={activeTab === item ? "active" : ""} 
                        onClick={() => setActiveTab(item)}
                    >
                        {item.toUpperCase()}
                    </li>               
                ))}
            </ul>
        </div>
    );
}
