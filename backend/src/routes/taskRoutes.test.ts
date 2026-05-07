import request from 'supertest';
import app from '../app';
import { initialiseDatabase, closeDatabase } from '../database';

let createdTaskId: string;

beforeAll(() => {
  // Use in-memory database for tests
  initialiseDatabase(':memory:');
});

afterAll(() => {
  closeDatabase();
});

describe('Task API', () => {

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Review case documents',
          description: 'Review all submitted documents for case #12345',
          status: 'TODO',
          due_date: '2026-06-01T10:00:00.000Z',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Review case documents');
      expect(res.body.description).toBe('Review all submitted documents for case #12345');
      expect(res.body.status).toBe('TODO');
      expect(res.body.due_date).toBe('2026-06-01T10:00:00.000Z');
      createdTaskId = res.body.id;
    });

    it('should create a task without optional description', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'File hearing notice',
          due_date: '2026-06-15T09:00:00.000Z',
        });

      expect(res.status).toBe(201);
      expect(res.body.description).toBeNull();
      expect(res.body.status).toBe('TODO');
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          due_date: '2026-06-01T10:00:00.000Z',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should return 400 when due_date is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Incomplete task',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Bad status task',
          due_date: '2026-06-01T10:00:00.000Z',
          status: 'INVALID',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should return 400 for invalid date format', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Bad date task',
          due_date: 'not-a-date',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should retrieve all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should retrieve a task by ID', async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdTaskId);
      expect(res.body.title).toBe('Review case documents');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/api/tasks/00000000-0000-0000-0000-000000000000');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });

    it('should return 400 for invalid UUID', async () => {
      const res = await request(app).get('/api/tasks/not-a-uuid');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({
          title: 'Review case documents (UPDATED)',
          status: 'IN_PROGRESS',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Review case documents (UPDATED)');
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('should return 404 for updating non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Does not exist' });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update only the status', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'DONE' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('DONE');
      expect(res.body.title).toBe('Review case documents (UPDATED)');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'CANCELLED' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 when deleting already-deleted task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Endpoint not found');
    });
  });
});
