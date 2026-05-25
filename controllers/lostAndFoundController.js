const lostAndFound = require('../models/lostAndFoundModel');
const uploadToCloudinary = require('../utils/upload');
module.exports.createPost = async function(req,res){
    try{
        let image = "";

        if(req.file){

            const result = await uploadToCloudinary(req.file.buffer);

            image = result.secure_url;
        }
        const post = await lostAndFound.create({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            contactInfo: req.body.contactInfo,
            postedBy: req.userId,
            imageUrl: image,
        })
        res.status(201).json({message:"Your request raised successfully"})

    } catch (error){
        res.status(500).json({error:error.message})
    }
};
module.exports.getAllPost = async function(req,res){
    try{
        const post = await lostAndFound.find()
                                 .populate("postedBy")
        res.status(200).json(post);
    } catch (error){
        return res.status(500).json({error:error.message})
    }
};
module.exports.getSinglePost = async function(req,res){
    try{
        const post = await lostAndFound.findById(req.params.id)
                                       .populate("postedBy")
        if(!post) return res.status(404).json({message:"Post not found"});
        res.json(post);
    } catch (error){
       res.status(500).json({error:error.message})
    }
};
module.exports.deletePost = async function(req,res){
    try{
        const post = await lostAndFound.findById(req.params.id)
        if(!post) return res.status(404).json({message:"Post not found"});
        if(post.postedBy.toString() !== req.userId)
            return res.status(403).json({message:"User not authorized"});
        await post.deleteOne();
        res.json({message:"Post deleted successfully"})
    } catch (error){
        res.status(500).json({error:error.message})
    }
};