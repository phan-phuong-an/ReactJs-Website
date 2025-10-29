import React, { useState, useEffect } from 'react';
import './TodoList.css';

export default function TodoListDetail({ task, setTasks }) {
    const [form, setForm] = useState({ title: '', description: '', list: '', due: '', tags: []});
    useEffect(() => {
        if (task) setForm({...task });
        else setForm({ title: '', description: '', list: '', due: '', tags: []});
    }, [task]);

    if (!task) return <div className="card">Select a task</div>;

    const save = () => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...form } : t));
    };

    const remove = () => {
        setTasks(prev => prev.filter(t => t.id !== task.id));
    };

    return (
        <div className="card detail-card">
            <h3>Task:</h3>
            <div className="title-large">{form.title}</div>
            <label>Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})}></textarea>
            <div className="form-controls">
                <label htmlFor="task-list">List</label>
                <select id="task-list" value={form.list} onChange={e=>setForm({...form, list:e.target.value})}>
                    <option>Personal</option>
                    <option>Work</option>
                </select>
                <label htmlFor="task-due">Due date</label>
                <input id="task-due" type="date" value={form.due || ''} onChange={e=>setForm({...form, due:e.target.value})} />
            </div>
            <div className="actions">
                <button className="btn btn-danger" onClick={remove}>Delete Task</button>
                <button className="btn btn-primary" onClick={save}>Save Change</button>
            </div>
        </div>
    );
}