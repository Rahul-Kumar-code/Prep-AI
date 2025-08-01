const express = require("express");
const {togglePinQuestion, updateQuestionNote, addQuestionsToSession } = require('../controllers/questionController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add',protect, addQuestionsToSession); 
router.get('/:id/pin',protect, togglePinQuestion); 
router.get('/:id/note',protect, updateQuestionNote); 


module.exports = router;