import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Quiz Component
export default function FillInTheBlanksQuiz({ questions }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  const question = questions[currentQ];

  const handleOptionClick = (blankIndex, word) => {
    setAnswers((prev) => ({
      ...prev,
      [blankIndex]: word,
    }));
  };

  const checkAnswer = () => {
    setShowFeedback(true);
    const isCorrect = question.blanks.every(
      (blank, i) => answers[i] === blank.answer
    );

    if (isCorrect) {
      setTimeout(() => {
        setAnswers({});
        setShowFeedback(false);
        if (currentQ < questions.length - 1) {
          setCurrentQ((prev) => prev + 1);
        } else {
          alert("🎉 Quiz Completed!");
        }
      }, 1200);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-medium text-gray-800 text-center"
        >
          {question.sentence.split("___").map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i < question.blanks.length && (
                <motion.span
                  className={`inline-block min-w-[100px] px-3 py-1 mx-1 rounded-lg border text-center ${
                    showFeedback
                      ? answers[i] === question.blanks[i].answer
                        ? "bg-green-200 border-green-500"
                        : "bg-red-200 border-red-500"
                      : "bg-gray-100 border-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {answers[i] || "_____"}
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-3">
        {question.options.map((word, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              const emptyIndex =
                Object.keys(answers).length < question.blanks.length
                  ? Object.keys(answers).length
                  : null;
              if (emptyIndex !== null) handleOptionClick(emptyIndex, word);
            }}
            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Check Answer */}
      <div className="flex justify-center">
        <motion.button
          onClick={checkAnswer}
          className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          Check Answer
        </motion.button>
      </div>
    </div>
  );
}
