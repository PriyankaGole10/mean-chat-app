const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { loadGroup, requireAdmin } = require("../middleware/group.middleware");
const { addAdmin, removeAdmin, makeModerator, removeModerator } = require("../controllers/group-role.controller");

router.post("/add-admin", protect, loadGroup, requireAdmin, addAdmin);
router.post("/remove-admin", protect, loadGroup, requireAdmin, removeAdmin);
router.post("/make-moderator", protect, loadGroup, requireAdmin, makeModerator);
router.post("/remove-moderator", protect, loadGroup, requireAdmin, removeModerator);

module.exports = router;