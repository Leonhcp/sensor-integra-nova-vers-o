module.exports = app => {
    const Room = app.db.bookshelf.model('Room', {
        tableName: 'rooms',
        responsible() {
            return this.belongsTo('User', 'responsible_id');
        },
        users() {
            return this.belongsToMany('User', 'users_Rooms')
        }
    });

    return Room;
}