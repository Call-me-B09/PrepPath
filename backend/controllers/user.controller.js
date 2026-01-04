const User = require("../models/User");

exports.syncUser = async (req, res) => {
    try {
        const { uid, email, name, photoURL } = req.body;

        if (!uid) {
            return res.status(400).json({ message: "UID is required" });
        }

        const updateData = {
            uid,
            email,
            name,
        };

        // Only update photoURL if provided
        if (photoURL) {
            updateData.photoURL = photoURL;
        }

        // Upsert: Create if not exists, otherwise update
        const user = await User.findOneAndUpdate(
            { uid },
            updateData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: "User synced successfully", user });
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
