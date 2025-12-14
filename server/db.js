// server/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || '';

if(!MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

module.exports = mongoose;
