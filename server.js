const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const app = express()

dotenv.config({ path: './config/config.env' })

connectDB();

const Favorite = require('./models/Favorite')

app.use(bodyParser.json())

const server = app.listen(5000, () => {
  console.log('listening on 5000')
})

// Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`)
  server.close(() => process.exit(1))
})

app.get('/favorites', (req, res) => {

})

app.post('/favorites', (req, res) => {
  Favorite.create(req.body)
    .then(data => {
      res.status(201).json(data)
    }).catch(console.error)
})