exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', function (table) {
    table.increments();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.boolean('profile_flag').defaultTo(false);
    table.text('image_path').defaultTo('').notNullable();
    table.text('caption').defaultTo('').notNullable();
    table.text('image_data');
    table.integer('id_width').defaultTo(0);
    table.integer('id_height').defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
