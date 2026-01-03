const mongoose = require("mongoose");

const syllabusSectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    completed: { type: Number, default: 0 }, // 0-100
    totalTopics: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("SyllabusSection", syllabusSectionSchema);
