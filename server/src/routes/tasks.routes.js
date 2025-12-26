import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', async (req, res) => {
  const tasks = await db('tasks');
  res.json(tasks);
});

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['teacher']),
  async (req, res) => {
    const { course_id, title, description, due_date } = req.body;

    const [id] = await db('tasks').insert({
      course_id,
      title,
      description,
      due_date
    });

    res.json({ id, title });
  }
);

export default router;
