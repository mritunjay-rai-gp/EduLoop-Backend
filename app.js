require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors')
const connectDB = require('./config/mongooseConnection');
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoutes");
const lostAndFoundRouter = require("./routes/lostAndFoundRoutes");
const eventRouter = require('./routes/eventRoutes');
const feedRouter = require('./routes/feedRoutes');
connectDB();
const PORT= process.env.PORT || 3000;
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://eduloop-rouge.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/user",userRouter);
app.use("/note",noteRouter);
app.use("/lostAndFound",lostAndFoundRouter);
app.use("/event",eventRouter);
app.use("/feed",feedRouter);
app.listen(PORT,()=>console.log("Server is connected on",PORT));
