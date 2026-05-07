import React from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'DONE';

  return (
    <div className="task-row">
      <div className="task-main">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className={`date-badge ${isOverdue ? 'overdue' : ''}`}>
            Due: {formatDate(task.due_date)}
          </span>
        </div>
      </div>

      <div className="task-controls">
        <select
          className={`status-select status-${task.status}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Completed</option>
        </select>
        
        <div className="button-group">
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
            Edit
          </button>
          <button className="btn-icon text-danger" onClick={() => onDelete(task.id)} title="Delete Task">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
