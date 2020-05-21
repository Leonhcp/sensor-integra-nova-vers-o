const multer = require('multer')
const multerConfig = require("../config/multer.js")

module.exports = app => {
    app.route('/posts') 
    .post(multer(multerConfig).single("file"), async (req, res) => {
        console.log(req.file)

        const post = await app.model.post.create({
            name: req.file.originalname,
            size: req.file.size,
            key: req.file.filename,
            url: ''

        })

        res.json(post)
    })
  
  }