export function up(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id').primary();
    table.integer('course_id').references('id').inTable('courses');
    table.string('title').notNullable();
    table.text('description');
    table.date('due_date');
  });
}

export function down(knex) {
  return knex.schema.dropTable('tasks');
}
