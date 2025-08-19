import React from "react";
import { FiVolume2 } from "react-icons/fi";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import ReactMarkdown from "react-markdown";

function BlankInputComponent({
  exampleText,
  questionText,
  images,
  onSubmit,
  onChangeAnswer,
  answer,
  onRead,
  promptText = "Enter your answer:", // default prompt
}) {
  // Render the component mx-auto with a max width
  return (
    <div className="max-w-4xl p-2">
      {/* Question text */}
      {/* <div className="flex items-center space-x-2 mb-4">
        <div className="text-[#00a1e0] text-xl">
          <FiVolume2 />
        </div>
        <p className="text-black text-lg leading-6">{questionText}</p>
      </div> */}

      {/* Images */}
      {images?.length > 0 && (
        <div className="flex flex-wrap justify-start gap-x-6 gap-y-6 mb-12">
          {images.map((src, i) => (
            <img
              key={i}
              alt={`Question visual ${i + 1}`}
              className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] object-contain"
              src={src}
              width="150"
              height="150"
            />
          ))}
        </div>
      )}

      {/* Answer input */}
      <div className="flex items-left space-x-2 mb-3">
        <div className="text-[#00a1e0] text-xl">
          <FiVolume2 onClick={onRead} />
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="text-black text-lg leading-6">{children}</p>
            ),
          }}
        >
          {promptText}
        </ReactMarkdown>
      </div>
      <input
        aria-label="Answer input"
        value={answer}
        onChange={onChangeAnswer}
        className="border border-blue-400 w-20 h-8 px-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
      />
      <br />

      {/* Submit button */}
      {/* <button
        onClick={onSubmit}
        className="bg-[#4caf0d] text-white text-lg font-normal rounded-md px-6 py-2 hover:bg-[#3b7a0a] transition-colors"
      >
        Submit
      </button> */}
    </div>
  );
}

export default BlankInputComponent;
