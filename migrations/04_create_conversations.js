exports.up = function(knex, Promise) {
  return knex.schema.createTable('conversations', function (table) {
    table.increments();
    table.integer('initiator_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('recipient_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('conversations');
};
