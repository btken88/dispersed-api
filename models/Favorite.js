const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  note: String
})

module.exports = mongoose.model('Favorite', FavoriteSchema)