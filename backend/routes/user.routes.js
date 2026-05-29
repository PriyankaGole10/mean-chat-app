const express = require("express")
const router =express.Router();
const protect = require("../middleware/auth.middleware");
const {searchUsers,getAllUsers} = require("./../controllers/user.controller");

router.get("/search-user" , protect, searchUsers);
router.get("/all-users" , protect, getAllUsers);



module.exports = router;
