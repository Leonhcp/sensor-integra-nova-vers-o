module.exports = app => {
    const postSchema = new app.db.mongoose.Schema({
        name: String,
        size: Number,
        key: String,
        url: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    })

    return app.db.mongoose.model('Post', postSchema)
}