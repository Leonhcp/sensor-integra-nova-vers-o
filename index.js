const express = require('express')
const db = require('./config/db')
const consign = require('consign')
const app = require('express')()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

app.db = db

const {PubSocket} = require("pubsocket")

// const appPubSocket = new PubSocket('http://otontech.com.br')

// app.pubSocket = appPubSocket


require('dotenv').config();

consign()
  .include('./config/passport.js')
  .then('./config/permission.js')
  .then('./config/multer.js')
  .then('./middlewares')
  .then('./utils')
  .then('./model')
  .then('./api')
  .then('./routes')
  .into(app)

app.listen(3008, async () => {
  // try {

  //   const roomsFromDB = await app.model.room.forge().fetchAll()
  //   if (roomsFromDB.length > 0) {
  //     roomsFromDB.forEach((room) => {
  //       pubSocket.createChannel(room.id)
  //     })
  //   } else {
  //     console.log("Sem salas")
  //   }
  // }
  // catch (e) {
  //   console.log(e)
  // }

  console.log('Servidor executando...')
});

//sala fixa, pubsocket temporário, reiniciar o canal pra sala no restart, arraydeobjetosrooms.forEach( (room) => pubsocket.createChannel())