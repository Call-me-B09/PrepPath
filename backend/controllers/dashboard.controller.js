const User = require("../models/User");
const Task = require("../models/Task");
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

        const tasks = await Task.find({ userId: user._id });
        const syllabus = await SyllabusSection.find({ userId: user._id });

        const dashboardData = {
            hasRoadmap: true,
            examName: user.examName || "",
            examDate: user.examDate || "",
            examTimeLeftDays: getDaysLeft(user.examDate),
            tasks: tasks.map(t => ({
                id: t._id,
                title: t.title,
                completed: t.completed,
                durationMinutes: t.durationMinutes
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
