import React from "react";
import { motion } from "framer-motion";

const QuestionCard = ({
  question,
  selectedOptions,
  onOptionToggle,
  onSubmit,
  onNext,
  disabledSubmit,
  showExplanation,
  explanationText
}) => {
  return (
    <div className="flex-1 pr-0 md:pr-12">
      <p className="text-gray-900 text-sm mb-4 font-normal">
        Which of the following describe{" "}
        <span className="font-bold text-lg">{question.number}</span>? Select all that apply.
      </p>

      {/* Options */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {question.options.map((option) => (
          <motion.label
            key={option.value}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center bg-sky-100 rounded border w-full md:w-[calc(50%-0.75rem)] h-12 cursor-pointer select-none ${
              selectedOptions.includes(option.value)
                ? "border-sky-500 bg-sky-200"
                : "border-sky-300"
            }`}
            onClick={() => !showExplanation && onOptionToggle(option.value)}
          >
            <div
              className={`w-8 h-12 flex justify-center items-center rounded-l ${
                selectedOptions.includes(option.value)
                  ? "bg-sky-500"
                  : "bg-sky-300"
              }`}
            >
              {selectedOptions.includes(option.value) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-gray-900 text-sm pl-4 whitespace-nowrap">
              {option.label}
            </span>
          </motion.label>
        ))}
      </div>

      {/* Action buttons */}
      {!showExplanation ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-6 bg-lime-700 text-white text-sm font-semibold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          onClick={onSubmit}
          disabled={disabledSubmit}
        >
          Submit
        </motion.button>
      ) : (
        <>
          {/* Explanation */}
          <div className="mt-4 p-4 bg-white border border-gray-300 rounded">
            <p className="text-gray-800 text-sm">{explanationText}</p>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-6 bg-sky-600 text-white text-sm font-semibold px-6 py-2 rounded w-full md:w-auto"
            onClick={onNext}
          >
            Next
          </motion.button>
        </>
      )}
    </div>
  );
};

export default QuestionCard;
