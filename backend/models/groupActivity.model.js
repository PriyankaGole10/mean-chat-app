const mongoose =
require("mongoose");

const groupActivitySchema =
new mongoose.Schema({

    conversationId:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"Conversation",

        required:true
    },

    actor:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true
    },

    targetUser:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"User"
    },

    action:{
        type:String,

        required:true
    },

    metadata:{
        type:Object,

        default:{}
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "GroupActivity",
    groupActivitySchema
);