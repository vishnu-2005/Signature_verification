//models/Accounatant.js
const mongoose = require("mongoose");

const accountantSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
});

module.exports = mongoose.model("Accountant", accountantSchema);
