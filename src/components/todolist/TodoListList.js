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
        <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="card-title mb-0 h5">Today</h2>
                    <button className="btn btn-primary btn-sm fw-semibold py-1 rounded-pill"
                        style={{ width: "140px" , height: "30px" }}
                         onClick={handleAdd}>
                        + Add New Task
                    </button>
                </div>

                <div className="items mt-3 flex-grow-1 overflow-auto">
                    {tasks.map(t => (
                        <div 
                            key={t.id} 
                            className={classNames('item', { selected: selectedId === t.id })} 
                            onClick={() => setSelectedId(t.id)}
                        >
                            <div 
                                className={classNames('radio', { checked: t.completed })} 
                                onClick={(e) => { e.stopPropagation(); toggleComplete(t.id); }}
                            >
                                {t.completed ? '✔' : ''}
                            </div>
                            <div className={classNames('title', { completed: t.completed })}>{t.title}</div>
                            <div className="meta">
                                {t.due && <span className="badge bg-secondary rounded-pill me-1">{new Date(t.due).toLocaleDateString()}</span>}
                                {t.list && <span className="badge bg-primary rounded-pill">{t.list}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



