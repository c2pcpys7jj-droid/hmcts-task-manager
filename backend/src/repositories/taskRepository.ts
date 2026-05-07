import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task';

export class TaskRepository {

  create(data: CreateTaskRequest): Task {
    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();
    const status = data.status || 'TODO';

    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, status, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.title, data.description || null, status, data.due_date, now, now);

    return this.findById(id)!;
  }

  findAll(): Task[] {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY due_date ASC');
    return stmt.all() as Task[];
  }

  findById(id: string): Task | undefined {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id) as Task | undefined;
  }

  update(id: string, data: UpdateTaskRequest): Task | undefined {
    const db = getDatabase();
    const existing = this.findById(id);
    if (!existing) return undefined;

    const title = data.title ?? existing.title;
    const description = data.description !== undefined ? data.description : existing.description;
    const status = data.status ?? existing.status;
    const dueDate = data.due_date ?? existing.due_date;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(title, description, status, dueDate, now, id);

    return this.findById(id);
  }

  delete(id: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
