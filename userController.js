const User = require("../models/userModel");

// Add new user data
exports.addUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User data saved successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user data
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

