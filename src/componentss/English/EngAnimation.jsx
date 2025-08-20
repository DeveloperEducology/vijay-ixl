import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quizData = [
  {
    id: 1,
    sentence: "The cat is ___ and the dog is ___.",
    blanks: 2,
    options: ["black", "white", "big", "small"],
    correct: ["white", "black"],
    image:
      "https://thumbs.dreamstime.com/b/black-dog-white-cat-ai-generated-image-labrador-persian-posing-together-against-neutral-background-382749044.jpg", // 🐱🐶
  },
  {
    id: 2,
    sentence: "I like to eat ___ and drink ___.",
    blanks: 2,
    options: ["Burger", "juice", "rice"],
    correct: ["Burger", "juice"],
    image:
      "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1755665102791.svg", // 🍕💧
  },
  {
    id: 3,
    sentence: "She is ___ because she won the ___.",
    blanks: 2,
    options: ["happy", "sad", "race", "game"],
    correct: ["happy", "race"],
    image:
      "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1755665493368.png", // 🏆😊
  },
  {
    id: 4,
    sentence: "The sun is ___ and the sky is ___.",
    blanks: 2,
    options: ["blue", "yellow", "dark", "bright"],
    correct: ["yellow", "blue"],
    image:
      "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1755666240947.jpg", // ☀️🌌
  },
  {
    id: 11,
    sentence: "We like to ___ to ___ in a ___.",
    blanks: 3,
    options: ["school", "go", "bus", "truck"],
    correct: ["go", "school", "bus"],
    image:
      "https://cakeimages.s3.ap-northeast-2.amazonaws.com/1755667422241.svg", // 🌙⭐
  },
  {
    id: 5,
    sentence: "He plays ___ and she plays ___.",
    blanks: 2,
    options: ["football", "chess", "basketball", "piano"],
    correct: ["football", "piano"],
    image: "https://example.com/football-piano.jpg", // ⚽🎹
  },
  {
    id: 6,
    sentence: "We go to ___ to read books and to ___ to buy food.",
    blanks: 2,
    options: ["school", "market", "library", "shop"],
    correct: ["library", "market"],
    image: "https://example.com/library-market.jpg", // 📚🛒
  },
  {
    id: 7,
    sentence: "The bird can ___ and the fish can ___.",
    blanks: 2,
    options: ["fly", "swim", "run", "jump"],
    correct: ["fly", "swim"],
    image: "https://example.com/bird-fish.jpg", // 🐦🐟
  },
  {
    id: 8,
    sentence: "He wears ___ on his feet and a ___ on his head.",
    blanks: 2,
    options: ["shoes", "hat", "shirt", "cap"],
    correct: ["shoes", "hat"],
    image: "https://example.com/shoes-hat.jpg", // 👟🎩
  },
  {
    id: 9,
    sentence: "The flowers are ___ and the leaves are ___.",
    blanks: 2,
    options: ["green", "red", "yellow", "blue"],
    correct: ["red", "green"],
    image: "https://example.com/flowers-leaves.jpg", // 🌸🍃
  },
  {
    id: 10,
    sentence: "At night we see the ___ and the ___.",
    blanks: 2,
    options: ["sun", "stars", "moon", "clouds"],
    correct: ["moon", "stars"],
    image: "https://example.com/moon-stars.jpg", // 🌙⭐
  },
];

export default function EnglishQuizGame() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(quizData[0].blanks).fill(null));
  const [feedback, setFeedback] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const question = quizData[currentQ];

  const handleOptionClick = (word) => {
    const index = answers.findIndex((a) => a === null);
    if (index !== -1) {
      const newAnswers = [...answers];
      newAnswers[index] = word;
      setAnswers(newAnswers);
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect =
      JSON.stringify(answers) === JSON.stringify(question.correct);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setTimeout(() => {
        if (currentQ < quizData.length - 1) {
          setDirection(1);
          setCurrentQ(currentQ + 1);
          setAnswers(Array(quizData[currentQ + 1].blanks).fill(null));
          setFeedback(null);
        } else {
          alert("🎉 Quiz Finished!");
        }
      }, 1000);
    }
  };

  const handleBlankClick = (index) => {
    const newAnswers = [...answers];
    newAnswers[index] = null;
    setAnswers(newAnswers);
  };

  const parts = question.sentence.split("___");

  // Motion variants for slide animation
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">English Quiz</h2>

      <AnimatePresence custom={direction} exitBeforeEnter>
        <motion.div
          key={question.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Image */}
          {question.image && (
            <div className="flex justify-center mb-6">
              <img
                src={question.image}
                alt="Quiz hint"
                className="max-h-48 object-contain rounded-lg"
              />
            </div>
          )}

          {/* Sentence with blanks */}
          <div className="text-xl mb-6 flex flex-wrap justify-center gap-2">
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                <span>{part}</span>
                {i < question.blanks && (
                  <motion.div
                    className={`inline-block min-w-[80px] px-2 py-1 border-b-2 cursor-pointer rounded-md text-center ${
                      feedback === "wrong" && answers[i] !== null
                        ? "bg-red-200 border-red-500"
                        : feedback === "correct"
                        ? "bg-green-200 border-green-500"
                        : "border-gray-400"
                    }`}
                    onClick={() => handleBlankClick(i)}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {answers[i] ? (
                      <motion.span layoutId={answers[i]}>
                        {answers[i]}
                      </motion.span>
                    ) : (
                      <span className="text-gray-400">_____</span>
                    )}
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Options */}
          <div className="flex flex-wrap justify-center gap-3">
            {question.options
              .filter((o) => !answers.includes(o))
              .map((word) => (
                <motion.button
                  key={word}
                  layoutId={word}
                  className="px-4 py-2 bg-blue-100 rounded-lg shadow cursor-pointer hover:bg-blue-200"
                  onClick={() => handleOptionClick(word)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {word}
                </motion.button>
              ))}
          </div>

          {/* Check Answer Button */}
          <div className="mt-6">
            <button
              onClick={handleCheckAnswer}
              disabled={answers.includes(null)}
              className={`px-6 py-2 rounded-lg text-white font-semibold ${
                answers.includes(null)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Check Answer
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <motion.div
              className={`mt-4 text-lg font-bold ${
                feedback === "correct" ? "text-green-600" : "text-red-600"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {feedback === "correct" ? "✅ Correct!" : "❌ Try Again!"}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
