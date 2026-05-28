const express = require("express")
const router =express.Router();
const authMiddleware = require("./../middleware/auth.middleware");
const {searchUsers} = require("./../controllers/user.controller");

router.get("/search-user" , authMiddleware, searchUsers);

module.exports = router;
