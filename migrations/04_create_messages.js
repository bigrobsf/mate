exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function (table) {
    table.increments();
    table.integer('user_id1').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('user_id2').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('message').defaultTo('').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
