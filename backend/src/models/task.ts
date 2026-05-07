/**
 * Represents the allowed statuses for a task.
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/**
 * Represents a task entity in the system.
 */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a new task.
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date: string;
}

/**
 * Payload for updating a task's status.
 */
export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

/**
 * Payload for updating a task (full update).
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
}
