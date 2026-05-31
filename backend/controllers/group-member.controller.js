const Conversation =
require("../models/conversation.model");

// ADD MEMBER
async function addMember(
    req,
    res
) {

    try {

        const {
            userId,
            groupId
        } = req.body;

        const group =
        await Conversation.findById(groupId);

        if (!group) {

            return res.status(404).json({
                message: "Group not found"
            });

        }

        const exists =
        group.participants.find(
            p =>
            p.user.toString() ===
            userId
        );

        const isAdminUser =
        group.groupAdmin.toString() ===
        userId;

        if (
            exists ||
            isAdminUser
        ) {

            return res.status(400).json({
                message:
                "User already exists in group"
            });

        }

        group.participants.push({

            user: userId,

            role: "member"

        });

        await group.save();

        const updatedGroup =
        await Conversation.findById(
            group._id
        )
        .populate(
            "participants.user",
            "username email avatar"
        );

        // 🔥 REAL TIME UPDATE
        global.io.to(groupId).emit(
            "member-added",
            {
                groupId,
                userId,
                group: updatedGroup
            }
        );

        res.status(200).json(
            updatedGroup
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// REMOVE MEMBER
async function removeMember(
    req,
    res
) {

    try {

        const {
            userId,
            groupId
        } = req.body;

        const group =
        await Conversation.findById(groupId);

        if (!group) {

            return res.status(404).json({
                message: "Group not found"
            });

        }

        const target =
        group.participants.find(
            p =>
            p.user.toString() ===
            userId
        );

        if (!target) {

            return res.status(404).json({
                message:
                "Member not found"
            });

        }

        // REMOVE MEMBER
        group.participants =
        group.participants.filter(
            p =>
            p.user.toString() !==
            userId
        );

        await group.save();

        // 🔥 REAL TIME UPDATE
        global.io.to(groupId).emit(
            "member-removed",
            {
                groupId,
                userId,
                removedBy: req.user._id
            }
        );

        res.status(200).json({
            message:
            "Member removed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// LEAVE GROUP
async function leaveGroup(
    req,
    res
) {

    try {

        const {
            groupId
        } = req.body;

        const userId =
        req.user._id.toString();

        const group =
        await Conversation.findById(groupId);

        if (!group) {

            return res.status(404).json({
                message: "Group not found"
            });

        }

        const isAdmin =
        group.groupAdmin.toString() ===
        userId;

        if (isAdmin) {

            return res.status(400).json({
                message:
                "Transfer admin before leaving group"
            });

        }

        group.participants =
        group.participants.filter(
            p =>
            p.user.toString() !==
            userId
        );

        await group.save();

        // leave socket room
        global.io.to(groupId).emit(
            "member-left",
            {
                groupId,
                userId
            }
        );

        res.status(200).json({
            message:
            "Left group successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

// GET MEMBERS
async function getMembers(
    req,
    res
) {

    try {

        const group =
        await Conversation.findById(
            req.params.id
        )
        .populate(
            "groupAdmin",
            "username email avatar"
        )
        .populate(
            "participants.user",
            "username email avatar"
        );

        const moderators =
        group.participants.filter(
            p =>
            p.role === "moderator"
        );

        const members =
        group.participants.filter(
            p =>
            p.role === "member"
        );

        res.status(200).json({

            admin:
            group.groupAdmin,

            moderators,

            members

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

module.exports = {

    addMember,

    removeMember,

    leaveGroup,

    getMembers

};