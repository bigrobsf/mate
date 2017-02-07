exports.up = function(knex, Promise) {
  return knex.schema.createTable('profiles', function (table) {
    table.increments();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('i_am').defaultTo('').notNullable();
    table.text('i_like').defaultTo('').notNullable();
    table.dateTime('birthdate');
    table.integer('height').defaultTo(69).notNullable();
    table.integer('weight').defaultTo(150).notNullable();
    table.text('body_hair').defaultTo('').notNullable();
    table.text('ethnicity').defaultTo('').notNullable();
    table.text('overview').defaultTo('').notNullable();
    table.text('looking_for').defaultTo('').notNullable();
    table.text('interests').defaultTo('').notNullable();
    table.text('positions').defaultTo('').notNullable();
    table.text('safety').defaultTo('').notNullable();
    table.text('hometown').defaultTo('').notNullable();
    table.boolean('dummy').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('profiles');
};
