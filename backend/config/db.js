const mongoose = require("mongoose");

const connectDB = async() =>{
  try{
    await mongoose.connect(process.env.MONGO_URL,{});
    console.log("MongoDB connected Successfully");
  }catch(err){
   console.log("Error while connecting to DB :",err);
   process.exit(1);
  }
};

module.exports = connectDB;