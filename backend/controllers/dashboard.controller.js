const User = require("../models/User");
const Task = require("../models/Task");
const Step = require("../models/Step");
const Roadmap = require("../models/Roadmap");
const SyllabusSection = require("../models/SyllabusSection");

// Helper to calculate days left
const getDaysLeft = (examDate) => {
    if (!examDate) return 0;
    const diffTime = new Date(examDate) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

exports.getDashboardOverview = async (req, res) => {
    try {
        const { uid } = req;
        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.hasRoadmap) {
            return res.json({
                hasRoadmap: false,
                examName: "",
                examDate: "",
                examTimeLeftDays: 0,
                tasks: [],
                syllabus: [],
                userProfile: {
                    name: user.name,
                    email: user.email
                }
            });
        }

        const roadmap = await Roadmap.findOne({ userId: user._id });
        let steps = [];
        if (roadmap) {
            // Get first 3 incomplete steps
            steps = await Step.find({ roadmapId: roadmap._id, completed: false }).sort({ order: 1 }).limit(3);
        }

        // If no steps found (or no roadmap), fallback to tasks (or empty)
        // But the user specifically asked for steps.

        const syllabus = await SyllabusSection.find({ userId: user._id });

        const dashboardData = {
            hasRoadmap: !!roadmap, // specific check
            examName: user.examName || "",
            examDate: user.examDate || "",
            examTimeLeftDays: getDaysLeft(user.examDate),
            tasks: steps.map(t => ({
                id: t._id,
                title: t.title,
                completed: t.completed,
                durationMinutes: 60 // Default duration as Step doesn't have it
            })),
            syllabus: syllabus.map(s => ({
                id: s._id,
                title: s.title,
                completed: s.completed,
                totalTopics: s.totalTopics
            })),
            userProfile: {
                name: user.name,
                email: user.email
            }
        };

        res.json(dashboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
