exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.text('first_name').defaultTo('').notNullable();
    table.text('last_name').defaultTo('').notNullable();
    table.text('user_name').defaultTo('').notNullable();
    table.text('email').unique().notNullable();
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.decimal('lat').defaultTo(0).notNullable();
    table.decimal('lon').defaultTo(0).notNullable();
    table.decimal('accuracy').defaultTo(0).notNullable();
    table.boolean('logged_in').defaultTo(false).notNullable();
    table.boolean('message').defaultTo(false).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
