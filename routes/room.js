const name = 'rooms'

module.exports = app => {
    app.route(`/${name}`) 
    .post(app.middlewares.user.getUserFromHeader, app.middlewares.permission.hasPermission(name), app.api.room.save)
    .get(app.api.room.get)
  
    app.route(`/${name}/:id`)
      .post(app.api.room.remove)
  }