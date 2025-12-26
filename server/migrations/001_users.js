import bcrypt from 'bcrypt';

export async function seed(knex) {
  await knex('users').del();
  await knex('courses').del();
  await knex('tasks').del();

  const password = await bcrypt.hash('Password123', 10);

  await knex('users').insert([
    {
      id: 1,
      name: 'Teacher',
      email: 'teacher@example.com',
      password_hash: password,
      role: 'teacher'
    },
    {
      id: 2,
      name: 'Student',
      email: 'student@example.com',
      password_hash: password,
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
}
