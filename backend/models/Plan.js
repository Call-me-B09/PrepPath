const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    examName: String,
    level: String,
    dailyCommitment: String,
    examDate: Date,
    syllabusText: String, // Extracted text from Syllabus PDF
    pyqText: String,      // Extracted text from PYQ PDF
}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);
