export function up(knex) {
  return knex.schema.createTable('submissions', table => {
    table.increments('id').primary();
    table.integer('task_id').notNullable()
      .references('id').inTable('tasks')
      .onDelete('CASCADE');
    table.integer('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    table.text('content').notNullable();
    table.integer('grade');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('submissions');
}
