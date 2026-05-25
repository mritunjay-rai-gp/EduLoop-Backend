const Event = require('../models/eventModel');
const upload = require('../utils/upload');
module.exports.createEvent= async function(req,res) {
    try{
        let imageUrl = "";

        if(req.file){

            const result = await upload(req.file.buffer);

            imageUrl = result.secure_url;
        }
      const event = await Event.create({
          title:req.body.title,
          description:req.body.description,
          bannerImage:imageUrl,
          date:req.body.date,
          time:req.body.time,
          location:req.body.location,
          organizedBy:req.body.organizedBy,
          category: req.body.category,
          createdBy:req.userId,
        })
      res.status(201).json({message:"Event is created successfully"})
   }catch(error){
    return res.status(500).json({error:error.message})
   }
}
module.exports.getAllEvent = async function(req,res){
    try{
        const event = await Event.find()
                                 .populate("createdBy")
        res.status(200).json(event);
    } catch (error){
        return res.status(500).json({error:error.message})
    }
};
module.exports.getSingleEvent = async function(req,res){
    try{
        const event = await Event.findById(req.params.id)
                                       .populate("createdBy")
        if(!event) return res.status(404).json({message:"Event not found"});
        res.status(200).json(event);
    } catch (error){
       res.status(500).json({error:error.message})
    }
};
module.exports.deleteEvent = async function(req,res){
    try{
        const event = await Event.findById(req.params.id)
        if(!event) return res.status(404).json({message:"Event not found"});
        if(event.createdBy.toString() !== req.userId)
            return res.status(403).json({message:"User not authorized"});
        await event.deleteOne();
        res.json({message:"Event deleted successfully"})
    } catch (error){
        res.status(500).json({error:error.message})
    }
};