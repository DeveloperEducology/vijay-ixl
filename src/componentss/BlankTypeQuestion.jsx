import React from "react";

function BlankTypeQuestion({
  currentQuestion = "",
  answer = "",
  handleAnswerChange = () => {},
}) {
  return (
    <div>
      <p className="text-gray-900 text-sm mb-4 font-normal">
        {currentQuestion}
      </p>

      <input
        type="text"
        value={answer}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className="border border-sky-300 rounded px-4 py-2 w-full md:w-1/2 text-gray-900 text-sm focus:outline-none focus:border-sky-900 focus:ring-1 focus:ring-sky-900"
      />
    </div>
  );
}

export default BlankTypeQuestion;
