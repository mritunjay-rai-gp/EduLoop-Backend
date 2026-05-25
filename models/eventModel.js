const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        maxlength:500,
    },
    bannerImage:{
        type:String,
        required:true,
    },
    date:{
        type: Date,
        required: true,
    },
    time:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    organizedBy:{
        type:String,
        required: true,
    },
    category:{
        type:String,
        enum:["tech","sports","cultural","workshop","seminar","hackathon"],
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps:true})
module.exports= mongoose.model("Event",eventSchema);