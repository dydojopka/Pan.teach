export async function up(knex) {
    await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('name').notNullable();
        table.string('password_hash').notNullable();
        table.string('role').notNullable().defaultTo('student');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('users');
}
