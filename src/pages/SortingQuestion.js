import React, { useState, useEffect, useRef } from "react";
import Sortable from "sortablejs";

const SortingQuestion = ({ question, items, orderType, onAnswer }) => {
  const containerRef = useRef(null);
  const [currentItems, setCurrentItems] = useState(items || []);

  // Init SortableJS
  useEffect(() => {
    if (!containerRef.current) return;

    const sortable = new Sortable(containerRef.current, {
      animation: 150,
      onEnd: function (evt) {
        const newItems = [...currentItems];
        const [movedItem] = newItems.splice(evt.oldIndex, 1);
        newItems.splice(evt.newIndex, 0, movedItem);
        setCurrentItems(newItems);
      },
    });

    return () => sortable.destroy();
  }, [currentItems]);

  // 🔍 Check if user order is correct → notify QuizPage
  const validateAnswer = () => {
    const values = currentItems.map((item) => item.value);
    const sorted =
      orderType === "asc"
        ? [...values].sort((a, b) => a - b)
        : [...values].sort((a, b) => b - a);

    const isCorrect = JSON.stringify(values) === JSON.stringify(sorted);
    onAnswer(isCorrect); // send result back to QuizPage
  };

  return (
    <div className="w-full text-center">
      {/* <h2 className="text-xl sm:text-2xl font-semibold mb-3">🔢 {question}</h2> */}

      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px]"
      >
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-blue-500 text-white rounded-md px-3 py-2 text-sm sm:text-base font-bold cursor-grab select-none min-w-[40px] text-center"
          >
            {item.value}
          </div>
        ))}
      </div>

      {/* Hidden: QuizPage triggers validation when user presses "Next" */}
      <button
        onClick={validateAnswer}
        className="hidden"
        id="sorting-submit-btn"
      />
    </div>
  );
};

export default SortingQuestion;
