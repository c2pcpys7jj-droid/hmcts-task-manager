import React, { useState, useEffect } from 'react';
import { taskApi } from './api';
import type { Task } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import './index.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Unable to load tasks. Please ensure the API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleFormSubmit = async (payload: any, isEdit: boolean) => {
    if (isEdit && editingTask) {
      await taskApi.updateTask(editingTask.id, payload);
    } else {
      await taskApi.createTask(payload);
    }
    setIsFormOpen(false);
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await taskApi.updateStatus(id, status);
      loadTasks();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const openNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-content">
          <div className="brand">
            <h1>HMCTS</h1>
            <span className="brand-subtitle">Case Task Manager</span>
          </div>
          <button className="btn btn-primary" onClick={openNewTask}>
            + Create New Task
          </button>
        </div>
      </header>

      <main className="container">
        {error && <div className="alert-error">{error}</div>}

        <div className="content-panel">
          <div className="panel-header">
            <h2>Active Tasks ({tasks.length})</h2>
          </div>

          <div className="task-list">
            {isLoading ? (
              <div className="state-message">Loading data...</div>
            ) : tasks.length === 0 ? (
              <div className="state-message">No tasks found in the system.</div>
            ) : (
              tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditTask}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
