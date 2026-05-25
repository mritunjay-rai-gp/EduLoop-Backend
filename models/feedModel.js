const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    text:{
        type:String,
        required:true,
        trim:true,
    }

},{timestamps:true});

const feedSchema = mongoose.Schema({

    content:{
        type:String,
        required:true,
        trim:true,
        maxlength:500,
    },

    image:{
        type:String,
        default:"",
    },

    category:{
        type:String,

        enum:[
            "announcement",
            "achievement",
            "club",
            "discussion",
            "opportunity"
        ],

        default:"discussion",
    },

    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],

    comments:[commentSchema]

},{timestamps:true});

module.exports = mongoose.model("Feed",feedSchema);