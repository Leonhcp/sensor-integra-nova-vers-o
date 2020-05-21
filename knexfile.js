// Update with your config settings.

module.exports = {

 
    client: 'mysql',
    connection: {
      host: 'mysql.otontech.com.br',
      database: 'otontech',
      user:     'otontech',
      password: 'mercadata2020'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

};
