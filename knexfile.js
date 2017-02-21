module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/mate_dev',
    pool: {
      min: 1,
      max: 5
    }
  },

  // test: {
  //   client: 'postgresql',
  //   connection: 'postgres://localhost/mate_test',
  //   pool: {
  //     min: 1,
  //     max: 5
  //   }
  // },
  //
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
