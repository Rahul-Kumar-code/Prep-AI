const Session = require("../models/session");
const Question = require("../models/question");
const User = require("../models/user");


//create a new session
exports.createSession = async (req,res) =>{
  try{
       const {role ,experience ,topicsToFocus,description,questions} = req.body;

      const userId = req.user._id;

        const session = new Session({user: userId,role ,experience ,topicsToFocus,description,questions});

        const questionDocs = await Promise.all(
          questions.map(async(q)=>{
             const question = await Question.create({session: session._id,
             question : q.question,
             answer : q.answer,});
            return question._id;
          })
        )

        session.questions = questionDocs;
        await session.save();

        return res.status(201).json({session,success: true});
  }catch(error){
      return res.status(500).json({message: "server error",success: false});
  }

}

//Get my-session
exports.getMySession = async (req,res) =>{
      try{
       const sessions = await Session.find({user: req.user._id}).sort({createdAt: -1}).populate("questions");
        return res.status(200).json(sessions);
  }catch(error){
    console.error("Error in getMySession:", error); 
      return res.status(500).json({message: "server error",success: false});
  }

}

//Get sessionById
exports.getSessionById = async (req,res) =>{
   try{
        const session = await Session.findById(req.params.id).populate({
          path: "questions",
          options: {sort: {isPinned: -1, createdAt: 1}}
        }).exec();
        if(!session){
          return res.status(404).json({message: "Session not found"});
        }
        res.status(200).json({success: true,session});
         }catch(error){
    return res.status(500).json({message: "server error",success: false});
   }
}

//DeleteSession
exports.deleteSession = async (req,res) =>{
   try{
        const session = await Session.findById(req.params.id);

        if(!session){
          return res.status(404).json({message: "Session not found"});
        }

        //check if logged user owned this session
        if(session.user.toString() != req.user.id){
          return res.status(401).json({message: "user is unauthorized to delete session"});
        }
            //delete all question linked to the session 
        await Question.deleteMany({session: session._id});
           //delete the session
        await Session.deleteOne();

        res.status(200).json({message: "session deleted successfully"});
         }catch(error){
    return res.status(500).json({message: "server error",success: false});
   }
};