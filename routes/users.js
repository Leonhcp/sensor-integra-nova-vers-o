module.exports = app => {
    app.route('/me')
      .get(app.api.user.get)
  
  }