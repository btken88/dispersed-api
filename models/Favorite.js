const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  notes: String
})

module.exports = mongoose.model('Favorite', FavoriteSchema)