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
            .where({
                user_id: userId,
                completed: true
            });

        res.json({
            completedTasks: rows.map(r => r.task_id)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

/**
 * Отметить задание как выполненное
 * POST /api/progress/complete
 * body: { taskId: number }
 */
router.post('/complete', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ message: 'taskId обязателен' });
        }

        // Проверяем, есть ли запись
        const existing = await db('user_progress')
            .where({
                user_id: userId,
                task_id: taskId
            })
            .first();

        if (existing) {
            // Обновляем
            await db('user_progress')
                .where({
                    user_id: userId,
                    task_id: taskId
                })
                .update({ completed: true });
        } else {
            // Вставляем новую
            await db('user_progress').insert({
                user_id: userId,
                task_id: taskId,
                completed: true
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;
