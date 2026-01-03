const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const mockUid = "test-firebase-uid-123"; // Matches mockAuth.js

        let user = await User.findOne({ uid: mockUid });

        if (!user) {
            user = await User.create({
                uid: mockUid,
                name: "Test User",
                email: "test@example.com",
                hasRoadmap: false,
            });
            console.log("User created:", user);
        } else {
            console.log("User already exists:", user);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }
};

seedUser();
