import React from 'react';
import "./TodoList.css";
import TodoListList from './TodoListList';
import TodoListDetail from './TodoListDetail';

export default function TodoList({ tasks, setTasks, selectedId, setSelectedId }) {
    return (
        <div className="container-fluid px-0">
            <div className="row g-3 mx-0">
                <div className="col-lg-8 col-12">
                    <TodoListList
                        tasks={tasks}
                        setTasks={setTasks}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                    />
                </div>
                <div className="col-lg-4 col-12">
                    <TodoListDetail
                        task={tasks.find(t => t.id === selectedId)}
                        setTasks={setTasks}
                    />
                </div>
            </div>
        </div>
    );
}