const Conversation = require("../models/conversation.model");

// CREATE OR OPEN PRIVATE CHAT
async function createOrOpenConversation(req, res) {

    try {

        const { receiverId } = req.body;

        let conversation = await Conversation.findOne({
            isGroup: false,

            participants: {
                $all: [
                    {
                        $elemMatch: {
                            user: req.user._id
                        }
                    },
                    {
                        $elemMatch: {
                            user: receiverId
                        }
                    }
                ]
            }
        });

        // CREATE NEW IF NOT EXISTS
        if (!conversation) {

            conversation = await Conversation.create({

                isGroup: false,

                participants: [
                    {
                        user: req.user._id,
                        role: "member"
                    },
                    {
                        user: receiverId,
                        role: "member"
                    }
                ],

                createdBy: req.user._id
            });
        }

        // POPULATE USERS
        conversation = await Conversation.findById(conversation._id)
            .populate(
                "participants.user",
                "username email avatar online"
            );

        res.status(200).json(conversation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

// GET USER CONVERSATIONS
async function getUserConversations(req, res) {
    try {

        const conversations = await Conversation.find({
            "participants.user": req.user._id
           
        })
            .populate(
                "participants.user",
                "username email avatar online"
            )
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "username avatar"
                }
            })
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}

async function createGroup(req,res){

    try{

        const {
            groupName,
            participants
        } = req.body;

        if(!groupName){

            return res.status(400).json({
                message:"Group name required"
            });

        }

        if(participants.length < 2){

            return res.status(400).json({
                message:"Minimum 3 members required"
            });

        }

        const users = participants.map(id=>({
            user:id
        }));

        users.push({
            user:req.user._id
        });

        const group = await Conversation.create({

            isGroup:true,

            groupName,

            groupAdmin:req.user._id,

            participants:users

        });

        const populatedGroup =
        await Conversation.findById(group._id)
        .populate("participants.user")
        .populate("groupAdmin");

        res.status(201).json(populatedGroup);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

}


module.exports = {
    createOrOpenConversation,
    getUserConversations,createGroup
};