// server/seeds/001_seed_data.js
import bcrypt from 'bcrypt';

export async function seed(knex) {
  // очищаем таблицы (если нужны)
  await knex('submissions').del().catch(() => {});
  await knex('tasks').del().catch(() => {});
  await knex('courses').del().catch(() => {});
  await knex('users').del().catch(() => {});

  const passwordHash = await bcrypt.hash('Password123', 10);

  await knex('users').insert([
    {
      id: 1,
      name: 'Teacher',
      email: 'teacher@example.com',
      password_hash: passwordHash,
      role: 'teacher'
    },
    {
      id: 2,
      name: 'Student',
      email: 'student@example.com',
      password_hash: passwordHash,
      role: 'student'
    }
  ]);

  await knex('courses').insert([
    { id: 1, title: 'Web Development', description: 'Основы веб-разработки' }
  ]);

  await knex('tasks').insert([
    {
      id: 1,
      course_id: 1,
      title: 'HTML + CSS',
      description: 'Сверстать страницу',
      due_date: '2025-01-15'
    }
  ]);

  
  await knex('submissions').del();

  await knex('submissions').insert([
    {
      task_id: 1,
      user_id: 2,
      content: 'Моя верстка HTML + CSS',
      grade: 5
    }
  ]);

}


