const Conversation =
    require("../models/conversation.model");

// ADD MEMBER
async function addMembers(req, res) {

    try {

        const { userIds, groupId } = req.body;

        const group = await Conversation.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        // convert existing users to Set
        const existingUsers = new Set(
            group.participants.map(p => p.user.toString())
        );

        const addedUsers = [];

        for (const userId of userIds) {

            if (existingUsers.has(userId)) {
                continue; // already in group
            }

            group.participants.push({
                user: userId,
                role: "member"
            });

            addedUsers.push(userId);
        }

        await group.save();

        const updatedGroup = await Conversation.findById(groupId)
            .populate("participants.user", "username email avatar")
            .populate("admins", "username email avatar");

        global.io.to(groupId).emit("members-added", {
            groupId,
            addedUsers,
            group: updatedGroup
        });

        res.status(200).json(updatedGroup);

    } catch (err) {
        res.status(500).json({
            message: err.message
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
            group.admins.some(
                a => a.toString() === userId
            );

        if (isAdmin) {

            const remainingAdmins = group.admins.filter(
                a => a.toString() !== userId
            );

            if (remainingAdmins.length === 0) {
                return res.status(400).json({
                    message: "Cannot leave group without transferring admin"
                });
            }

            group.admins = remainingAdmins;
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
async function getMembers(req, res) {
    try {

        const group = req.group; // from loadGroup middleware

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        const populatedGroup = await group.populate(
            "participants.user",
            "username email avatar"
        );

        const users = group.participants.map(p => {

            let role = "member";

            if (
                group.admins.some(
                    a => a.toString() === p.user._id.toString()
                )
            ) {
                role = "admin";
            }
            else if (p.role === "moderator") {
                role = "moderator";
            }

            return {
                user: p.user,
                role
            };
        });

        res.json(users);


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}


module.exports = {

    addMembers,

    removeMember,

    leaveGroup,

    getMembers

};