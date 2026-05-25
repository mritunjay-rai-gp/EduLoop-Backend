const mongoose = require('mongoose');
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected successfully")
    } catch(error){
        console.log("MongoDB Connection Error",error.message);
        
    }
}
module.exports = connectDB;