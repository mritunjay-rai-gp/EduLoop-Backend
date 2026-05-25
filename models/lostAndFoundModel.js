const mongoose = require('mongoose');
const lostAndFoundSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:500,
    },
    imageUrl:{
        type:String,
        required: true,
    },
    location:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        enum:["lost","found","claimed"],
        default:"lost",
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    contactInfo:{
        type:String,
        required:true,
        trim:true,
    }
},{timestamps:true});
module.exports = mongoose.model("LostAndFound",lostAndFoundSchema);