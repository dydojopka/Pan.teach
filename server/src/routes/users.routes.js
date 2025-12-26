import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import db from '../db.js';

const router = Router();

// GET /api/me
router.get('/me', authMiddleware, async (req, res) => {
    const user = await db('users').where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json({ id: user.id, name: user.name, email: user.email });
});

export default router;
