const Conversation = require("../models/conversation.model");
const { isAdmin } = require("../utils/group-permission");

// ADD ADMIN
async function addAdmin(req, res) {
    try {
        const { groupId, userId } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (!isAdmin(group, req.user._id)) {
            return res.status(403).json({ message: "Only admin can promote" });
        }
        const exists = group.admins.find(a => a.toString() === userId);
        if (exists) return res.status(400).json({ message: "Already admin" });
        group.admins.push(userId);
        await group.save();
        const updatedGroup = await Conversation.findById(groupId).populate("participants.user", "username email avatar");
        global.io.to(groupId).emit("role-updated", { groupId, userId, role: "admin" });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// REMOVE ADMIN
async function removeAdmin(req, res) {
    try {
        const { groupId, userId } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (!isAdmin(group, req.user._id)) {
            return res.status(403).json({ message: "Only admin can demote" });
        }
        if (group.createdBy.toString() === userId) {
            return res.status(400).json({ message: "Cannot remove creator" });
        }
        group.admins = group.admins.filter(a => a.toString() !== userId);
        await group.save();
        global.io.to(groupId).emit("role-updated", { groupId, userId, role: "member" });
        res.status(200).json({ message: "Admin removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// MAKE MODERATOR
async function makeModerator(req, res) {
    try {
        const { groupId, userId } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (!isAdmin(group, req.user._id)) {
            return res.status(403).json({ message: "Only admin can assign moderator" });
        }
        const participant = group.participants.find(p => p.user.toString() === userId);
        if (!participant) return res.status(404).json({ message: "User not found" });
        participant.role = "moderator";
        await group.save();
        global.io.to(groupId).emit("role-updated", { groupId, userId, role: "moderator" });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// REMOVE MODERATOR
async function removeModerator(req, res) {
    try {
        const { groupId, userId } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        if (!isAdmin(group, req.user._id)) {
            return res.status(403).json({ message: "Only admin can remove moderator" });
        }
        const participant = group.participants.find(p => p.user.toString() === userId);
        if (!participant) return res.status(404).json({ message: "User not found" });
        participant.role = "member";
        await group.save();
        global.io.to(groupId).emit("role-updated", { groupId, userId, role: "member" });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addAdmin, removeAdmin, makeModerator, removeModerator };