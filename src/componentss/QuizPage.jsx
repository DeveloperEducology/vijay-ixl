import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const QuizPage = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    natural: false,
    irrational: false,
    rational: false,
    integer: false,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(3); // Matches screenshot
  const [smartScore, setSmartScore] = useState(19); // Matches screenshot
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false); // Matches "PAUSED" in screenshot
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showKeepUp, setShowKeepUp] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const questions = [
    {
      number: 1,
      correctAnswers: ["natural", "rational", "integer"],
      explanation:
        "1 is a natural number (positive counting number), an integer (whole number), and rational (can be expressed as 1/1).",
    },
    {
      number: 1.5,
      correctAnswers: ["rational"],
      explanation:
        "1.5 is rational (can be expressed as 3/2) but not an integer, natural, or irrational.",
    },
    {
      number: "√2",
      correctAnswers: ["irrational"],
      explanation:
        "√2 is irrational (cannot be expressed as a fraction of integers) and approximately equals 1.414...",
    },
    {
      number: 0,
      correctAnswers: ["rational", "integer"],
      explanation:
        "0 is an integer and rational (0/1), but not a natural number (natural numbers start from 1).",
    },
    {
      number: -3,
      correctAnswers: ["rational", "integer"],
      explanation:
        "-3 is an integer and rational (-3/1), but not natural or irrational.",
    },
    {
      number: "π",
      correctAnswers: ["irrational"],
      explanation:
        "π (pi) is an irrational number that cannot be expressed as a fraction of integers.",
    },
    {
      number: 4 / 2,
      correctAnswers: ["natural", "rational", "integer"],
      explanation:
        "4/2 equals 2, which is a natural number, integer, and rational number.",
    },
    {
      number: "0.333...",
      correctAnswers: ["rational"],
      explanation:
        "0.333... is rational because it equals 1/3, a fraction of integers.",
    },
    {
      number: "√9",
      correctAnswers: ["natural", "rational", "integer"],
      explanation:
        "√9 equals 3, which is a natural number, integer, and rational number.",
    },
    {
      number: "-√4",
      correctAnswers: ["rational", "integer"],
      explanation:
        "-√4 equals -2, which is an integer and rational number, but not natural.",
    },
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerRunning && !showResult && !showKeepUp) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, showResult, showKeepUp]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedTrueOptions = Object.keys(selectedOptions).filter(
      (key) => selectedOptions[key]
    );
    const isAnswerCorrect =
      selectedTrueOptions.length === currentQuestion.correctAnswers.length &&
      selectedTrueOptions.every((option) =>
        currentQuestion.correctAnswers.includes(option)
      ) &&
      currentQuestion.correctAnswers.every((option) =>
        selectedTrueOptions.includes(option)
      );

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setSmartScore((prev) => Math.min(prev + 10, 100));
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setShowKeepUp(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions({
        natural: false,
        irrational: false,
        rational: false,
        integer: false,
      });
      setQuestionsAnswered((prev) => prev + 1);
    }
  };

  const handleKeepUpContinue = () => {
    setShowKeepUp(false);
    setShowResult(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptions({
        natural: false,
        irrational: false,
        rational: false,
        integer: false,
      });
      setQuestionsAnswered((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuestionsAnswered(0);
    setSmartScore(0);
    setTimeElapsed(0);
    setSelectedOptions({
      natural: false,
      irrational: false,
      rational: false,
      integer: false,
    });
    setShowResult(false);
    setShowKeepUp(false);
    setTimerRunning(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const formattedTime = formatTime(timeElapsed);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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

            {/* Question and Answer Selection */}
            {!showResult && !showKeepUp && (
              <>
                <p className="text-gray-900 text-sm mb-4 font-normal">
                  Which of the following describe{" "}
                  <span className="font-bold text-lg">
                    {currentQuestion.number}
                  </span>
                  ? Select all that apply.
                </p>
                <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
                  {["natural", "irrational", "rational", "integer"].map(
                    (option) => (
                      <motion.label
                        key={option}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center bg-sky-100 rounded border w-full md:w-[calc(50%-0.75rem)] h-12 cursor-pointer select-none ${
                          selectedOptions[option]
                            ? "border-sky-500 bg-sky-200"
                            : "border-sky-300"
                        }`}
                        onClick={() => handleOptionChange(option)}
                      >
                        <div
                          className={`w-8 h-12 flex justify-center items-center rounded-l ${
                            selectedOptions[option]
                              ? "bg-sky-500"
                              : "bg-sky-300"
                          }`}
                        >
                          {selectedOptions[option] && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-900 text-sm pl-4 whitespace-nowrap">
                          {option === "natural" && "natural number"}
                          {option === "irrational" && "irrational number"}
                          {option === "rational" && "rational number"}
                          {option === "integer" && "integer"}
                        </span>
                      </motion.label>
                    )
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-6 bg-lime-700 text-white text-sm font-semibold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  onClick={handleSubmit}
                  disabled={Object.values(selectedOptions).every((val) => !val)}
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
                {isCorrect ? (
                  <div className="bg-green-100 border border-green-300 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600 mr-2"
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
                      <span className="text-green-800 font-semibold">
                        Correct!
                      </span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Great job! You selected the correct classification.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-300 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-red-800 font-semibold">
                        Incorrect
                      </span>
                    </div>
                    <p className="text-red-700 text-sm">
                      The correct answer has been highlighted.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Explanation:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {currentQuestion.explanation}
                  </p>
                </div>

                {isCorrect ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded"
                    onClick={() => {
                      setShowResult(false);
                      setShowKeepUp(true);
                    }}
                  >
                    Keep it up!
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded"
                    onClick={handleNextQuestion}
                  >
                    {isLastQuestion ? "Finish" : "Next question"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Quiz Completed */}
            {isLastQuestion &&
              currentQuestionIndex === questions.length - 1 &&
              showKeepUp && (
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
            <div className="w-28 flex flex-col text-center text-gray-900 text-xs font-semibold select-none mt-0">
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
