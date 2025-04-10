//models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true, required: true },
  originalSignature: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);
