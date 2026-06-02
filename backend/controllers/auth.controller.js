const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

// REGISTER USER
async function registerUser(req, res) {

    try {

        const { username, email, password } = req.body;

        // CHECK EXISTING USER
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // CREATE USER
        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            success: true,

            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            },

            token: generateToken(user._id)
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

// LOGIN USER
async function loginUser(req, res) {

    try {

        const { email, password } = req.body;

        // FIND USER
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // MATCH PASSWORD
        const isMatchedPassword = await user.matchPassword(password);

        if (!isMatchedPassword) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // UPDATE ONLINE STATUS
        user.online = true;
        await user.save();

        res.status(200).json({
            success: true,

            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                 blockedUsers: user.blockedUsers
            },

            token: generateToken(user._id)
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

// GET CURRENT USER
async function getMe(req, res) {

    try {

        res.status(200).json({
            success: true,
            user: req.user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getMe
};