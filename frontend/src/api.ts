import type { Task, CreateTaskPayload, UpdateTaskPayload } from './types';

const API_BASE = 'http://localhost:4000/api/tasks';

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  updateStatus: async (id: string, status: string): Promise<Task> => {
    const res = await fetch(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  }
};
