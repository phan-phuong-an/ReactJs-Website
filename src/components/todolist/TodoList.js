import React from 'react';
import "./TodoList.css";
import TodoListList from './TodoListList';
import TodoListDetail from './TodoListDetail';

export default function TodoList({ tasks, setTasks, selectedId, setSelectedId }) {
    return (
        <div className="todolist-container">
            <div className="todolist-left">
                <TodoListList
                    tasks={tasks}
                    setTasks={setTasks}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                />
            </div>
            <div className="todolist-right">
                <TodoListDetail
                    task={tasks.find(t => t.id === selectedId)}
                    setTasks={setTasks}
                />
            </div>
        </div>
    );
}