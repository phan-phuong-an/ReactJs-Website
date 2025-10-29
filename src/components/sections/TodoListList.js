import React from 'react';
import './TodoList.css';

 export default function TodoListList({ tasks, setTasks, selectedId, setSelectedId }) {
    const handleAdd = () => {
        const newTask = { id: Date.now(), title: 'New Task', completed: false, due: '', list: '', tags: [] };
        setTasks(prev => [newTask, ...prev]);
        setSelectedId(newTask.id);
    };

    const toggleComplete = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="card list-card">
            <div className="list-header">
                <h2>Today</h2>
                <button className="add-btn" onClick={handleAdd}>+ Add New Task</button>
            </div>

            <div className="items">
                {tasks.map(t => (
                    <div key ={t.id} className={`item ${selectedId === t.id ? 'selected' : ''}`} onClick={() => setSelectedId(t.id)}>
                        <div className={`radio ${t.completed ? 'checked' : ''}`} onClick={(e) => {e.stopPropagation(); toggleComplete(t.id); }}>
                            {t.completed ? '✔' : ''}
                        </div>
                        <div className={`title ${t.completed ? 'completed' : ''}`}>{t.title}</div>
                        <div className="meta">
                            {t.due && <span className="due">{new Date(t.due).toLocaleDateString()}</span>}
                            {t.list && <span className="tag">{t.list}</span>}
                        </div>                 
                    </div>        
                ))}
            </div>
        </div>
    );
 }