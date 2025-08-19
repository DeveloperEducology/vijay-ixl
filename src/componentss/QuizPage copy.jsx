import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, acceleratedValues } from "framer-motion";
import { useParams } from "react-router-dom";
import { questionsGenerator } from "../utils/KidQnGntr";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import { InlineMath } from "react-katex";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { FiVolume, FiVolume2 } from "react-icons/fi";
import SortingQuestion from "../pages/SortingQuestion";
import BlankInputComponent from "../pages/BlankInputComponent";

const QuizPage = () => {
  const { topicId } = useParams();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [smartScore, setSmartScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [showExample, setShowExample] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showKeepUp, setShowKeepUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showhint, setShowhint] = useState(false);

  const decodedKey = decodeURIComponent(topicId);

  // Initialize questions
  useEffect(() => {
    if (questionsGenerator[decodedKey]) {
      const generated = questionsGenerator[decodedKey]();
      setCurrentQuestion(generated);
      setTimerRunning(true);
    }
  }, [decodedKey]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const formattedTime = formatTime(timeElapsed);

  const readAloud = async (text) => {
    if (!text) return;
    setIsSpeaking(true);
    try {
      const audio = await window.puter.ai.txt2speech(text, "en-US");
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setIsSpeaking(false);
    }
  };

  const handleAnswerChange = (e, index) => {
    const value = e.target.value;
    const prevSequenceAnswers = userAnswers[currentQuestion._id] || [];
    const newSequenceAnswers = [...prevSequenceAnswers];
    newSequenceAnswers[index] = value;
    setUserAnswers({
      ...userAnswers,
      [currentQuestion._id]: newSequenceAnswers,
    });
  };

  const handleMultipleSelect = (option) => {
    setSelectedAnswers((prev) =>
      prev.includes(option)
        ? prev.filter((ans) => ans !== option)
        : [...prev, option]
    );
  };

  const generateNewQuestion = () => {
    const question = questionsGenerator[decodedKey]();
    setCurrentQuestion(question);
    setUserAnswer("");
    setSelectedAnswers([]);
    setFeedback("");
    setShowResult(false);
    setQuestionsAnswered((prev) => prev + 1);
    setShowhint(false);
  };

  const resetOptions = () => {
    setUserAnswer("");
    setSelectedAnswers([]);
    setUserAnswers({});
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setShowKeepUp(false);
    resetOptions();
    generateNewQuestion();
    setQuestionsAnswered((prev) => prev + 1);
  };

  const handleKeepUpContinue = () => {
    setShowKeepUp(false);
    setShowResult(false);
    resetOptions();
    generateNewQuestion();
    setQuestionsAnswered((prev) => prev + 1);
  };

  console.log("Current Question:", currentQuestion);

  const handleSubmit = () => {
    if (!currentQuestion) return;

    const { type, answer } = currentQuestion;
    const correctAnswers = Array.isArray(answer)
      ? answer
      : [answer?.toString()];
    console.log("Correct Answers:", correctAnswers);

    // Validation
    let isEmpty = false;

    switch (type) {
      case "input":
      case "mcq":
      case "true_false":
        isEmpty = !userAnswer;
        break;
      case "mcq-multiple":
        isEmpty = selectedAnswers.length === 0;
        break;
      case "sequence":
        const seqAnswers = userAnswers[currentQuestion._id] || [];
        isEmpty = seqAnswers.length === 0 || seqAnswers.some((a) => !a);
        break;
      case "sorting":
        isEmpty = false; // Sorting always has items, no empty state
        break;
      default:
        isEmpty = true;
    }

    if (isEmpty) {
      setFeedback("⚠️ Please provide an answer before submitting");
      return;
    }

    let isCorrect = false;
    let feedbackMessage = "";

    switch (type) {
      case "mcq-multiple":
        isCorrect =
          correctAnswers.length === selectedAnswers.length &&
          correctAnswers.every((ans) => selectedAnswers.includes(ans));
        feedbackMessage = isCorrect
          ? "🎉 Perfect! All correct answers selected!"
          : `❌ Oops! Correct answers were: ${correctAnswers.join(", ")}`;
        break;

      case "input":
      case "mcq":
      case "true_false":
        isCorrect = correctAnswers.some(
          (ans) =>
            ans.toString().toLowerCase() === userAnswer.toString().toLowerCase()
        );
        feedbackMessage = isCorrect
          ? "🎉 Correct! Great job!"
          : `❌ Not quite! The correct answer was: ${correctAnswers.join(
              ", "
            )}`;
        break;

      case "sequence": {
        const userSequenceAnswers = userAnswers[currentQuestion._id] || [];

        isCorrect =
          correctAnswers.length === userSequenceAnswers.length &&
          correctAnswers.every((correctAns, i) => {
            const userVal = userSequenceAnswers[i] ?? "";
            return correctAns?.toString().trim() === userVal?.toString().trim();
          });

        feedbackMessage = isCorrect
          ? "🎉 Well done! You completed the sequence correctly!"
          : `❌ Not quite. Correct sequence was: ${correctAnswers.join(", ")}`;
        break;
      }

      case "sorting": {
        // Ensure userAnswers is always an array
        const userSorting = Array.isArray(userAnswers[currentQuestion._id])
          ? userAnswers[currentQuestion._id]
          : [];

        // Extract values safely from items
        const items = Array.isArray(currentQuestion.items)
          ? currentQuestion.items.map((item) => item.value)
          : [];

        // Generate the correct sorted order
        const correctSorted =
          currentQuestion.orderType === "asc"
            ? [...items].sort((a, b) => a - b)
            : [...items].sort((a, b) => b - a);

        let isCorrect = false;
        let feedbackMessage = "⚠️ Please sort the items first!";

        if (userSorting.length > 0) {
          // Normalize both to numbers for safe comparison
          const normalizedUser = userSorting.map((v) => Number(v));
          const normalizedCorrect = correctSorted.map((v) => Number(v));

          isCorrect =
            JSON.stringify(normalizedUser) ===
            JSON.stringify(normalizedCorrect);

          feedbackMessage = isCorrect
            ? `🎉 Correct! You sorted in ${currentQuestion.orderType.toUpperCase()} order!`
            : `❌ Not quite. Correct order was: ${normalizedCorrect.join(
                ", "
              )}`;
        }

        console.log("👉 Raw User Sorting:", userSorting);
        console.log("👉 Correct Sorted:", correctSorted);
        console.log("👉 Order Type:", currentQuestion.orderType);
        console.log("👉 Is Correct?", isCorrect);
        console.log("👉 Feedback:", feedbackMessage);

        break;
      }

      default:
        feedbackMessage = "⚠️ Unknown question type";
        break;
    }

    // 🔗 Save result (object, not array!)
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        givenAnswer:
          type === "mcq-multiple"
            ? selectedAnswers
            : type === "input" || type === "mcq" || type === "true_false"
            ? userAnswer
            : prev[currentQuestion._id]?.givenAnswer || [],
        isCorrect,
      },
    }));

    setFeedback(feedbackMessage);
    setIsCorrect(isCorrect);
    setShowResult(true);
    setTimerRunning(false);

    if (isCorrect) {
      setSmartScore((prev) => Math.min(prev + 10, 100));
      setTimeout(() => {
        generateNewQuestion();
      }, 1000);
    } else {
      setSmartScore((prev) => Math.max(prev - 5, 0));
    }
  };

  // inside QuizPage
  const handleAnswer = (isCorrect) => {
    // update score
    if (isCorrect) {
      // setScore((prev) => prev + 1);
    }

    // store answer for review (optional)
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect,
      },
    ]);

    // ✅ give feedback (e.g. explanation or highlight)
    // setShowExplanation(true);

    // if you want to auto-move on sorting / MCQ:
    // setTimeout(() => {
    //   goToNextQuestion();
    // }, 1500);
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
    generateNewQuestion();
  };

  const handleAnswerSubmit = (answer) => {
    alert(`You submitted: ${answer}`);
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "input":
        return (
          <BlankInputComponent
            exampleText="Learn with an example"
            questionText={currentQuestion.question}
            images={currentQuestion.images}
            onSubmit={handleSubmit}
            answer={userAnswer}
            onChangeAnswer={(e) => setUserAnswer(e.target.value)}
            promptText={currentQuestion.prompt || "Enter your answer:"}
          />
        );

      case "sorting":
        return (
          <SortingQuestion
            question={currentQuestion.question}
            items={currentQuestion.items}
            orderType={currentQuestion.orderType}
            onAnswer={handleAnswer} // same callback as MCQ, T/F, etc.
          />
        );

      case "input1":
        return (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showResult}
            className="
    border border-[#03a9f4] 
    w-16 h-10
    sm:w-20 sm:h-12 
    text-center text-lg 
    font-normal 
    focus:outline-none focus:ring-2 focus:ring-[#03a9f4]
    transition-all
  "
            autoComplete="off"
            autoFocus // Corrected to camelCase
            // ref={(input) => input && input.focus()} // More reliable focus handling
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
                    disabled={showResult}
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
      case "true_false":
        return (
          <div className="flex flex-col gap-4 items-left w-full">
            <div className="flex flex-wrap gap-3 justify-left mt-6">
              {currentQuestion.options.map((option) => {
                const isSelected = userAnswer === option;
                const isCorrect = showResult && correctAnswers.includes(option);
                const isWrong =
                  showResult && isSelected && !correctAnswers.includes(option);

                return (
                  <button
                    key={option}
                    onClick={() => setUserAnswer(option)}
                    disabled={showResult}
                    className={`flex items-center rounded border w-full md:w-auto px-5 h-12 cursor-pointer select-none transition-all duration-200 text-sm font-medium
            ${isCorrect ? "border-green-500 bg-green-200" : ""}
            ${isWrong ? "border-red-500 bg-red-200" : ""}
            ${
              isSelected && !showResult
                ? "border-sky-900 bg-sky-200"
                : !isSelected && !showResult
                ? "border-sky-300 hover:border-purple-300"
                : ""
            }
          `}
                  >
                    <span className="text-gray-900 whitespace-nowrap">
                      {currentQuestion?.latex === true ? (
                        <InlineMath math={option} />
                      ) : (
                        option
                      )}
                    </span>
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

            {showResult && userAnswer && currentQuestion.explanation && (
              <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                <strong>Explanation:</strong>
                {Array.isArray(currentQuestion.explanation) ? (
                  currentQuestion.explanation.map((exp, i) => (
                    <ReactMarkdown
                      key={i}
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {exp}
                    </ReactMarkdown>
                  ))
                ) : (
                  <p>{currentQuestion.explanation}</p>
                )}
              </div>
            )}
          </div>
        );

      case "mcq-multiple":
        return (
          <div className="flex flex-col gap-4 items-center w-full">
            {/* Options */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 w-full justify-left">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedAnswers.includes(option);
                const isCorrect =
                  showResult && currentQuestion.answer.includes(option);
                const isWrong =
                  showResult &&
                  isSelected &&
                  !currentQuestion.answer.includes(option);

                return (
                  <motion.label
                    key={option}
                    role="checkbox"
                    aria-checked={isSelected}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center rounded border w-full md:w-auto pr-5 h-12 cursor-pointer select-none transition-all duration-200 ${
                      isCorrect
                        ? "border-green-600 bg-green-200"
                        : isWrong
                        ? "border-red-600 bg-red-200"
                        : isSelected
                        ? "border-purple-600 bg-purple-200"
                        : "border-sky-300 bg-white"
                    }`}
                    onClick={() => handleMultipleSelect(option)}
                  >
                    <div
                      className={`w-8 h-12 flex justify-center items-center rounded-l ${
                        isCorrect
                          ? "bg-green-500"
                          : isWrong
                          ? "bg-red-500"
                          : isSelected
                          ? "bg-purple-500"
                          : "bg-sky-300"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 20 20"
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
                      {currentQuestion?.latex ? (
                        <InlineMath math={option} />
                      ) : (
                        option
                      )}
                    </span>
                  </motion.label>
                );
              })}
            </div>

            {/* Feedback */}
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

            {/* Explanation */}
            {showResult && currentQuestion.explanation && (
              <div className="mt-4 text-md text-gray-800 bg-white/80 border-l-4 border-purple-400 p-3 rounded-md max-w-lg">
                <strong>Explanation:</strong>
                {Array.isArray(currentQuestion.explanation) ? (
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    {currentQuestion.explanation.map((explain, index) => (
                      <li key={index}>
                        <InlineMath math={explain} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{currentQuestion.explanation}</p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderVisuals = () => {
    if (!currentQuestion?.visuals || currentQuestion.visuals.length === 0) {
      return null;
    }

    // Even Number Hunt
    if (decodedKey === "🔢 Even Number Hunt") {
      return (
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex flex-wrap justify-left gap-4 p-2 bg-blue-50 rounded-lg"
          >
            {currentQuestion.visuals.map((visual, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                className={`text-4xl p-3 rounded-lg ${
                  currentQuestion.answer.includes(visual.content) && showResult
                    ? "bg-green-100 border-2 border-green-400"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                {visual.content}
              </motion.div>
            ))}
          </motion.div>
        </div>
      );
    }

    // Skip-Counting Adventure
    if (decodedKey === "Skip-Counting-pictures") {
      return (
        <div className="flex justify-left">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex flex-wrap gap-3 sm:gap-5 p-3 sm:p-5 rounded-lg bg-purple-50"
          >
            {currentQuestion.visuals.map((group, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                {group}
              </motion.div>
            ))}
          </motion.div>
        </div>
      );
    }

    // Default (e.g., Even or Odd)
    return (
      <div className="flex justify-left">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "decay", stiffness: 300, damping: 20 }}
          className="inline-flex flex-wrap gap-2 sm:gap-4 p-2 sm:p-2 rounded-lg"
        >
          <div className="flex flex-wrap gap-3 text-4xl">
            {currentQuestion.visuals.map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-300 to-emerald-200 min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-sky-200 text-xs text-gray-700 flex justify-between px-4 py-1 items-center select-none">
        <div className="flex items-center space-x-1">
          <span>Class IX</span>
          <span>-</span>
          <span>{topicId}</span>
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
                    {formattedTime.mins}:{formattedTime.secs}
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
            <div>
              <button
                onClick={() => setShowExample((prev) => !prev)}
                className="text-[#03a9f4] font-semibold text-sm justify-center leading-6 hover:underline"
              >
                Learn with an example
              </button>

              <AnimatePresence>
                {showExample && currentQuestion?.example && (
                  <motion.div
                    key="example"
                    initial={{ height: 0, opacity: 0, x: -20 }}
                    animate={{ height: "auto", opacity: 1, x: 0 }}
                    exit={{ height: 0, opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="flex items-start gap-2">
                      {/* Read aloud button */}

                      <button
                        onClick={() =>
                          readAloud((currentQuestion?.example || []).join(" "))
                        }
                        disabled={isSpeaking}
                        className="text-xl text-purple-600 hover:text-purple-800 transition-colors flex-shrink-0 mt-1"
                        aria-label="Read aloud"
                      >
                        {isSpeaking ? <FiVolume /> : <FiVolume2 />}
                      </button>

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex-1">
                        <h4 className="text-blue-700 font-semibold mb-2">
                          Example
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                          {currentQuestion.example.map((step, i) => (
                            <li key={i}>
                              <ReactMarkdown>{step}</ReactMarkdown>
                            </li>
                          ))}
                        </ul>

                        {/* {currentQuestion.explanation && (
                          <>
                            <h4 className="text-blue-700 font-semibold mt-4 mb-2">
                              Step-by-step explanation
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                              {currentQuestion.explanation.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ul>
                          </>
                        )} */}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                <div className="flex items-start gap-3 text-gray-800 min-h-[4rem]">
                  {/* Read aloud button */}
                  <button
                    onClick={() => readAloud(currentQuestion?.question)}
                    disabled={isSpeaking}
                    className="text-xl text-purple-600 hover:text-purple-800 transition-colors flex-shrink-0 mt-1"
                    aria-label="Read aloud"
                  >
                    {isSpeaking ? <FiVolume /> : <FiVolume2 />}
                  </button>

                  {/* Question content */}
                  <div className="flex-1">
                    {/* Passage */}
                    {currentQuestion?.passage && (
                      <div className="mb-4">
                        <h3 className="text-gray-700 font-semibold mb-2">
                          Passage:
                        </h3>
                        <div className="bg-white/70 rounded-md p-3 border border-gray-200 text-gray-800 text-md">
                          <ReactMarkdown>
                            {currentQuestion.passage}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Main question */}
                    {currentQuestion?.latex ? (
                      <div className="text-xl text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {currentQuestion?.question}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="text-gray-900 text-sm mb-4 font-normal">
                              {children}
                            </p>
                          ),
                        }}
                      >
                        {currentQuestion?.question || ""}
                      </ReactMarkdown>
                    )}

                    {/* SVG */}
                    {currentQuestion?.svg && (
                      <div className="overflow-auto max-w-full px-2">
                        <div
                          className="w-full max-w-full"
                          dangerouslySetInnerHTML={{
                            __html: currentQuestion.svg,
                          }}
                        />
                      </div>
                    )}

                    {/* Table */}
                    {currentQuestion?.table && (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ node, ...props }) => (
                            <table className="w-auto border border-gray-400 border-collapse mx-auto my-4 text-sm">
                              {props.children}
                            </table>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-gray-100 text-center text-[14px]">
                              {props.children}
                            </thead>
                          ),
                          tr: ({ node, ...props }) => (
                            <tr className="border-b border-gray-300 text-center">
                              {props.children}
                            </tr>
                          ),
                          th: ({ node, ...props }) => (
                            <th className="border border-gray-400 px-2 py-1 font-semibold min-w-[100px]">
                              {props.children}
                            </th>
                          ),
                          td: ({ node, ...props }) => (
                            <td className="border border-gray-300 px-2 py-1">
                              {props.children}
                            </td>
                          ),
                        }}
                      >
                        {currentQuestion.table}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>

                {renderVisuals()}
                {currentQuestion?.prompt && (
                  <div className="flex items-center gap-3 text-gray-800 min-h-[4rem]">
                    <button
                      onClick={() => readAloud(currentQuestion?.prompt)}
                      disabled={isSpeaking}
                      className="text-xl text-purple-600 hover:text-purple-800 transition-colors flex-shrink-0 mt-1"
                      aria-label="Read aloud"
                    >
                      {isSpeaking ? <FiVolume /> : <FiVolume2 />}
                    </button>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {currentQuestion?.prompt || ""}
                    </ReactMarkdown>
                  </div>
                )}

                <div className="flex justify-left mt-5">
                  {renderQuestionInput()}
                </div>

                {feedback && (
                  <div className="mt-2 text-red-500 text-sm">{feedback}</div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-6 bg-lime-700 text-white text-sm font-semibold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  onClick={handleSubmit}
                  disabled={showResult}
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
                      ? "Great job! You got the correct answer."
                      : feedback}
                  </p>
                </div>

                {currentQuestion.explanation && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Explanation:
                    </h4>
                    {Array.isArray(currentQuestion.explanation) ? (
                      currentQuestion.explanation.map((exp, i) => (
                        <ReactMarkdown
                          key={i}
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {exp}
                        </ReactMarkdown>
                      ))
                    ) : (
                      <p className="text-gray-700 text-sm">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded"
                  onClick={
                    isCorrect ? handleKeepUpContinue : handleNextQuestion
                  }
                >
                  {isCorrect ? "Continue" : "Next question"}
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
                    <span>{formattedTime.mins}</span>
                    <span className="text-[8px] font-light text-gray-400">
                      MIN
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span>{formattedTime.secs}</span>
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
