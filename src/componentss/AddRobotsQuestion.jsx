import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emojis = ["🤖", "🐱", "🐶", "🦄", "🐸", "🐵", "🐤", "🐙", "🐢", "🐧"];

function generateQuestion() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return { num1, num2, emoji, answer: num1 + num2 };
}

function AddEmojiQuestion({ question, onSubmit, feedback, animate }) {
  const { num1, num2, emoji } = question;
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer === "") return;
    onSubmit(Number(answer));
    setAnswer("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 max-w-4xl mx-auto mt-6 rounded shadow"
    >
      <div className="flex items-center space-x-2 mb-6">
        <i className="fas fa-volume-up text-blue-600 text-3xl"></i>
        <span className="font-sans font-semibold text-lg">Add:</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
  {/* First group */}
  <div className="border border-gray-300 rounded p-2 flex flex-wrap justify-center items-center gap-1 text-3xl min-w-[4rem] min-h-[4rem] max-w-[8rem]">
    {[...Array(num1)].map((_, i) => (
      <motion.span
        key={i}
        layout
        animate={animate ? { y: -40, opacity: 0 } : {}}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      >
        {emoji}
      </motion.span>
    ))}
  </div>
  <span className="text-center text-gray-900 font-sans text-base font-normal">
    {num1}
  </span>

  <span className="text-3xl font-sans font-normal select-none">+</span>

  {/* Second group */}
  <div className="border border-gray-300 rounded p-2 flex flex-wrap justify-center items-center gap-1 text-3xl min-w-[4rem] min-h-[4rem] max-w-[8rem]">
    {[...Array(num2)].map((_, i) => (
      <motion.span
        key={i}
        layout
        animate={animate ? { y: -40, opacity: 0 } : {}}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      >
        {emoji}
      </motion.span>
    ))}
  </div>
  <span className="text-center text-gray-900 font-sans text-base font-normal">
    {num2}
  </span>

  <span className="text-3xl font-sans font-normal select-none">=</span>

  <input
    type="number"
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
    className="border border-blue-500 w-20 h-10 text-center text-lg font-sans text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</div>


      <button
        type="submit"
        className="mt-6 bg-green-600 text-white text-lg font-sans px-6 py-2 rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto"
      >
        Submit
      </button>

      {feedback && (
        <div
          className={`mt-4 text-center text-lg font-semibold ${
            feedback.correct ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback.correct
            ? "Correct! 🎉"
            : `Wrong! Correct answer is ${feedback.correctAnswer}`}
        </div>
      )}
    </form>
  );
}

export default function AdditionQuiz() {
  const totalQuestions = 10;
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleAnswerSubmit = (userAnswer) => {
    const isCorrect = userAnswer === currentQuestion.answer;
    if (isCorrect) setScore(score + 1);

    setFeedback({ correct: isCorrect, correctAnswer: currentQuestion.answer });

    // trigger emoji animation
    setAnimate(true);

    setTimeout(() => {
      setAnimate(false);
      if (questionNumber >= totalQuestions) {
        setQuizCompleted(true);
      } else {
        setCurrentQuestion(generateQuestion());
        setQuestionNumber(questionNumber + 1);
        setFeedback(null);
      }
    }, 1200);
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed! 🎉</h2>
          <p className="text-lg mb-4">
            Your Score: {score} / {totalQuestions}
          </p>
          <button
            onClick={() => {
              setScore(0);
              setQuestionNumber(1);
              setCurrentQuestion(generateQuestion());
              setQuizCompleted(false);
              setFeedback(null);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <AddEmojiQuestion
        question={currentQuestion}
        onSubmit={handleAnswerSubmit}
        feedback={feedback}
        animate={animate}
      />
      <div className="mt-4 text-center text-gray-700">
        Question {questionNumber} of {totalQuestions} | Score: {score}
      </div>
    </div>
  );
}
