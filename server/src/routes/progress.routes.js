import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Получить список выполненных заданий текущего пользователя
 * GET /api/progress
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const rows = await db('user_progress')
            .select('task_id')
            .where({ user_id: userId, completed: true });

        res.json({
            completedTasks: rows.map(r => r.task_id)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;
