const Note = require('../models/notesModel');

const uploadToCloudinary = require('../utils/upload');

module.exports.createNotes = async function(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "PDF file is required"
            });
        }
        const result = await uploadToCloudinary(req.file.buffer);

        const note = await Note.create({

            title: req.body.title,

            description: req.body.description,

            subject: req.body.subject,

            semester: req.body.semester,

            pdfUrl: result.secure_url,

            uploadedBy: req.userId
        });

        return res.status(201).json({

            message: "Note uploaded successfully",

            note
        });

    } catch (error) {

        return res.status(500).json({

            error: error.message
        });
    }
};
module.exports.getAllNotes = async function(req,res){
    try{
        const notes= await Note.find()
                         .populate("uploadedBy")
        res.status(200).json(notes);
    } catch (error){
        return res.status(500).json({error:error.message})
    }
}
module.exports.getSingleNote = async function(req,res){
    try{
        const note = await Note.findById(req.params.id)
                                .populate("uploadedBy")
        if(!note) return res.status(404).json({message:"Note not found"});
        res.json(note);
    } catch (error){
        res.status(500).json({error:error.message})
    }
}
module.exports.deleteNote = async function(req,res){
    try{
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"Note not found"});
        if(note.uploadedBy.toString() !== req.userId)
            return res.status(403).json({message:"User not authorized"});
        await note.deleteOne();
        res.json({message:"Note deleted successfully"})
    } catch(error){
        res.status(500).json({error:error.message})
    }
}