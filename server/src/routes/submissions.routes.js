import { Router } from 'express';
import db from '../db.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// студент сдаёт задание
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['student']),
  async (req, res) => {
    const { task_id, content } = req.body;

    const [id] = await db('submissions').insert({
      task_id,
      content,
      user_id: req.user.id
    });

    res.json({ id, message: 'Submission created' });
  }
);

// преподаватель смотрит все сдачи
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['teacher']),
  async (req, res) => {
    const submissions = await db('submissions')
      .join('users', 'users.id', 'submissions.user_id')
      .join('tasks', 'tasks.id', 'submissions.task_id')
      .select(
        'submissions.*',
        'users.name as student',
        'tasks.title as task'
      );

    res.json(submissions);
  }
);

// преподаватель ставит оценку
router.put(
  '/:id/grade',
  authMiddleware,
  roleMiddleware(['teacher']),
  async (req, res) => {
    const { grade } = req.body;

    await db('submissions')
      .where({ id: req.params.id })
      .update({ grade });

    res.json({ message: 'Grade updated' });
  }
);

export default router;
