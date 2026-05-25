const mongoose = require('mongoose')
const notesSchema= mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim:true,
    },
    description:{
        type:String,
        default:"",
        maxlength:200,
    },
    subject:{
        type:String,
        required: true,
        trim:true,
    },
    semester:{
        type:Number,
        required: true,
    },
    pdfUrl:{
        type:String,
        default:"",
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});
module.exports= mongoose.model("Note",notesSchema)