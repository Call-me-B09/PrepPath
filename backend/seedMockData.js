const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Task = require("./models/Task");
const SyllabusSection = require("./models/SyllabusSection");

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const mockUid = "test-firebase-uid-123";

        // 1. Find User
        let user = await User.findOne({ uid: mockUid });
        if (!user) {
            console.log("User not found, creating base user...");
            user = await User.create({
                uid: mockUid,
                name: "Adhiraj Pal",
                email: "adhiraj@example.com",
                hasRoadmap: false
            });
        }

        // 2. Update User to NO REQUEST state
        user.name = "Adhiraj Pal";
        user.email = "adhiraj@example.com";
        user.hasRoadmap = false;
        user.examName = "";
        user.examDate = null;
        await user.save();
        console.log("User reset to initial state (no roadmap)");

        // 3. Clear existing Tasks/Syllabus/Steps for this user
        await Task.deleteMany({ userId: user._id });
        await SyllabusSection.deleteMany({ userId: user._id });
        const roadmap = await require("./models/Roadmap").findOne({ userId: user._id });
        if (roadmap) {
            await require("./models/Step").deleteMany({ roadmapId: roadmap._id });
            await require("./models/Roadmap").deleteOne({ _id: roadmap._id });
        }
        console.log("Cleared existing Roadmap, Steps, Syllabus, and Tasks");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
