// server/seeds/001_seed_data.js
import bcrypt from 'bcrypt';

export async function seed(knex) {
  await knex('users').del();

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
}
