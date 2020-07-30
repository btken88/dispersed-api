const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema({
  user_id: String,
  lat: Number,
  lng: Number,
  note: String
})

module.exports = mongoose.model('Favorite', FavoriteSchema)