const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  hasRoadmap: { type: Boolean, default: false },
  examName: String,
  examDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
