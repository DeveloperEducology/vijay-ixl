import React, { useState } from "react";

export default function CountingQuestion({ data }) {
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExample, setShowExample] = useState(false);

  const handleSubmit = () => {
    setIsCorrect(inputValue === data.answer);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      {/* Learn with example */}
      <div className="flex justify-center items-center space-x-2 mb-6">
        <div className="text-white bg-[#00a1e0] rounded-full p-2">
          <i className="fas fa-lightbulb fa-lg"></i>
        </div>
        <button
          onClick={() => setShowExample((prev) => !prev)}
          className="text-[#00a1e0] font-semibold text-lg leading-6 hover:underline"
        >
          Learn with an example
        </button>
      </div>

      {/* Show example if toggled */}
      {showExample && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <h3 className="font-semibold text-blue-600 mb-2">Example</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
            {data.example.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Question Prompt */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="text-[#00a1e0] text-xl">
          <i className="fas fa-volume-up"></i>
        </div>
        <p className="text-black text-lg leading-6">{data.question}</p>
      </div>

      {/* Visuals */}
      <div className="flex flex-col gap-y-6 mb-12">
        {data.visuals.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-x-4 justify-start">
            {row.map((item) => (
              <img
                key={item.key}
                src="https://cdn-icons-png.flaticon.com/512/616/616408.png" // 🐻 bear icon
                alt="bear"
                {...item.props}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Prompt */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="text-[#00a1e0] text-xl">
          <i className="fas fa-volume-up"></i>
        </div>
        <p className="text-black text-lg leading-6">{data.prompt}</p>
      </div>

      {/* Input */}
      <input
        aria-label="Answer input"
        type="text"
        className="border border-blue-400 w-20 h-8 px-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <br />

      {/* Submit button */}
      <button
        className="bg-[#4caf0d] text-white text-lg font-normal rounded-md px-6 py-2 hover:bg-[#3b7a0a] transition-colors"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {/* Feedback */}
      {isCorrect !== null && (
        <div className="mt-4">
          <p
            className={`text-lg font-semibold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "✅ Correct!" : "❌ Try again!"}
          </p>

          {/* Show explanation only if correct */}
          {isCorrect && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4 rounded-md">
              <h3 className="font-semibold text-green-700 mb-2">Explanation</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                {data.explanation.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
