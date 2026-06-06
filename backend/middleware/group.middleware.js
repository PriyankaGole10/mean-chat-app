const Conversation = require("../models/conversation.model");
const { isAdmin, isModerator, isMember } = require("../utils/group-permission");



async function loadGroup(req, res, next) {

    try {

        // console.log("LOAD GROUP HIT");

        const group = await Conversation.findById(
            req.params.groupId ||
            req.params.id ||
            req.body.groupId
        );

        if (!group || !group.isGroup) {

            return res.status(404).json({
                message: "Group not found"
            });

        }



        req.group = group;

        req.isAdmin = isAdmin(group, req.user._id);
        req.isModerator = isModerator(group, req.user._id);

        req.isMember =
            group.participants.some(
                p =>
                    p.user.toString() ===
                    req.user._id.toString()
            );


        next();

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

}



function requireAdmin(req, res, next) {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Admin required" });
    }
    next();
}

function requireModerator(req, res, next) {
    if (req.isAdmin || req.isModerator) {
        return next();
    }
    return res.status(403).json({ message: "Moderator required" });
}

module.exports = { loadGroup, requireAdmin, requireModerator };