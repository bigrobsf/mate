exports.up = function(knex, Promise) {
  return knex.schema.createTable('curlocation', function (table) {
    table.increments();
    table.decimal('lat').defaultTo(0).notNullable();
    table.decimal('lon').defaultTo(0).notNullable();
    table.integer('accuracy').defaultTo(0).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('curlocation');
};
