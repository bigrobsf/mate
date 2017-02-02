exports.up = function(knex, Promise) {
  return knex.schema.createTable('positions', function (table) {
    table.increments();
    table.text('position').defaultTo('').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('positions');
};
