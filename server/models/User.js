// server/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  // Guarda exatamente o objecto do localStorage (pode ser object ou array)
  pokedex: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
