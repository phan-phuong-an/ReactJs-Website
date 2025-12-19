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
        <aside className={`bg-dark text-light d-flex flex-column vh-100 p-3 ${collapsed ? '' : ''}`}
            style={{
                width: collapsed ? '80px' : '250px',
                transition: 'width 0.3s ease',
                background: 'linear-gradient(180deg, #263543 0%, #1f2d36 100%)'
            }}>

            {/* Brand */}
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom border-secondary">
                <img
                    src="/meo.jpg"
                    alt="Logo"
                    className="rounded-circle me-2"
                    style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                />
                {!collapsed && <span className="fw-bold fs-6">Phương An</span>}
            </div>

            {/* Menu */}
            <nav className="flex-grow-1 overflow-auto">
                <ul className="list-unstyled">
                    {/* Profile Menu với Submenu */}
                    <li className="mb-2">
                        <div
                            className="d-flex align-items-center p-2 rounded cursor-pointer text-decoration-none text-light"
                            onClick={() => toggleMenu("aboutme")}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="me-2">👤</span>
                            {!collapsed && (
                                <>
                                    <span className="flex-grow-1">Profile</span>
                                    <span>{openMenu === "aboutme" ? "▾" : "▸"}</span>
                                </>
                            )}
                        </div>

                        {/* Submenu */}
                        <div className={`collapse ${openMenu === "aboutme" ? "show" : ""}`}>
                            <ul className="list-unstyled ps-4 mt-2">
                                {[
                                    { key: "about", label: "About" },
                                    { key: "experience", label: "Experience" },
                                    { key: "education", label: "Education" },
                                    { key: "skills", label: "Skills" },
                                    { key: "interests", label: "Interests" },
                                    { key: "softskills", label: "Soft Skills" },
                                ].map((item) => (
                                    <li
                                        key={item.key}
                                        className={`p-2 rounded mb-1 ${activeTab === item.key ? 'bg-primary text-white' : ''}`}
                                        onClick={() => setActiveTab(item.key)}
                                        style={{ cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        <span className="me-2">•</span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>

                    {/* Todo List */}
                    <li className="mb-2">
                        <div
                            className={`d-flex align-items-center p-2 rounded ${activeTab === 'widgets' ? 'bg-primary' : ''}`}
                            onClick={() => setActiveTab("widgets")}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="me-2">▦</span>
                            {!collapsed && <span>Todo List</span>}
                        </div>
                    </li>

                    {/* Student Management */}
                    {menus
                        .filter((m) => !["about", "experience", "education", "skills", "interests", "softskills", "todoList"].includes(m.key))
                        .map((m) => (
                            <li key={m.key} className="mb-2">
                                <div
                                    className={`d-flex align-items-center p-2 rounded ${activeTab === m.key ? 'bg-primary' : ''}`}
                                    onClick={() => setActiveTab(m.key)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="me-2">●</span>
                                    {!collapsed && <span>{m.label}</span>}
                                </div>
                            </li>
                        ))}

                    {/* Option Menu */}
                    <li className="mb-2">
                        <div
                            className="d-flex align-items-center p-2 rounded"
                            onClick={() => toggleMenu("layout")}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="me-2">📁</span>
                            {!collapsed && (
                                <>
                                    <span className="flex-grow-1">Option</span>
                                    <span>{openMenu === "layout" ? "▾" : "▸"}</span>
                                </>
                            )}
                        </div>

                        <div className={`collapse ${openMenu === "layout" ? "show" : ""}`}>
                            <ul className="list-unstyled ps-4 mt-2">
                                {["Top Navigation", "Top Navigation + Sidebar", "Boxed", "Fixed Sidebar", "Fixed Sidebar + Custom", "Area"].map((s) => (
                                    <li
                                        key={s}
                                        className="p-2 rounded mb-1"
                                        onClick={() => setActiveTab(s.toLowerCase().replace(/\s+/g, "_"))}
                                        style={{ cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        <span className="me-2">•</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
