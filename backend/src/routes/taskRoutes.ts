import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { TaskRepository } from '../repositories/taskRepository';

const router = Router();
const taskRepository = new TaskRepository();

function handleValidationErrors(req: Request, res: Response, next: Function): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  next();
}

const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];

router.post(
  '/',
  [
    body('title')
      .notEmpty().withMessage('Title is required')
      .isString().withMessage('Title must be a string')
      .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
    body('status')
      .optional()
      .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
    body('due_date')
      .notEmpty().withMessage('Due date is required')
      .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  ],
  handleValidationErrors,
  (req: Request, res: Response): void => {
    try {
      const task = taskRepository.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
);

router.get('/', (_req: Request, res: Response): void => {
  try {
    const tasks = taskRepository.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

router.get(
  '/:id',
  [param('id').isUUID().withMessage('Task ID must be a valid UUID')],
  handleValidationErrors,
  (req: Request, res: Response): void => {
    try {
      const task = taskRepository.findById(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve task' });
    }
  }
);

router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Task ID must be a valid UUID'),
    body('title')
      .optional()
      .isString().withMessage('Title must be a string')
      .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
    body('status')
      .optional()
      .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
    body('due_date')
      .optional()
      .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
  ],
  handleValidationErrors,
  (req: Request, res: Response): void => {
    try {
      const task = taskRepository.update(req.params.id, req.body);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
);

router.patch(
  '/:id/status',
  [
    param('id').isUUID().withMessage('Task ID must be a valid UUID'),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  ],
  handleValidationErrors,
  (req: Request, res: Response): void => {
    try {
      const task = taskRepository.update(req.params.id, { status: req.body.status });
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task status' });
    }
  }
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Task ID must be a valid UUID')],
  handleValidationErrors,
  (req: Request, res: Response): void => {
    try {
      const deleted = taskRepository.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
);

export default router;
