const User = require("../models/User");
const Roadmap = require("../models/Roadmap");
const Step = require("../models/Step");
const Plan = require("../models/Plan");
const SyllabusSection = require("../models/SyllabusSection");
const multer = require("multer");
const { extractTextFromPDF } = require("../services/ocr.service");
const { generateRoadmapData } = require("../services/ai.service");

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export middleware for use in routes
exports.uploadMiddleware = upload.fields([
  { name: 'syllabusFile', maxCount: 1 },
  { name: 'pyqFile', maxCount: 1 }
]);

exports.createRoadmap = async (req, res) => {
  console.log("--------------------------------------------------");
  console.log("🚀 [createRoadmap] Request Received");
  console.log("--------------------------------------------------");

  try {
    const { examName, days, hours, minutes, level, commitment } = req.body;
    const { uid } = req;

    console.log(`📋 Request Details:`);
    console.log(`   - Exam: ${examName}`);
    console.log(`   - User UID: ${uid}`);
    console.log(`   - Time: ${days}d ${hours}h ${minutes}m`);
    console.log(`   - Level: ${level}`);
    console.log(`   - Commitment: ${commitment}`);

    // Convert time to date
    const totalMinutes = (parseInt(days || 0) * 24 * 60) + (parseInt(hours || 0) * 60) + parseInt(minutes || 0);
    const examDate = new Date();
    examDate.setMinutes(examDate.getMinutes() + totalMinutes);

    const user = await User.findOne({ uid });
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`✅ User found: ${user._id}`);

    // Handle Files & OCR
    let syllabusText = "";
    let pyqText = "";

    console.log("📂 Processing Files...");

    if (req.files) {
      if (req.files.syllabusFile && req.files.syllabusFile[0]) {
        console.log("   - Syllabus file detected. Extracting text...");
        try {
          syllabusText = await extractTextFromPDF(req.files.syllabusFile[0].buffer);
          console.log(`   ✅ Syllabus extracted: ${syllabusText.length} characters`);
        } catch (error) {
          console.error("   ❌ Error extracting syllabus text:", error.message);
        }
      } else {
        console.log("   - No Syllabus file uploaded.");
      }

      if (req.files.pyqFile && req.files.pyqFile[0]) {
        console.log("   - PYQ file detected. Extracting text...");
        try {
          pyqText = await extractTextFromPDF(req.files.pyqFile[0].buffer);
          console.log(`   ✅ PYQ extracted: ${pyqText.length} characters`);
        } catch (error) {
          console.error("   ❌ Error extracting PYQ text:", error.message);
        }
      } else {
        console.log("   - No PYQ file uploaded.");
      }
    } else {
      console.log("   - No files attached to request.");
    }

    // Create Plan in new Collection
    console.log("💾 Saving 'Plan' audit log...");
    const newPlan = await Plan.create({
      userId: user._id,
      examName,
      level,
      dailyCommitment: commitment,
      examDate,
      syllabusText: syllabusText ? "Extracted" : "None",
      pyqText: pyqText ? "Extracted" : "None"
    });
    console.log(`   ✅ Plan saved (ID: ${newPlan._id})`);

    // --- CLEANUP: Enforce Single Roadmap Policy ---
    console.log("🧹 Cleanup: Removing existing roadmap data for user...");

    // 1. Find existing roadmaps to get their IDs (for step deletion if needed, though we can query by roadmapId)
    // Actually, we can just wipe Steps for any roadmap belonging to this user? 
    // Easier: Find all roadmaps for user, then delete steps with those roadmapIds.
    const existingRoadmaps = await Roadmap.find({ userId: user._id });
    const existingRoadmapIds = existingRoadmaps.map(r => r._id);

    if (existingRoadmapIds.length > 0) {
      await Step.deleteMany({ roadmapId: { $in: existingRoadmapIds } });
      console.log(`   - Deleted Steps for ${existingRoadmapIds.length} old roadmaps.`);

      await Roadmap.deleteMany({ userId: user._id });
      console.log(`   - Deleted ${existingRoadmapIds.length} old Roadmap documents.`);
    }

    // 2. Delete Syllabus Sections (Since they are linked to User only)
    const deletedSections = await SyllabusSection.deleteMany({ userId: user._id });
    console.log(`   - Deleted ${deletedSections.deletedCount} old Syllabus Sections.`);
    // ----------------------------------------------

    // --- Gemini AI Integration (via Service) ---
    console.log("🤖 Calling AI Service to generate roadmap...");
    let aiData;
    try {
      aiData = await generateRoadmapData({
        examName,
        level,
        commitment,
        days,
        hours,
        syllabusText,
        pyqText
      });
      console.log("✅ AI Service returned data successfully.");
      console.log(`   - Subjects proposed: ${aiData.subjects?.length || 0}`);
      console.log(`   - Steps proposed: ${aiData.steps?.length || 0}`);
    } catch (e) {
      console.error("❌ AI Service Failed:", e.message);
      return res.status(500).json({ message: "AI generation failed", error: e.message });
    }

    // --- Save to Database ---
    console.log("💾 Saving Roadmap to Database...");

    // 1. Create Roadmap
    const roadmap = await Roadmap.create({
      userId: user._id,
      title: examName,
    });
    console.log(`   - Roadmap document created (ID: ${roadmap._id})`);

    // 2. Create Syllabus Sections
    const subjectMap = {};
    let newSectionsCount = 0;
    if (aiData.subjects && Array.isArray(aiData.subjects)) {
      for (const subjectName of aiData.subjects) {
        const section = await SyllabusSection.create({
          title: subjectName,
          userId: user._id,
          totalTopics: 0,
          completed: 0
        });
        subjectMap[subjectName] = section._id;
        newSectionsCount++;
      }
    }
    console.log(`   - Created ${newSectionsCount} Syllabus Sections.`);

    // Default subject logic
    let defaultSectionId;
    if (Object.keys(subjectMap).length === 0) {
      console.log("   ⚠️ No subjects returned by AI. Creating 'General' section.");
      const defaultSection = await SyllabusSection.create({ title: "General", userId: user._id });
      defaultSectionId = defaultSection._id;
      subjectMap["General"] = defaultSectionId;
    } else {
      defaultSectionId = Object.values(subjectMap)[0];
    }

    // 3. Create Steps
    console.log("   - Inserting Steps...");
    const stepsToInsert = [];
    if (aiData.steps && Array.isArray(aiData.steps)) {
      for (let i = 0; i < aiData.steps.length; i++) {
        const step = aiData.steps[i];
        stepsToInsert.push({
          roadmapId: roadmap._id,
          syllabusSectionId: subjectMap[step.subject] || defaultSectionId,
          title: step.title,
          type: (step.type === "practice" || step.type === "test") ? "test" : "reading",
          order: i + 1,
          completed: false
        });
      }
    }

    await Step.insertMany(stepsToInsert);
    console.log(`   ✅ Inserted ${stepsToInsert.length} steps.`);

    // 4. Update Syllabus Counts
    console.log("   - Updating Syllabus topic counts...");
    for (const subjectName in subjectMap) {
      const sectionId = subjectMap[subjectName];
      const count = stepsToInsert.filter(s => s.syllabusSectionId === sectionId).length;
      await SyllabusSection.findByIdAndUpdate(sectionId, { totalTopics: count });
    }

    // Update User Flags
    user.hasRoadmap = true;
    user.examName = examName;
    user.examDate = examDate;
    await user.save();
    console.log("   ✅ User flags updated.");

    console.log("🎉 [createRoadmap] Process Complete. Sending response.");
    res.json({
      roadmapId: roadmap._id,
      planId: newPlan._id,
      message: "AI Roadmap created successfully"
    });

  } catch (err) {
    console.error("❌ [createRoadmap] Server Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getActiveRoadmap = async (req, res) => {
  const { uid } = req;
  // console.log(`[getActiveRoadmap] Request for uid: ${uid}`); // Optional: Log this too if needed

  const user = await User.findOne({ uid });
  if (!user) return res.status(404).json({ message: "User not found" });

  const roadmap = await Roadmap.findOne({ userId: user._id, status: "active" });
  if (!roadmap) return res.json({ message: "No active roadmap" });

  const steps = await Step.find({ roadmapId: roadmap._id }).sort("order");

  res.json({ roadmap, steps });
};
