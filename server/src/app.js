import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));


import submissionsRoutes from './routes/submissions.routes.js';

app.use('/api/submissions', submissionsRoutes);


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


export default app;
