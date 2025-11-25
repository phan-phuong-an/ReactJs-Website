import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
    const [openMenu, setOpenMenu] = useState(null);

    const menus = [
        { key: "about", label: "About" },
        { key: "experience", label: "Experience" },
        { key: "education", label: "Education" },
        { key: "skills", label: "Skills" },
        { key: "interests", label: "Interests" },
        { key: "softskills", label: "Soft Skills" },
        { key: "todoList", label: "TodoList" },
        { key: "studentmanagement", label: "Student Management" },
    ];

    const toggleMenu = (key) => {
        if (collapsed) {
            setCollapsed(false);
            setOpenMenu(key);
            return;
        }

        setOpenMenu((prev) => (prev === key ? null : key));
    };

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="brand">
                <div className="brand-left">
                    <img className="brand-logo" src="/meo.jpg" alt="Logo" />
                    {!collapsed && <div className="brand-text">Phương An</div>}
                </div>
            </div>

            <div className="divider" />

            <nav className="menu">
                <ul>
                    <li className={`menu-item has-children ${openMenu === "aboutme" ? "open" : ""}`}>
                        <div className={`menu-link`} onClick={() => toggleMenu("aboutme")}>
                            <span className="icon">👤</span>
                            {!collapsed && <span className="label">Profile</span>}
                            {!collapsed && <span className="caret">▾</span>}
                        </div>

                        <ul className="submenu">
                            {[
                                { key: "about", label: "About" },
                                { key: "experience", label: "Experience" },
                                { key: "education", label: "Education" },
                                { key: "skills", label: "Skills" },
                                { key: "interests", label: "Interests" },
                                { key: "softskills", label: "Soft Skills" },
                            ].map((item) => (
                                <li key={item.key} className={`subitem ${activeTab === item.key ? "active" : ""}`} onClick={() => setActiveTab(item.key)}>
                                    <span className="dot" /> {item.label}
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Widgets */}
                    <li className={`menu-item`}>
                        <div className={`menu-link`} onClick={() => setActiveTab("widgets")}>
                            <span className="icon">▦</span>
                            {!collapsed && <span className="label">Todo List</span>}
                        </div>
                    </li>

                    

                    {/* Render original menus below - exclude items moved into About me submenu */}
                    {menus
                        .filter((m) => !["about", "experience", "education", "skills", "interests", "softskills", "todoList"].includes(m.key))
                        .map((m) => (
                            <li key={m.key} className={`menu-item ${activeTab === m.key ? "active" : ""}`} onClick={() => setActiveTab(m.key)}>
                                <div className="menu-link">
                                    <span className="icon">●</span>
                                    {!collapsed && <span className="label">{m.label}</span>}
                                </div>
                            </li>
                        ))}
                    
                    {/* Layout Options group (moved to bottom) */}
                    <li className={`menu-item has-children ${openMenu === "layout" ? "open" : ""}`}>
                        <ul className="submenu">
                            {["Top Navigation", "Top Navigation + Sidebar", "Boxed", "Fixed Sidebar", "Fixed Sidebar + Custom", "Area"].map((s) => (
                                <li key={s} className="subitem" onClick={() => setActiveTab(s.toLowerCase().replace(/\s+/g, "_"))}>
                                    <span className="dot" /> {s}
                                </li>
                            ))}
                        </ul>

                        <div className={`menu-link`} onClick={() => toggleMenu("layout")}>
                            <span className="icon">📁</span>
                            {!collapsed && <span className="label">Option</span>}
                            {!collapsed && <span className="caret">▾</span>}
                        </div>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
