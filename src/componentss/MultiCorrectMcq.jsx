import React from "react";
import { motion } from "framer-motion";

function MultiCorrectMcq({
  options = [],
  currentQuestion = "",
  selectedOptions = {},
  handleOptionChange,
  optionConfig = {},
}) {
  return (
    <div>
      <p className="text-gray-900 text-sm mb-4 font-normal">
        {currentQuestion}
      </p>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {options.map((option) => {
          return (
            <motion.label
              key={option}
              role="checkbox"
              aria-checked={!!selectedOptions[option]}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center rounded border w-full md:w-auto pr-5 h-12 cursor-pointer select-none transition-all duration-200 ${
                selectedOptions[option]
                  ? "border-sky-900 bg-sky-200"
                  : "border-sky-300"
              }`}
              onClick={() => handleOptionChange(option)}
            >
              <div
                className={`w-8 h-12 flex justify-center items-center rounded-l ${
                  selectedOptions[option] ? "bg-sky-500" : "bg-sky-300"
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
                {option}
              </span>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
}

export default MultiCorrectMcq;
