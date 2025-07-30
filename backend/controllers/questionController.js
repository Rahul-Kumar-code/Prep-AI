const Session = require("../models/session");
const Question = require("../models/question");

//Add quesions
exports.addQuestionsToSession = async (req,res) =>{
  try{
       const {sessionId,questions} = req.body;
            
       if(!sessionId || !questions || !Array.isArray(questions)){
        return res.status(400).json({message: "Invalid Input data"});
       }

       const session = await Session.findById(sessionId)

       if(!session){
        return res.status(404).json({message: "Session not found"})
       }

      //  create new question
      const createQuestions = await Question.insertMany(
        questions.map((q)=>({
          session: sessionId,
          question: q.question,
          answer: q.answer
        }))
      );

      //update session to include new question
      session.questions.push(...createQuestions.map((q)=>q._id));
           await session.save();
        return res.status(201).json(createQuestions);

  }catch(error){
      return res.status(500).json({message: "server error"});
  }

}

//toggle Pin Question
exports.togglePinQuestion = async (req,res) =>{
      try{
      const question = await Question.findById(req.params.id);

       if(!question){
        return res.status(404).json({success: false, message: "question not found"})
       }
        
       question.isPinned = !question.isPinned;
       await question.save();
       
        return res.status(200).json({success: true, question});
  }catch(error){
      return res.status(500).json({message: "server error"});
  }

}

//Update question note
exports.updateQuestionNote = async (req,res) =>{
   try{
        const {note} = req.body;
         const question = await Question.findById(req.params.id);

       if(!question){
        return res.status(404).json({success: false, message: "question not found"})
       }
        
       question.note = note || "";
       await question.save();
       
        return res.status(200).json({success: true, question});
         }catch(error){
    return res.status(500).json({message: "server error"});
   }
};