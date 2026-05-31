// socket/group.socket.js

function initializeGroupSocket(
    io,
    socket
) {

    // JOIN GROUP ROOM
    socket.on(
        "join-group",
        (groupId) => {

            socket.join(groupId);

        }
    );

    // LEAVE GROUP ROOM
    socket.on(
        "leave-group",
        (groupId) => {

            socket.leave(groupId);

        }
    );

    // GROUP CREATED
    socket.on(
        "group-created",
        (groupData) => {

            io.emit(
                "group-created",
                groupData
            );

        }
    );

    // MEMBER ADDED
    socket.on(
        "member-added",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "member-added",
                data
            );

        }
    );

    // MEMBER REMOVED
    socket.on(
        "member-removed",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "member-removed",
                data
            );

        }
    );

    // MODERATOR PROMOTED
    socket.on(
        "moderator-promoted",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "moderator-promoted",
                data
            );

        }
    );

    // MODERATOR DEMOTED
    socket.on(
        "moderator-demoted",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "moderator-demoted",
                data
            );

        }
    );

    // ADMIN TRANSFERRED
    socket.on(
        "admin-transferred",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "admin-transferred",
                data
            );

        }
    );

    // GROUP SETTINGS UPDATED
    socket.on(
        "group-settings-updated",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "group-settings-updated",
                data
            );

        }
    );

    // GROUP IMAGE UPDATED
    socket.on(
        "group-image-updated",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "group-image-updated",
                data
            );

        }
    );

    // GROUP NAME UPDATED
    socket.on(
        "group-name-updated",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "group-name-updated",
                data
            );

        }
    );

    // INVITE CREATED
    socket.on(
        "invite-created",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "invite-created",
                data
            );

        }
    );

    // JOIN REQUEST CREATED
    socket.on(
        "join-request-created",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "join-request-created",
                data
            );

        }
    );

    // JOIN REQUEST APPROVED
    socket.on(
        "join-request-approved",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "join-request-approved",
                data
            );

        }
    );

    // JOIN REQUEST REJECTED
    socket.on(
        "join-request-rejected",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "join-request-rejected",
                data
            );

        }
    );

    // MESSAGE PINNED
    socket.on(
        "message-pinned",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "message-pinned",
                data
            );

        }
    );

    // MESSAGE UNPINNED
    socket.on(
        "message-unpinned",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "message-unpinned",
                data
            );

        }
    );

    // GROUP DELETED
    socket.on(
        "group-deleted",
        (data) => {

            io.to(
                data.groupId
            ).emit(
                "group-deleted",
                data
            );

        }
    );

}

module.exports =
initializeGroupSocket;