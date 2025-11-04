import React from 'react';
import './TodoList.css';
import classNames from 'classnames';

export default function TodoListList({ tasks, setTasks, selectedId, setSelectedId }) {
    const handleAdd = () => {
        const id = Date.now();
        const newTask = {
            id,
            title: 'New Task',
            description: '',
            completed: false,
            due: '',
            list: '',
            tags: [],
            editing: true
        }; 
        setTasks(prev => [newTask, ...prev]);
        setSelectedId(id);
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
                    <div key={t.id} className={classNames('item', { selected: selectedId === t.id })} onClick={() => setSelectedId(t.id)}>
                        <div className={classNames('radio', { checked: t.completed })} onClick={(e) => { e.stopPropagation(); toggleComplete(t.id); }}>
                            {t.completed ? '✔' : ''}
                        </div>
                        <div className={classNames('title', { completed: t.completed })}>{t.title}</div>
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



