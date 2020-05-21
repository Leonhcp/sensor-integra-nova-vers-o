module.exports = app => {
    const User = app.db.bookshelf.model('User', {
        tableName: 'users',
        permission() {
            return this.belongsTo('Permission', 'permission_id')
        }
        
    });

    return User;
};