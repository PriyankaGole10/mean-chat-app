const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");

const {
updateGroupName,
updateGroupDescription,
updateGroupImage,
toggleAdminOnlyMessage
} = require("../controllers/group-settings.controller");

const {
loadGroup,
requireAdmin
} = require("../middleware/group.middleware");

// UPDATE NAME
router.put("/name", protect, loadGroup, requireAdmin, updateGroupName);

// UPDATE DESCRIPTION
router.put("/description", protect, loadGroup, requireAdmin, updateGroupDescription);

// UPDATE IMAGE
router.put("/image", protect, loadGroup, requireAdmin, updateGroupImage);

// TOGGLE MESSAGE PERMISSION
router.put("/toggle-message", protect, loadGroup, requireAdmin, toggleAdminOnlyMessage);

module.exports = router;