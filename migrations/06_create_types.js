exports.up = function(knex, Promise) {
  return knex.schema.createTable('types', function (table) {
    table.increments();
    table.text('type').defaultTo('').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('types');
};
