const Conversation = require("../models/conversation.model");

async function updateGroupName(req, res) {
    try {
        const { groupId, name } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.groupName = name;
        await group.save();
        const updatedGroup = await Conversation.findById(groupId).populate("participants.user", "username email avatar");
        global.io.to(groupId).emit("group-updated", { groupId, type: "name", value: name });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateGroupDescription(req, res) {
    try {
        const { groupId, description } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.groupDescription = description;
        await group.save();
        const updatedGroup = await Conversation.findById(groupId);
        global.io.to(groupId).emit("group-updated", { groupId, type: "description", value: description });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateGroupImage(req, res) {
    try {
        const { groupId, image } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.groupImage = image;
        await group.save();
        global.io.to(groupId).emit("group-updated", { groupId, type: "image", value: image });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function toggleAdminOnlyMessage(req, res) {
    try {
        const { groupId } = req.body;
        const group = await Conversation.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        group.messagePermission = group.messagePermission === "everyone" ? "admins" : "everyone";
        await group.save();
        global.io.to(groupId).emit("group-updated", { groupId, type: "messagePermission", value: group.messagePermission });
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { updateGroupName, updateGroupDescription, updateGroupImage, toggleAdminOnlyMessage };