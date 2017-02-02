exports.up = function(knex, Promise) {
  return knex.schema.createTable('safety', function (table) {
    table.increments();
    table.text('method').defaultTo('').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('safety');
};
