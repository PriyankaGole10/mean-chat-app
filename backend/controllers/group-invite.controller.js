const crypto =
    require("crypto");

const Conversation =
    require("../models/conversation.model");

const GroupInvite =
    require("../models/groupInvite.model");

const GroupJoinRequest =
    require("../models/groupJoinRequest.model");

// CREATE INVITE LINK
async function createInviteLink(
    req,
    res
) {

    try {

        const group =
            req.group;

        const inviteCode =
            crypto.randomBytes(16)
                .toString("hex");

        const invite =
            await GroupInvite.create({

                conversationId:
                    group._id,

                inviteCode,

                createdBy:
                    req.user._id

            });

        res.status(201).json({

            message:
                "Invite link created",

            inviteCode,

            invite

        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

}

// DISABLE INVITE LINK
async function disableInviteLink(
    req,
    res
) {

    try {

        const {
            inviteCode
        } = req.params;

        const invite =
            await GroupInvite.findOne({
                inviteCode
            });

        if (!invite) {

            return res.status(404).json({
                message:
                    "Invite not found"
            });

        }

        invite.isActive =
            false;

        await invite.save();

        res.status(200).json({

            message:
                "Invite disabled"

        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

}

// JOIN GROUP USING INVITE
async function joinViaInvite(
    req,
    res
) {

    try {

        const {
            inviteCode
        } = req.params;

        const invite =
            await GroupInvite.findOne({

                inviteCode,

                isActive: true

            });

        if (!invite) {

            return res.status(404).json({

                message:
                    "Invalid invite"

            });

        }

        const group =
            await Conversation.findById(
                invite.conversationId
            );

        if (!group) {

            return res.status(404).json({

                message:
                    "Group not found"

            });

        }

        const alreadyMember =
            group.participants.some(
                p => p.user.toString() === req.user._id.toString()
            );

        const isAdmin =
            group.admins.some(
                a => a.toString() === req.user._id.toString()
            );

        if (alreadyMember || isAdmin) {
            return res.status(400).json({
                message: "Already a member"
            });
        }

        // JOIN APPROVAL ENABLED
        if (
            group.joinApprovalRequired
        ) {

            const exists =
                await GroupJoinRequest.findOne({

                    conversationId:
                        group._id,

                    user:
                        req.user._id,

                    status:
                        "pending"

                });

            if (exists) {

                return res.status(400).json({

                    message:
                        "Request already pending"

                });

            }

            await GroupJoinRequest.create({

                conversationId:
                    group._id,

                user:
                    req.user._id

            });

            return res.status(200).json({

                message:
                    "Join request sent"

            });

        }

        group.participants.push({

            user:
                req.user._id,

            role:
                "member"

        });

        await group.save();

        invite.usedCount += 1;

        await invite.save();

        res.status(200).json({

            message:
                "Joined group successfully"

        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

}

// GET PENDING REQUESTS
async function getPendingRequests(
    req,
    res
) {

    try {

        const requests =
            await GroupJoinRequest.find({

                conversationId:
                    req.params.id,

                status:
                    "pending"

            })
                .populate(
                    "user",
                    "username email avatar"
                );

        res.status(200).json(
            requests
        );

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

}

// APPROVE REQUEST
async function approveJoinRequest(
    req,
    res
) {

    try {

        const {
            requestId
        } = req.params;

        const request =
            await GroupJoinRequest.findById(
                requestId
            );

        if (!request) {

            return res.status(404).json({

                message:
                    "Request not found"

            });

        }

        const group =
            await Conversation.findById(
                request.conversationId
            );

        group.participants.push({

            user:
                request.user,

            role:
                "member"

        });

        await group.save();

        request.status =
            "approved";

        await request.save();

        res.status(200).json({

            message:
                "Request approved"

        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

}

// REJECT REQUEST
async function rejectJoinRequest(
    req,
    res
) {

    try {

        const {
            requestId
        } = req.params;

        const request =
            await GroupJoinRequest.findById(
                requestId
            );

        if (!request) {

            return res.status(404).json({

                message:
                    "Request not found"

            });

        }

        request.status =
            "rejected";

        await request.save();

        res.status(200).json({

            message:
                "Request rejected"

        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

}

module.exports = {

    createInviteLink,

    disableInviteLink,

    joinViaInvite,

    getPendingRequests,

    approveJoinRequest,

    rejectJoinRequest

};