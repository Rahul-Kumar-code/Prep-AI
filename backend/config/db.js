const mongoose = require("mongoose");

const connectDB = async() =>{
  try{
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
    await mongoose.connect(mongoUrl,{});
    console.log("MongoDB connected Successfully");
  }catch(err){
   console.log("Error while connecting to DB :",err);
   process.exit(1);
  }
};

module.exports = connectDB;