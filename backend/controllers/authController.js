const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//generate jwt token
const generateToken = (userId) =>{
  return jwt.sign({id: userId},process.env.JWT_SECRET, {expiresIn: "1d"});
};

//Register User
const registerUser = async (req,res) =>{
  try{
       const {name, email, password, profileImageUrl} = req.body;

       //check if user already registered
       const userExists = await User.findOne({email}) ;
       if(userExists){
        return res.status(400).json({message: "user already exists."});
       }
        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = new User({name,email, password: hashedPassword, profileImageUrl});
        
        await user.save();

         //Return user data with JWT
        res.status(201).json({
        _id:user._id,
        name:user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
        })
  }catch(error){
      return res.status(500).json({message: "server error",error: error.message});
  }

}

//login User
const loginUser = async (req,res) =>{
      try{
       const {email, password} = req.body;

       const user = await User.findOne({email}) ;
       if(!user){
         return res.status(401).json({message: "Invalid email or password"});
       }
        //Match Password
        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch){
         return res.status(401).json({message: "Invalid email or password"});
       }
     //Return user data with JWT
        res.status(201).json({
        _id:user._id,
        name:user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
        })
  }catch(error){
      return res.status(500).json({message: "server error",error: error.message});
  }

}
const userProfile = async (req,res) =>{
   try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
          return res.status(404).json({message: "user not found"});
        }
        res.json(user);
         }catch(error){
    return res.status(500).json({message: "server error",error: error.message});
   }
}

module.exports = {registerUser,loginUser,userProfile};