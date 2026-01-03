const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  status: { type: String, enum: ["active", "completed"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Roadmap", roadmapSchema);
