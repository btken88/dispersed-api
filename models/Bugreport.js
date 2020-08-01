const mongoose = require('mongoose')

const BugreportSchema = new mongoose.Schema({
  name: String,
  email: String,
  bug: String
})

module.exports = mongoose.model('Bugreport', BugreportSchema)