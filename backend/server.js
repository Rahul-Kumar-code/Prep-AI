require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db')
const {protect} = require('./middlewares/authMiddleware')

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const questionRoutes = require('./routes/questionRoutes');
const {generateInterviewQuestions, generateConceptExplanation}  = require('./controllers/aiController');

const app = express();

app.use(cors({
  origin: ["https://prep-ai-one-lovat.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


connectDB();

//Middleware
app.use(express.json());

app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}));
app.get('/', (req, res) => {
  res.send('✅ Prep-AI Backend is Live.');
});

//routes
app.use('/api/auth',authRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/questions',questionRoutes);

app.use("/api/ai/generate-questions",protect,generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation) ;

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{console.log(`server is running on http://localhost:${PORT}`)});
