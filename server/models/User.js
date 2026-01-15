const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  pokedex: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('User', UserSchema);
