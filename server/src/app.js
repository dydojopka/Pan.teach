import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Создаём app
const app = express();

// Вспомогательные переменные для пути
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());


// Отдаём фронтенд
app.use(express.static(path.join(__dirname, '../public')));

// Маршруты API
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import submissionsRoutes from './routes/submissions.routes.js';
import registerRoutes from './routes/register.routes.js';
import usersRoutes from './routes/users.routes.js';
import progressRoutes from './routes/progress.routes.js';


app.use('/api/progress', progressRoutes);
app.use('/api', usersRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/progress', progressRoutes);

// fallback на index.html для фронта
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
