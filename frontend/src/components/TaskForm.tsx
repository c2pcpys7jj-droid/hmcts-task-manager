import React, { useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskFormProps {
  task: Task | null;
  onSubmit: (payload: any, isEdit: boolean) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO' as any,
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.due_date.substring(0, 16)
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        due_date: new Date(formData.dueDate).toISOString()
      };
      await onSubmit(payload, !!task);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-header">
          <h2>{task ? 'Edit Case Task' : 'New Case Task'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="form-input"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Notes / Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="form-input"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Current Status</label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Deadline</label>
              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                required
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-text" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
