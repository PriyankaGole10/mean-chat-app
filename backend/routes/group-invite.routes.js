const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");

const {
    createInviteLink,
    disableInviteLink,
    joinViaInvite,
    getPendingRequests,
    approveJoinRequest,
    rejectJoinRequest
} = require("../controllers/group-invite.controller");

const {
    loadGroup,
    requireAdmin,
    requireModerator
} = require("../middleware/group.middleware");

// CREATE INVITE LINK (ADMIN + MODERATOR)
router.post(
    "/:id/invite",
    protect,
    loadGroup,
    requireModerator,
    createInviteLink
);

// DISABLE INVITE LINK (ADMIN ONLY)
router.delete(
    "/invite/:inviteCode",
    protect,
  
    requireAdmin,
    disableInviteLink
);

// JOIN GROUP VIA INVITE (USER)
router.post(
    "/join/:inviteCode",
    protect,
    joinViaInvite
);

// GET PENDING REQUESTS (ADMIN + MODERATOR)
router.get(
    "/:id/pending-requests",
    protect,
    loadGroup,
    requireModerator,
    getPendingRequests
);

// APPROVE JOIN REQUEST (ADMIN + MODERATOR)
router.patch(
    "/:id/approve-request/:requestId",
    protect,
    approveJoinRequest
);

// REJECT JOIN REQUEST (ADMIN + MODERATOR)
router.patch(
    "/:id/reject-request/:requestId",
    protect,
    rejectJoinRequest
);

module.exports = router;