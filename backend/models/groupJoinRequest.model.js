const mongoose =
require("mongoose");

const groupJoinRequestSchema =
new mongoose.Schema({

    conversationId:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"Conversation",

        required:true
    },

    user:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true
    },

    status:{
        type:String,

        enum:[
            "pending",
            "approved",
            "rejected"
        ],

        default:"pending"
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "GroupJoinRequest",
    groupJoinRequestSchema
);