export function up(knex) {
  return knex.schema.createTable('courses', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('courses');
}
