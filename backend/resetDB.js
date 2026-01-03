const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Roadmap = require("./models/Roadmap");
const Step = require("./models/Step");
const SyllabusSection = require("./models/SyllabusSection");
const Plan = require("./models/Plan");
const Task = require("./models/Task");

const resetDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        console.log("⚠️  Wiping all data...");

        await User.deleteMany({});
        console.log("✅ Users deleted");

        await Roadmap.deleteMany({});
        console.log("✅ Roadmaps deleted");

        await Step.deleteMany({});
        console.log("✅ Steps deleted");

        await SyllabusSection.deleteMany({});
        console.log("✅ SyllabusSections deleted");

        await Plan.deleteMany({});
        console.log("✅ Plans deleted");

        await Task.deleteMany({});
        console.log("✅ Tasks deleted");

        console.log("🎉 Database cleared successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting DB:", error);
        process.exit(1);
    }
};

resetDB();
