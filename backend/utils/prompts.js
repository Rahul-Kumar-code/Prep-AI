const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
You are an AI trained to generate technical interview questions and answers.

Task:
  Role: ${role}
  Candidate Experience: ${experience} years
  Focus Topics: ${topicsToFocus}
  Write ${numberOfQuestions} interview questions.
  For each question, generate a detailed but beginner-friendly answer.
  If the answer needs a code example, add a small code block inside.
  Keep formatting very clean.
  Return a pure JSON array like:
[
  {
    "question": "Question here?",
    "answer": "Answer here."
  },
  ...
]
Important: Do NOT add any extra text. Only return valid JSON.
`);

const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:
  Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
  Question: "${question}"

Format your response EXACTLY as follows:
  - The FIRST line must be a short title that summarizes the concept, written as a Markdown H1 heading (e.g., # Your Title Here)
  - After the title, write a blank line, then the full explanation in clean Markdown.
  - If the explanation includes code examples, use fenced Markdown code blocks with the correct language tag.
  - Keep the formatting clean and readable.

IMPORTANT: Do NOT wrap the response in JSON. Do NOT add any preamble or extra text. Start directly with the # title.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
