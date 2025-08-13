import React from "react";
import { motion } from "framer-motion";

export default function MCQQuestion({ data, onAnswer, selectedAnswer }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-3xl">
      {/* Question */}
      <h2 className="text-gray-900 text-lg font-semibold mb-6">
        {data.questionText}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {data.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          return (
            <motion.label
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center bg-sky-100 rounded border w-44 h-12 cursor-pointer select-none ${
                isSelected ? "border-sky-500 bg-sky-200" : "border-sky-300"
              }`}
              onClick={() => onAnswer(opt)}
            >
              <div
                className={`w-8 h-12 flex justify-center items-center rounded-l ${
                  isSelected ? "bg-sky-500" : "bg-sky-300"
                }`}
              >
                {isSelected && (
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
              <span className="text-gray-900 text-sm pl-4">{opt}</span>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
}
