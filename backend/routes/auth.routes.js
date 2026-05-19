const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");

// AUTH ROUTES
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

// FUTURE ROUTES
// router.post("/verify-otp")
// router.post("/refresh-token")
// router.post("/logout")
// router.post("/forgot-password")
// router.post("/reset-password")

module.exports = router;