const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap" },
  syllabusSectionId: { type: mongoose.Schema.Types.ObjectId, ref: "SyllabusSection" },
  title: String,
  type: { type: String, enum: ["reading", "video", "test"] },
  order: Number,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Step", stepSchema);
