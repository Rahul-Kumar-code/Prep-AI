const {GoogleGenAI} = require('@google/genai');
const {conceptExplainPrompt, questionAnswerPrompt} = require('../utils/prompts');

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const generateInterviewQuestions = async (req,res) => {
  try{
     const {role, experience, topicsToFocus, numberOfQuestions} = req.body;

     if(!role || !experience || !topicsToFocus || !numberOfQuestions){
      return res.status(400).json({message: "Missing required fields"});
     }

     const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash-lite",
       contents: prompt,
     })

     let rawText = response.text;

     const cleanedText = rawText.replace(/^```json\s*/,"").replace(/```$/,"").trim();
     
     const data = JSON.parse(cleanedText);

     return res.status(200).json(data);

  }catch(error){
   return res.status(500).json({message: "Failed to generate questions", error: error.message})
  }
}
const generateConceptExplanation = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message: "AI service is not configured. Set GEMINI_API_KEY on the server.",
    });
  }

  // Set SSE headers for streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering if applicable
  res.flushHeaders();

  try {
    const prompt = conceptExplainPrompt(question);

    const streamResult = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    for await (const chunk of streamResult) {
      console.log("Chunk:", chunk);
      console.log("Chunk text:", chunk.text);

      const chunkText = chunk.text;
      if (chunkText) {
        const ssePayload = `data: ${JSON.stringify({ chunk: chunkText })}\n\n`;
        res.write(ssePayload);
        if (typeof res.flush === 'function') res.flush();
      }
    }

    // Signal the client that the stream is complete
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    if (typeof res.flush === 'function') res.flush();
    res.end();
  } catch (error) {
    console.error("Failed to generate concept explanation:", error);
    // Send error as an SSE event so the client can handle it gracefully
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

module.exports = {generateInterviewQuestions,  generateConceptExplanation}