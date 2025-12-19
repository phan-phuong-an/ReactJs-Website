import React, { useState, useEffect, useRef } from 'react';
import './TodoList.css';

export default function TodoListDetail({ task, setTasks }) {
    const [form, setForm] = useState({ title: '', description: '', list: '', due: '', tags: []});
    const titleRef = useRef(null);

    useEffect(() => {
        if (task) {
            setForm({
            title: task.title || '',
            description: task.description || '',
            list: task.list || '',
            due: task.due || '',
            tags: task.tags ? [...task.tags] : []
        });
     } else {
            setForm({ title: '', description: '', list: '', due: '', tags: []});
        }
    }, [task]);

    useEffect(() => {
        if (task && task.editing && titleRef.current) {
            setTimeout(() => titleRef.current.focus(), 50); 
        }
    }, [task]);

     if (!task) return (
        <div className="card shadow-sm h-100">
            <div className="card-body text-center text-muted d-flex align-items-center justify-content-center">
                Select a task
            </div>
        </div>
    );

    const save = () => {
        setTasks(prev => prev.map(t => {
            if (t.id !== task.id) return t;
            return {
            ...t,
            title: form.title,
            description: form.description,
            list: form.list,
            due: form.due,
            tags: Array.isArray(form.tags) ? [...form.tags] : [],
            editing: false 
        };
    }));
    };

    const remove = () => {
        setTasks(prev => prev.filter(t => t.id !== task.id)); 
    };

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
                <h3 className="card-title mb-3 h5">Task:</h3>

                <input
                    ref={titleRef}
                    className="form-control fw-bold mb-3"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    onKeyDown={e => { if (e.key === 'Enter') save(); }}
                    placeholder="Task title"
                />
                
                <label className="form-label fw-semibold small">Description</label>
                <textarea 
                    className="form-control mb-3 flex-grow-1" 
                    rows="3"
                    value={form.description}
                    onChange={e=>setForm({...form, description:e.target.value})}
                    placeholder="Add description..."
                />

                <div className="row g-2 mb-3">
                    <div className="col-md-6">
                        <label htmlFor="task-list" className="form-label fw-semibold small">List</label>
                        <select 
                            id="task-list" 
                            className="form-select form-select-sm"
                            value={form.list} 
                            onChange={e=>setForm({...form, list:e.target.value})}
                        >
                            <option value="">Choose...</option>
                            <option>Personal</option>
                            <option>Work</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="task-due" className="form-label fw-semibold small">Due date</label>
                        <input 
                            id="task-due" 
                            type="date" 
                            className="form-control form-control-sm"
                            value={form.due || ''} 
                            onChange={e=>setForm({...form, due:e.target.value})} 
                        />
                    </div>
                </div>

                <div className="d-flex gap-2 mt-auto pt-3">
                    <button className="btn btn-danger btn-sm flex-fill px-3 py-1 rounded-pill" 
                        style={{ width: "140px" , height: "30px" }}
                        onClick={remove}>
                        Delete Task
                    </button>
                    <button className="btn btn-primary btn-sm flex-fill px-3 py-1 rounded-pill" 
                        style={{ width: "140px" , height: "30px" }}
                        onClick={save}>
                        Save Change
                    </button>
                </div>
            </div>
        </div>
    );
} 