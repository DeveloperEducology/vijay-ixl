// src/pages/QuizPage.jsx
import React, { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";

const mockQuestions = [
  {
    questionType: "mcq",
    questionText: "What is 5 + 3?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    questionType: "fill_blank",
    questionText: "The sun ___ in the east.",
    options: ["rise", "rises", "rose", "raising"],
    correctAnswer: "rises",
  },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = mockQuestions[currentIndex];
  const selectedAnswer = answers[currentIndex];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentIndex]: answer });
  };

  const handleNext = () => {
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const getScore = () => {
    return mockQuestions.reduce((score, q, idx) => {
      return q.correctAnswer === answers[idx] ? score + 1 : score;
    }, 0);
  };

  if (showResult) {
    return (
      <div>
        <h2>Quiz Complete!</h2>
        <p>
          You scored {getScore()} / {mockQuestions.length}
        </p>
        <button onClick={() => window.location.reload()}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h3>
        Question {currentIndex + 1} / {mockQuestions.length}
      </h3>
      <QuestionRenderer
        questionData={currentQuestion}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
      />
      <button
        onClick={handleNext}
        style={{ marginTop: "20px", padding: "10px 20px" }}
        disabled={selectedAnswer == null}
      >
        {currentIndex === mockQuestions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}
