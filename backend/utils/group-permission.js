function isAdmin(group, userId) {
    return group.admins.some(a => a.toString() === userId.toString());
}

function isModerator(group, userId) {
    const participant = group.participants.find(p => p.user.toString() === userId.toString());
    return participant?.role === "moderator";
}

function isMember(group, userId) {
    return group.participants.some(p => p.user.toString() === userId.toString());
}

function canManageMembers(group, userId) {
    return isAdmin(group, userId);
}

function canEditGroup(group, userId) {
    return isAdmin(group, userId);
}

function canSendMessage(group, userId) {
    if (group.messagePermission === "everyone") return true;
    return isAdmin(group, userId) || isModerator(group, userId);
}

module.exports = { isAdmin, isModerator, isMember, canManageMembers, canEditGroup, canSendMessage };