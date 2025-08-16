import React from "react";
import { motion } from "framer-motion";

function SingleCorrectMcq({
  options = [],
  currentQuestion = "",
  selectedOption = null,
  handleOptionChange = () => {},
}) {
  return (
    <div>
      <p className="text-gray-900 text-sm mb-4 font-normal">
        {currentQuestion}
      </p>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {options.map((option) => (
          <motion.label
            key={option}
            role="radio"
            aria-checked={selectedOption === option}
            // whileHover={{ scale: 1.02 }}
            className={`flex items-center rounded border w-full md:w-auto pr-5 h-12 cursor-pointer select-none transition-all duration-200 ${
              selectedOption === option
                ? "border-sky-900 bg-sky-200"
                : "border-sky-300"
            }`}
            onClick={() => handleOptionChange(option)}
          >
            <span className="text-gray-900 text-sm pl-4 whitespace-nowrap">
              {option}
            </span>
          </motion.label>
        ))}
      </div>
    </div>
  );
}

export default SingleCorrectMcq;
