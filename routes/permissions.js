module.exports = app => {
  app.route('/permissions') 
  .post(app.api.permission.save)
  .get(app.api.permission.get)

}