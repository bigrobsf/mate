exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function (table) {
    table.increments();
    table.integer('conversation_id').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('message').defaultTo('').notNullable();
    table.timestamps(true, false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
