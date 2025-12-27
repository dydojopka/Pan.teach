export async function up(knex) {
    await knex.schema.createTable('user_progress', table => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.integer('task_id').notNullable();
        table.boolean('completed').defaultTo(false);

        table.unique(['user_id', 'task_id']);
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('user_progress');
}
