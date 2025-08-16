import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import QuestionCard from "./QuestionCard";

const Quizz = () => {
  const questions = [
    {
      number: 1,
      options: [
        { value: "natural", label: "natural number" },
        { value: "irrational", label: "irrational number" },
        { value: "rational", label: "rational number" },
        { value: "integer", label: "integer" },
      ],
      explanation: "1 is a natural number, a rational number, and an integer.",
    },
    {
      number: 2,
      options: [
        { value: "even", label: "even number" },
        { value: "prime", label: "prime number" },
        { value: "composite", label: "composite number" },
        { value: "odd", label: "odd number" },
      ],
      explanation: "2 is an even number and a prime number.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleOption = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((opt) => opt !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedOptions([]);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log("Quiz complete!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 font-sans p-14 sm:p-6">
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentIndex} // triggers animation on change
          question={questions[currentIndex]}
          selectedOptions={selectedOptions}
          onOptionToggle={toggleOption}
          onSubmit={handleSubmit}
          onNext={handleNext}
          disabledSubmit={selectedOptions.length === 0}
          showExplanation={showExplanation}
          explanationText={questions[currentIndex].explanation}
        />
      </AnimatePresence>
    </div>
  );
};

export default Quizz;
