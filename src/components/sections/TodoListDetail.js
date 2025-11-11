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

     if (!task) return <div className="card">Select a task</div>;

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
        setTasks(prev => prev.filter(t => t.id !== task.id)); // khi xóa task, cập nhật lại danh sách tasks
    };

    return (
        <div className="card detail-card">
            
            <h3>Task:</h3>

            <input
                ref={titleRef}
                className="title-input"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                onKeyDown={e => { if (e.key === 'Enter') save(); }}
                placeholder="Task title"
            />
            
            <label>Description</label>

            <textarea value={form.description}
             onChange={e=>setForm({...form, description:e.target.value})}>
            </textarea>

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