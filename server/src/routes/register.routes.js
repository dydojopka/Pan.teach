import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';

const router = Router();

// POST /api/register
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  // проверяем уникальность email
  const exists = await db('users').where({ email }).first();
  if (exists) {
    return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
  }

  const hash = await bcrypt.hash(password, 10);

  const [id] = await db('users').insert({
    name,
    email,
    password_hash: hash
  });

  res.json({ id, message: 'Пользователь зарегистрирован' });
});

export default router;
