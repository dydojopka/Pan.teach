import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();
const JWT_SECRET = 'secret_key_for_dev';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  await db('users').insert({
    name,
    email,
    password_hash: hash
  });

  res.json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db('users').where({ email }).first();
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default router;