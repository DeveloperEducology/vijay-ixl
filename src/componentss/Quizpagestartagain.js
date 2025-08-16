import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MultiCorrectMcq from "./MultiCorrectMcq";
import SingleCorrectMcq from "./SingleCorrectMcq";
import { useParams } from "react-router-dom";
import { questionsGenerator } from "../utils/KidQnGntr";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import { InlineMath } from "react-katex";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const QuizPage = () => {
  const { topicId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null); // for SMCQ
  const [selectedOptions, setSelectedOptions] = useState({}); // for MCQ
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [smartScore, setSmartScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // mcq-multiple
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showKeepUp, setShowKeepUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState("");

  const decodedKey = decodeURIComponent(topicId);
  console.log(decodedKey);
  console.log(questionsGenerator);

  const initializeUserAnswer = (currentQuestion) => {
    if (currentQuestion?.type === "sequence") {
      const nullCount =
        currentQuestion?.type === "sequence"
          ? currentQuestion?.sequences
            ? currentQuestion?.sequences.filter((item) => item === null).length
            : currentQuestion.correctAnswers.length
          : currentQuestion.question.reduce(
              (count, str) => count + (str.match(/null/g) || []).length,
              0
            );
      return Array(nullCount).fill("");
    }
    return "";
  };

  const handleAnswerChange = (e, index) => {
    const value = e.target.value; // always string
    const prevSequenceAnswers =
      userAnswers[currentQuestion._id] || initializeUserAnswer(currentQuestion);
    const newSequenceAnswers = [...prevSequenceAnswers];
    newSequenceAnswers[index] = value;
    setUserAnswers({
      ...userAnswers,
      [currentQuestion._id]: newSequenceAnswers,
    });
  };

  useEffect(() => {
    if (questionsGenerator[decodedKey]) {
      const generated = questionsGenerator[decodedKey]();
      setCurrentQuestion(generated);
    }
  }, [decodedKey]);

  console.log("currentQn:", currentQuestion);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  // Questions with dynamic availableOptions
  const questions = [
    {
      number: 1,
      type: "mmcq",
      question: "Which of the following countries are part of the G7 group?",
      correctAnswers: ["Canada", "Japan", "Germany"],
      availableOptions: ["Canada", "Japan", "Germany", "Brazil", "India"],
      explanation:
        "The G7 includes Canada, Japan, Germany, the United States, the United Kingdom, France, and Italy. Brazil and India are not members.",
    },
    {
      number: 2,
      type: "smcq",
      question: "Which planet is known as the Red Planet?",
      correctAnswers: ["Mars"],
      availableOptions: ["Mars", "Jupiter", "Venus"],
      explanation:
        "Mars is called the Red Planet due to the presence of iron oxide on its surface.",
    },
    {
      number: 3,
      type: "smcq",
      question: "Who wrote the play 'Romeo and Juliet'?",
      correctAnswers: ["William Shakespeare"],
      availableOptions: [
        "William Shakespeare",
        "Charles Dickens",
        "Jane Austen",
      ],
      explanation:
        "'Romeo and Juliet' is a tragedy written by William Shakespeare in the late 16th century.",
    },
    {
      number: 4,
      type: "mmcq",
      question: "Which of the following are programming languages?",
      correctAnswers: ["Python", "JavaScript", "C++"],
      availableOptions: ["Python", "HTML", "JavaScript", "CSS", "C++"],
      explanation:
        "Python, JavaScript, and C++ are programming languages. HTML and CSS are markup and styling languages.",
    },
    {
      number: 5,
      type: "smcq",
      question:
        "The Great Wall of China was primarily built to protect against invasions from which group?",
      correctAnswers: ["Mongols"],
      availableOptions: ["Mongols", "Japanese", "Russians"],
      explanation:
        "The Great Wall was constructed to defend against invasions from northern nomadic tribes, particularly the Mongols.",
    },
    {
      number: 6,
      type: "mmcq",
      question: "Which of these are primary colors of light?",
      correctAnswers: ["Red", "Green", "Blue"],
      availableOptions: ["Red", "Green", "Blue", "Yellow", "Purple"],
      explanation:
        "The primary colors of light are red, green, and blue. Yellow and purple are secondary colors.",
    },
    {
      number: 7,
      type: "smcq",
      question: "In which year did the Titanic sink?",
      correctAnswers: ["1912"],
      availableOptions: ["1905", "1912", "1920"],
      explanation:
        "The RMS Titanic sank on April 15, 1912, after hitting an iceberg.",
    },
    {
      number: 8,
      type: "mmcq",
      question: "Which of these are considered wonders of the ancient world?",
      correctAnswers: ["Great Pyramid of Giza", "Hanging Gardens of Babylon"],
      availableOptions: [
        "Great Pyramid of Giza",
        "Eiffel Tower",
        "Hanging Gardens of Babylon",
        "Colosseum",
      ],
      explanation:
        "The Great Pyramid of Giza and Hanging Gardens of Babylon are part of the original Seven Wonders of the Ancient World.",
    },
    {
      number: 9,
      type: "smcq",
      question: "Which is the largest ocean on Earth?",
      correctAnswers: ["Pacific Ocean"],
      availableOptions: ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean"],
      explanation:
        "The Pacific Ocean is the largest and deepest ocean, covering more than 63 million square miles.",
    },
    {
      number: 10,
      type: "mmcq",
      question: "Which of the following animals are mammals?",
      correctAnswers: ["Elephant", "Dolphin", "Bat"],
      availableOptions: ["Elephant", "Crocodile", "Dolphin", "Shark", "Bat"],
      explanation:
        "Elephants, dolphins, and bats are mammals. Crocodiles and sharks are reptiles and fish respectively.",
    },
  ];

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (timerRunning && !showResult && !showKeepUp) {
      interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, showResult, showKeepUp]);

  // const currentQuestion = questions[currentQuestionIndex];

  // const availableOptions = currentQuestion.availableOptions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const formattedTime = formatTime(timeElapsed);

  const handleOptionsChange = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Handle multi-select toggle
  const handleMultipleSelect = (option) => {
    setSelectedAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((ans) => ans !== option)
        : [...prev, option]
    );
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setShowKeepUp(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionsAnswered((prev) => prev + 1);
      resetOptions();
    }
  };

  const handleSubmit = () => {
    const correct = currentQuestion.correctAnswers;
    let isAnswerCorrect = false;

    if (currentQuestion.type === "smcq") {
      // Single correct — just check if the chosen one matches
      isAnswerCorrect = correct.includes(selectedOption);
    } else {
      // Multi correct — must match exactly
      const selectedTrueOptions = Object.keys(selectedOptions).filter(
        (key) => selectedOptions[key] && availableOptions.includes(key)
      );
      isAnswerCorrect =
        selectedTrueOptions.length === correct.length &&
        selectedTrueOptions.every((opt) => correct.includes(opt)) &&
        correct.every((opt) => selectedTrueOptions.includes(opt));
    }

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setSmartScore((prev) => Math.min(prev + 10, 100));
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    }
  };

  console.log("selectedOptions:", selectedOptions);
  console.log("selectedOption:", selectedOption);
  const resetOptions = () => {
    const initial = {};
    setSelectedOptions(initial);
    setSelectedOption(initial);
  };

  const handleKeepUpContinue = () => {
    setShowKeepUp(false);
    setShowResult(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionsAnswered((prev) => prev + 1);
      resetOptions();
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "input":
        return (
          <input
            type={currentQuestion?.textType === "text" ? "text" : "number"}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            disabled={showResult}
            className="w-full max-w-xs text-center text-xl border-2 border-purple-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
            autoComplete="off"
          />
        );

      case "sequence":
        const parsedSequence =
          typeof currentQuestion.sequences[0] === "string"
            ? currentQuestion.sequences[0]
                .split(" ")
                .map((v) => (v.toLowerCase() === "null" ? null : v))
            : currentQuestion.sequences;

        return (
          <div className="flex items-center flex-wrap gap-2">
            {parsedSequence.map((item, index) => {
              if (item === null) {
                const nullIndex = parsedSequence
                  .slice(0, index)
                  .filter((i) => i === null).length;
                return (
                  <input
                    key={index}
                    type="number"
                    value={
                      (userAnswers[currentQuestion._id] || [])[nullIndex] ?? ""
                    }
                    onChange={(e) => handleAnswerChange(e, nullIndex)}
                    className="w-16 mx-1 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder=""
                  />
                );
              }
              return (
                <span key={index} className="mr-1">
                  {item}
                  {index < parsedSequence.length - 1 ? "," : ""}
                </span>
              );
            })}
          </div>
        );

      case "mcq":
        return (
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex flex-wrap gap-6 justify-center">
              {currentQuestion.options.map((option) => {
                const isSelected = userAnswer === option;
                const isCorrect =
                  showResult && option === currentQuestion.answer;
                const isWrong =
                  showResult && isSelected && option !== currentQuestion.answer;

                return (
                  <button
                    key={option}
                    onClick={() => setUserAnswer(option)}
                    disabled={showResult}
                    className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-2 transition-all min-w-[100px]
                ${isCorrect ? "bg-green-200 border-green-500" : ""}
                ${isWrong ? "bg-red-200 border-red-500" : ""}
                ${
                  isSelected && !showResult
                    ? "bg-purple-200 border-purple-400 scale-105"
                    : ""
                }
                ${
                  !isSelected && !showResult
                    ? "bg-white border-gray-300 hover:border-purple-300"
                    : ""
                }
                ${showResult ? "opacity-100" : ""}
              `}
                  >
                    {currentQuestion?.latex === true ? (
                      <InlineMath math={option} />
                    ) : (
                      option
                    )}
                  </button>
                );
              })}
            </div>

            {showResult && userAnswer && currentQuestion.feedbackPerOption && (
              <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                <strong>Feedback:</strong>{" "}
                {currentQuestion.feedbackPerOption[userAnswer]}
              </div>
            )}

            {showResult && userAnswer && (
              <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                <strong>Explanation:</strong>
                {currentQuestion?.explanation?.map((exp, i) => (
                  <ReactMarkdown
                    key={i}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {exp}
                  </ReactMarkdown>
                ))}
              </div>
            )}
          </div>
        );

      case "mcq-multiple":
        return (
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex flex-wrap gap-6 justify-center">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedAnswers.includes(option);
                const isCorrect =
                  showResult && currentQuestion.answer.includes(option);
                const isWrong =
                  showResult &&
                  isSelected &&
                  !currentQuestion.answer.includes(option);

                return (
                  <button
                    key={option}
                    onClick={() => handleMultipleSelect(option)}
                    disabled={showResult}
                    className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-2 transition-all min-w-[100px]
              ${isCorrect ? "bg-green-200 border-green-500" : ""}
              ${isWrong ? "bg-red-200 border-red-500" : ""}
              ${
                isSelected && !showResult
                  ? "bg-purple-200 border-purple-400 scale-105"
                  : ""
              }
              ${
                !isSelected && !showResult
                  ? "bg-white border-gray-300 hover:border-purple-300"
                  : ""
              }
              ${showResult ? "opacity-100" : ""}
            `}
                  >
                    {currentQuestion?.latex ? (
                      <InlineMath math={option} />
                    ) : (
                      option
                    )}
                  </button>
                );
              })}
            </div>

            {showResult &&
              selectedAnswers.length > 0 &&
              currentQuestion.feedbackPerOption && (
                <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                  <strong>Feedback:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {selectedAnswers.map((answer, index) => (
                      <li key={index}>
                        {answer}: {currentQuestion.feedbackPerOption[answer]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {showResult && currentQuestion.explanation && (
              <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                <strong>Explanation:</strong>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {currentQuestion.explanation.map((explain, index) => (
                    <li key={index}>
                      <span>
                        <InlineMath math={explain} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "true_false":
        return (
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex gap-6 justify-center">
              {currentQuestion.options.map((option) => {
                const isSelected = userAnswer === option;
                const isCorrect =
                  showResult && option === currentQuestion.answer;
                const isWrong =
                  showResult && isSelected && option !== currentQuestion.answer;

                return (
                  <button
                    key={option}
                    onClick={() => setUserAnswer(option)}
                    disabled={showResult}
                    className={`text-center p-3 rounded-xl cursor-pointer text-lg font-medium border-2 transition-all min-w-[100px]
                ${isCorrect ? "bg-green-200 border-green-500" : ""}
                ${isWrong ? "bg-red-200 border-red-500" : ""}
                ${
                  isSelected && !showResult
                    ? "bg-purple-200 border-purple-400 scale-105"
                    : ""
                }
                ${
                  !isSelected && !showResult
                    ? "bg-white border-gray-300 hover:border-purple-300"
                    : ""
                }
                ${showResult ? "opacity-100" : ""}
              `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );

      // case "number-line":
      //   return (
      //     <NumberLineQuestion
      //       question={currentQuestion}
      //       onAnswer={(selected) => setUserAnswer(selected)}
      //       showResult={showResult}
      //       key={totalQuestions}
      //     />
      //   );
      default:
        return null;
    }
  };

  const renderVisuals = () => {
    if (!currentQuestion?.visuals || currentQuestion.visuals.length === 0) {
      return null;
    }
    if (decodedKey === "🔢 Even Number Hunt") {
      return (
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-blue-50 rounded-lg">
          {currentQuestion.visuals.map((visual, i) => (
            <div
              key={i}
              className={`text-4xl p-3  rounded-lg ${
                currentQuestion.answer.includes(visual.content) && showResult
                  ? "bg-green-100 border-2 border-green-400"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              {visual.content}
            </div>
          ))}
        </div>
      );
    }
    // Special styling for Skip-Counting Adventure
    if (decodedKey === "A.1 Skip-Counting-by-pictures") {
      return (
        <div className="flex flex-wrap justify-left gap-4 text-3xl p-4 bg-purple-50 rounded-lg">
          {currentQuestion.visuals.map((group, i) => (
            <div
              key={i}
              className="p-2 border-2 border-dashed border-purple-200 rounded-md"
            >
              {group}
            </div>
          ))}
        </div>
      );
    }

    // Default visual styling for others like "Even or Odd"
    return (
      <div className="overflow-x-auto whitespace-nowrap bg-yellow-50 rounded-lg p-4">
        <div className="inline-flex gap-3 text-4xl">
          {currentQuestion.visuals.map((emoji, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </div>
      </div>
    );
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
    setSmartScore(0);
    setTimeElapsed(0);
    setTimerRunning(true);
    setShowResult(false);
    setShowKeepUp(false);
    resetOptions();
  };

  return (
    <div className="bg-gradient-to-b from-sky-300 to-emerald-200 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-sky-200 text-xs text-gray-700 flex justify-between px-4 py-1 items-center select-none">
        <div className="flex items-center space-x-1">
          <span>Class IX</span>
          <span>•</span>
          <span>A.1 Classify numbers</span>
        </div>
        <button className="bg-white text-gray-700 text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
          Share skill
        </button>
      </div>

      {/* Main container */}
      <div className="flex-grow flex justify-center items-start pt-4 px-4 pb-4">
        <div className="bg-white rounded-xl w-full max-w-5xl flex flex-col md:flex-row p-4 md:p-6 relative">
          {/* Mobile stats header */}
          {isMobile && (
            <div className="w-full mb-4">
              <div className="flex text-center text-gray-700 text-sm font-sans">
                <div className="flex-1">
                  <div>Questions</div>
                  <div className="text-lime-600 font-semibold text-lg leading-none">
                    {questionsAnswered}
                  </div>
                </div>
                <div className="flex-1">
                  <div>Time</div>
                  <div className="text-sky-400 font-semibold text-lg leading-none">
                    PAUSED
                  </div>
                </div>
                <div className="flex-1">
                  <div>SmartScore</div>
                  <div className="text-orange-600 font-semibold text-lg leading-none">
                    {smartScore}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Left content */}
          <div className="flex-1 pr-0 md:pr-12">
            {/* Keep Up Feedback */}
            {showKeepUp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl"
              >
                <div className="bg-green-100 border border-green-300 p-6 rounded-lg text-center">
                  <div className="flex justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-green-800 text-lg font-semibold mb-2">
                    Keep it up!
                  </h3>
                  <p className="text-green-700 mb-6">
                    You're doing great. Continue to the next question.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded"
                    onClick={handleKeepUpContinue}
                  >
                    Next Question
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Question & Dynamic Options */}
            {!showResult && !showKeepUp && (
              <>
                {renderVisuals()}

                <div className="flex justify-left">{renderQuestionInput()}</div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-6 bg-lime-700 text-white text-sm font-semibold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  onClick={handleSubmit}
                  // disabled={Object.keys(selectedOptions).every(
                  //   (key) =>
                  //     !selectedOptions[key] || !selectedOption[key] || !availableOptions.includes(key)
                  // )}
                >
                  Submit
                </motion.button>
              </>
            )}

            {/* Result Feedback */}
            {showResult && !showKeepUp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl"
              >
                <div
                  className={`border p-4 rounded-lg mb-6 ${
                    isCorrect
                      ? "bg-green-100 border-green-300"
                      : "bg-red-100 border-red-300"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 mr-2 ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          isCorrect
                            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                    <span
                      className={`font-semibold ${
                        isCorrect ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect
                      ? "Great job! You selected the correct classification."
                      : "The correct answer has been highlighted."}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Explanation:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded"
                  onClick={
                    isCorrect
                      ? () => {
                          setShowResult(false);
                          setShowKeepUp(true);
                        }
                      : handleNextQuestion
                  }
                >
                  {isCorrect
                    ? "Keep it up!"
                    : isLastQuestion
                    ? "Finish"
                    : "Next question"}
                </motion.button>
              </motion.div>
            )}

            {/* Quiz Completed */}
            {isLastQuestion && showKeepUp && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="bg-blue-50 p-6 rounded-lg mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Quiz Completed!
                  </h3>
                  <p className="text-gray-700 mb-2">
                    You've completed all {questions.length} questions.
                  </p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div>
                      <div className="font-bold text-blue-600">
                        {questionsAnswered}
                      </div>
                      <div className="text-gray-600">Questions</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-600">
                        {smartScore}
                      </div>
                      <div className="text-gray-600">Smart Score</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-600">
                        {formattedTime.mins}:{formattedTime.secs}
                      </div>
                      <div className="text-gray-600">Time</div>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-indigo-600 text-white text-sm font-semibold px-6 py-2 rounded"
                  onClick={resetQuiz}
                >
                  Restart Quiz
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Right panel (desktop only) */}
          {!isMobile && (
            <div className="w-22 flex flex-col text-center text-gray-900 text-xs font-semibold select-none mt-0">
              <div className="bg-sky-500 text-white rounded-t-md py-1">
                Questions
                <br /> answered
              </div>
              <div className="bg-gray-100 py-6 text-3xl font-bold">
                {questionsAnswered}
              </div>
              <div className="bg-sky-500 text-white py-1">
                Time
                <br /> elapsed
              </div>
              <div className="bg-gray-100 py-2 text-xs text-gray-500 font-normal">
                <div className="flex justify-center space-x-1">
                  <div className="flex flex-col items-center">
                    <span>00</span>
                    <span className="text-[8px] font-light text-gray-400">
                      HR
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>00</span>
                    <span className="text-[8px] font-light text-gray-400">
                      MIN
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>00</span>
                    <span className="text-[8px] font-light text-gray-400">
                      SEC
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-sky-500 text-white py-1">
                Smart <span className="text-orange-300">Score</span>
                <br />
                out of 100
                <span className="inline-block ml-1 text-white text-xs font-normal cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </div>
              <div className="bg-gray-100 py-6 text-3xl font-bold">
                {smartScore}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
