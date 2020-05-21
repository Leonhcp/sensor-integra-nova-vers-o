exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('name')
            table.string('email').defaultTo(null)
            table.string('cpf').unique()
            table.string('password')
            
            table.integer('permission_id').unsigned().notNullable().defaultTo(3)
            table.foreign('permission_id').references('id').inTable('permissions')
        }),

        knex.schema.createTable('permissions', table => {
            table.increments('id').primary()
            table.integer('level').notNull().unique()
            table.string('label').notNull().unique()
            table.string('able').notNull().unique()
        }),

        knex.schema.createTable('rooms', table => {
            table.increments('id').primary()
            table.string('name').notNull() 
            table.datetime("created_at").notNull().defaultTo(knex.fn.now())

            table.integer('responsible_id').unsigned().notNull().defaultTo(1)
            table.foreign('responsible_id').references('id').inTable('users')
        }),

        knex.schema.createTable('users_rooms', table => {
            table.increments('id').primary()

            table.integer('user_id').unsigned().notNullable()
            table.foreign('user_id').references('id').inTable('users')

            table.integer('room_id').unsigned().notNullable()
            table.foreign('room_id').references('id').inTable('rooms')

            table.unique(['user_id', 'room_id'])
        })
    ])

};


exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('users_rooms'),
        knex.schema.dropTable('permissions')
    ])
}