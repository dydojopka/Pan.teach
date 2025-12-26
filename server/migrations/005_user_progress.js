export function up(knex) {
  return knex.schema.createTable('user_progress', table => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.integer('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.boolean('completed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('user_progress');
}
