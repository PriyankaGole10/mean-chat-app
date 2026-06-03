const express =
require("express");

const router =
express.Router();

const protect =
require("../middleware/auth.middleware");

const {
loadGroup,
requireAdmin,
requireModerator
} = require("../middleware/group.middleware");

const {

    addMembers,

    removeMember,

    leaveGroup,

    getMembers

} =
require("../controllers/group-member.controller");

router.post(
"/add",
protect,
loadGroup,
requireModerator,
addMembers
);

router.post(
"/remove",
protect,
loadGroup,
requireModerator,
removeMember
);

router.post(
"/leave",
protect,
loadGroup,
leaveGroup
);

router.get(
"/:id",
protect,
loadGroup,
getMembers
);

module.exports =
router;