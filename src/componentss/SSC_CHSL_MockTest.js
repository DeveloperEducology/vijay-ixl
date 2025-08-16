import React, { useState, useEffect, useMemo } from "react";
import {
  FaBars,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaRegCircle,
  FaBookmark,
} from "react-icons/fa";

// ✅ Helper: Format seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")} : ${secs
    .toString()
    .padStart(2, "0")}`;
};

const SSC_CHSL_MockTest = () => {
  // ======= Sample Data =======
  const sections = [
    { name: "General Intelligence", shortName: "GI", questions: 25 },
    { name: "General Knowledge", shortName: "GA", questions: 25 },
    { name: "Quantitative Aptitude", shortName: "QA", questions: 25 },
    { name: "English Grammar", shortName: "EL", questions: 25 },
  ];

  const questions = [
    {
      id: 1,
      section: "General Knowledge",
      text: "The first stamp was printed in",
      options: ["India", "England", "America", "Australia"],
      correctAnswer: 1,
    },
    {
      id: 2,
      section: "General Knowledge",
      text: "Choose the correct statement:",
      options: [
        "The first stamp had a picture of a lion",
        "The first stamp had a picture of Queen Victoria",
        "The first stamp had a picture of Queen Elizabeth",
        "The first stamp had a picture of a goat",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      section: "General Knowledge",
      text: "The hobby of collecting stamps is called:",
      options: ["Gardening", "Fashion Designing", "Cooking", "Philately"],
      correctAnswer: 3,
    },
    {
      id: 4,
      section: "English Grammar",
      text: "In the sentence It was black and had a picture of Queen Victoria, identify the part of speech for black”.",
      options: ["Noun", "Pronoun", "Adjective", "Verb"],
      correctAnswer: 2,
    },
    {
      id: 5,
      section: "English Grammer",
      text: "Choose the opposite of send",
      options: ["Receive", "Cost", "Brought", "Sell"],
      correctAnswer: 0,
    },
    {
      id: 6,
      section: "English Grammar",
      text: "Select the incorrect option:",
      options: [
        "Mouse – Mice",
        "Child – Children",
        "Sheep – Sheeps",
        "Woman – Women",
      ],
      correctAnswer: 2,
    },
    {
      id: 7,
      section: "English Grammar",
      text: "Identify the question tag in: She sings very well, doesn't she?",
      options: ["doesn't", "doesn't she?", "sings", "well"],
      correctAnswer: 1,
    },
    {
      id: 8,
      section: "English Grammar",
      text: "Choose the option that does not come under gender:",
      options: ["Masculine", "Feminine", "Singular", "Neuter"],
      correctAnswer: 2,
    },
    {
      id: 9,
      section: "English Grammar",
      text: "Identify the type of sentence: Come and do your duty",
      options: ["Assertive", "Interrogative", "Imperative", "Exclamatory"],
      correctAnswer: 2,
    },
    {
      id: 10,
      section: "English Grammar",
      text: "Laughter is the best medicine. — Identify kind of noun for laughter",
      options: [
        "Proper Noun",
        "Common Noun",
        "Abstract Noun",
        "Collective Noun",
      ],
      correctAnswer: 2,
    },
    {
      id: 11,
      section: "English Grammar",
      text: "Choose the correct sentence where enough is used as an adverb:",
      options: [
        "There is enough ink in the pot.",
        "She has time enough to buy the shoes.",
        "He was kind enough to help me.",
        "She is enough beautiful to tempt me.",
      ],
      correctAnswer: 2,
    },
    {
      id: 12,
      section: "English Grammar",
      text: "A ______ of ships.",
      options: ["bundle", "brood", "fleet", "pack"],
      correctAnswer: 2,
    },
    {
      id: 13,
      section: "English Grammar",
      text: "Select the sentence with the correct word order:",
      options: [
        "Call each other with the mice repeating calls.",
        "The mice call each other with repeating calls.",
        "The mice call repeating calls with each other.",
        "The mice repeating calls with each other.",
      ],
      correctAnswer: 1,
    },
    {
      id: 14,
      section: "English Grammar",
      text: "Don't disturb me. I ______ my work.",
      options: ["do", "did", "am doing", "does"],
      correctAnswer: 2,
    },
    {
      id: 15,
      section: "English Grammar",
      text: "Identify the adverb in: She read the answer twice.",
      options: ["twice", "answer", "read", "she"],
      correctAnswer: 0,
    },
    {
      id: 16,
      section: "English Grammer",
      text: "Opposite of brave",
      options: ["Coward", "Clever", "Courageous", "Shameful"],
      correctAnswer: 0,
    },
    {
      id: 17,
      section: "English Grammer",
      text: "She requested him to drop her home. — nearest meaning to requested:",
      options: ["Ordered", "Ask politely", "Instructed", "Forced"],
      correctAnswer: 1,
    },
    {
      id: 18,
      section: "English Grammar",
      text: "The baby was ______ in the room.",
      options: ["sleep", "sleeping", "will sleep", "will be sleeping"],
      correctAnswer: 1,
    },
    {
      id: 19,
      section: "English Grammer",
      text: "You have hit the nail on the ******.",
      options: ["head", "leg", "arm", "finger"],
      correctAnswer: 0,
    },
    {
      id: 20,
      section: "Spelling",
      text: "Correct spelling:",
      options: ["Sincerity", "Sencerity", "Sincerrity", "Sinceerity"],
      correctAnswer: 0,
    },
    {
      id: 21,
      section: "English Grammar",
      text: "****** is standing at the gate?",
      options: ["Who", "Whom", "Which", "Whose"],
      correctAnswer: 0,
    },
    {
      id: 22,
      section: "English Grammar",
      text: "They are going to ______ Metro station.",
      options: ["a", "the", "an", "no article"],
      correctAnswer: 1,
    },
    {
      id: 23,
      section: "English Grammar",
      text: "Identify the adjective:",
      options: ["Saw", "To", "Honest", "His"],
      correctAnswer: 2,
    },
    {
      id: 24,
      section: "English Grammar",
      text: "The restaurant is ______ the school.",
      options: ["up", "behind", "along", "between"],
      correctAnswer: 1,
    },
    {
      id: 25,
      section: "English Grammar",
      text: "They left ______ shoes on the floor as there ______ no space on the shoe rack.",
      options: [
        "they're, their",
        "their, there",
        "there, their",
        "their, they're",
      ],
      correctAnswer: 1,
    },
  ];

  // ======= State =======
  const totalQuestions = sections.reduce((sum, sec) => sum + sec.questions, 0);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null));
  const [questionTime, setQuestionTime] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(60 * 60); // 1 hour
  const [questionStatus, setQuestionStatus] = useState(
    Array(totalQuestions).fill("not-visited")
  );
  const [showSidebar, setShowSidebar] = useState(false);

  // ======= Derived Values =======
  const answeredCount = useMemo(
    () => questionStatus.filter((s) => s === "answered").length,
    [questionStatus]
  );
  const markedCount = useMemo(
    () => questionStatus.filter((s) => s === "marked").length,
    [questionStatus]
  );
  const notVisitedCount = useMemo(
    () => questionStatus.filter((s) => s === "not-visited").length,
    [questionStatus]
  );

  const currentQuestionData = questions[currentQuestion] || null;

  // ======= Timers =======
  useEffect(() => {
    const questionTimer = setInterval(
      () => setQuestionTime((prev) => prev + 1),
      1000
    );
    const totalTimer = setInterval(
      () =>
        setTotalTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(totalTimer);
            return 0;
          }
          return prev - 1;
        }),
      1000
    );

    return () => {
      clearInterval(questionTimer);
      clearInterval(totalTimer);
    };
  }, []);

  // ======= Handlers =======
  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);

    const newStatus = [...questionStatus];
    newStatus[currentQuestion] = "answered";
    setQuestionStatus(newStatus);
  };

  const navigateToQuestion = (index) => {
    if (index < 0 || index >= totalQuestions) return;
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]);
    setQuestionTime(0);

    setQuestionStatus((prev) => {
      const updated = [...prev];
      if (updated[index] === "not-visited") {
        updated[index] = "visited";
      }
      return updated;
    });

    setShowSidebar(false);
  };

  const handleSectionChange = (index) => {
    setCurrentSection(index);
    navigateToQuestion(index * sections[0].questions);
  };

  const handleSaveAndNext = () => {
    navigateToQuestion(currentQuestion + 1);
  };

  const handleClearResponse = () => {
    setSelectedAnswer(null);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);

    setQuestionStatus((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = "visited";
      return updated;
    });
  };

  const handleMarkForReview = () => {
    setQuestionStatus((prev) => {
      const updated = [...prev];
      updated[currentQuestion] = "marked";
      return updated;
    });
    handleSaveAndNext();
  };

  const getQuestionStatusStyle = (status, index) => {
    const base = "flex items-center justify-center h-8 w-8 rounded border";
    switch (status) {
      case "answered":
        return `${base} bg-green-100 border-green-500 text-green-700`;
      case "marked":
        return `${base} bg-purple-100 border-purple-500 text-purple-700`;
      default:
        return `${base} ${
          currentQuestion === index
            ? "bg-blue-50 border-blue-300"
            : "bg-gray-50 border-gray-300"
        } text-gray-700`;
    }
  };

  // ======= Render =======
  return (
    <div className="font-sans text-gray-800 bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <button
          className="md:hidden text-gray-600"
          onClick={() => setShowSidebar((prev) => !prev)}
          aria-label="Toggle Sidebar"
        >
          {showSidebar ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        <h1 className="text-xl font-bold text-center text-blue-800 flex-1">
          SSC CHSL Mock Test
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">
          {currentQuestionData ? (
            <>
              {/* Question Header */}
              <div className="flex justify-between mb-4">
                <div>
                  Q: {currentQuestion + 1} / {totalQuestions}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <FaClock />
                  <span>Qn. Time: {formatTime(questionTime)}</span>
                </div>
              </div>

              {/* Question */}
              <div className="bg-white p-4 border rounded-lg mb-4">
                <p className="mb-4">{currentQuestionData.text}</p>
                {currentQuestionData.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center space-x-3 p-2 border rounded-lg cursor-pointer ${
                      selectedAnswer === idx
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      checked={selectedAnswer === idx}
                      onChange={() => handleAnswerSelect(idx)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handleMarkForReview}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Mark & Next
                </button>
                <button
                  onClick={handleClearResponse}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Clear
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <p>No question found.</p>
          )}
        </main>
                {/* Sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
        <aside
          className={`w-64 h-full border-l border-gray-200 bg-gray-50 p-4 overflow-auto fixed md:static h-full z-30 transition-transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {/* Section Selector */}
          <h2 className="font-semibold mb-2">Sections</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {sections.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => handleSectionChange(idx)}
                className={`py-1 px-2 rounded text-sm ${
                  currentSection === idx
                    ? "bg-blue-100 border-blue-300"
                    : "bg-white border border-gray-300"
                }`}
              >
                {sec.shortName}
              </button>
            ))}
          </div>

          {/* Stats */}
          <h2 className="font-semibold mb-2">Test Status</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Time Left:</span>
              <span>{formatTime(totalTimeLeft)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Answered:</span>
              <span>{answeredCount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Not Visited:</span>
              <span>{notVisitedCount}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Marked:</span>
              <span>{markedCount}</span>
            </div>
          </div>

          {/* Question Palette */}
          <h2 className="font-semibold mt-4 mb-2">
            {sections[currentSection].name}
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: sections[currentSection].questions }).map(
              (_, idx) => {
                const qIndex = currentSection * sections[0].questions + idx;
                return (
                  <button
                    key={idx}
                    onClick={() => navigateToQuestion(qIndex)}
                    className={getQuestionStatusStyle(
                      questionStatus[qIndex],
                      qIndex
                    )}
                  >
                    {qIndex + 1}
                  </button>
                );
              }
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default SSC_CHSL_MockTest;
