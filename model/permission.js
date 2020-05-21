module.exports = app => {
    const Permission = app.db.bookshelf.model('Permission', {
        tableName: 'permissions',
    })

    return Permission;
}