import React from "react";
import { FiVolume, FiVolume2 } from "react-icons/fi";

function TestUI() {
  return (
    <div>
      <div className="max-w-4xl mx-auto p-5">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="text-white bg-[#00a1e0] rounded-full p-2">
            <i className="fas fa-lightbulb fa-lg"></i>
          </div>
          <a
            className="text-[#00a1e0] font-semibold text-lg leading-6 hover:underline"
            href="#"
          >
            Learn with an example
          </a>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="text-[#00a1e0] text-xl">
            <FiVolume2 />
          </div>
          <p className="text-black text-lg leading-6">
            Count the cinnamon rolls by 10s.
          </p>
        </div>
        <div className="flex flex-wrap justify-start gap-x-12 gap-y-8 mb-12">
          <img
            alt="Plate with twelve cinnamon rolls arranged in three rows"
            className="w-[150px] h-[150px] object-contain"
            height="150"
            src="https://storage.googleapis.com/a1aa/image/d9c74b00-ea2b-45ab-19b7-5499a2de36d2.jpg"
            width="150"
          />
          <img
            alt="Plate with twelve cinnamon rolls arranged in three rows"
            className="w-[150px] h-[150px] object-contain"
            height="150"
            src="https://storage.googleapis.com/a1aa/image/d9c74b00-ea2b-45ab-19b7-5499a2de36d2.jpg"
            width="150"
          />
          <img
            alt="Plate with twelve cinnamon rolls arranged in three rows"
            className="w-[150px] h-[150px] object-contain"
            height="150"
            src="https://storage.googleapis.com/a1aa/image/d9c74b00-ea2b-45ab-19b7-5499a2de36d2.jpg"
            width="150"
          />
          <img
            alt="Plate with twelve cinnamon rolls arranged in three rows"
            className="w-[150px] h-[150px] object-contain"
            height="150"
            src="https://storage.googleapis.com/a1aa/image/d9c74b00-ea2b-45ab-19b7-5499a2de36d2.jpg"
            width="150"
          />
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="text-[#00a1e0] text-xl">
            <i className="fas fa-volume-up"></i>
          </div>
          <p className="text-black text-lg leading-6">
            How many cinnamon rolls are there?
          </p>
        </div>
        <input
          aria-label="Answer input for number of cinnamon rolls"
          className="border border-blue-400 w-20 h-8 px-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
        />
        <br />
        <button
          className="bg-[#4caf0d] text-white text-lg font-normal rounded-md px-6 py-2 hover:bg-[#3b7a0a] transition-colors"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default TestUI;
