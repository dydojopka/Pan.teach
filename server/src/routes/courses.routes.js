import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', async (req, res) => {
  const courses = await db('courses');
  res.json(courses);
});

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['teacher']),
  async (req, res) => {
    const { title, description } = req.body;

    const [id] = await db('courses').insert({ title, description });
    res.json({ id, title, description });
  }
);

export default router;
