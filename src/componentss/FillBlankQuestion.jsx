// src/components/Quiz/FillBlankQuestion.jsx
import React from 'react';

export default function FillBlankQuestion({ data, onAnswer, selectedAnswer }) {
  return (
    <div>
      <h2>{data.questionText}</h2>
      <div style={{ marginTop: '10px' }}>
        {data.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(opt)}
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: selectedAnswer === opt ? 'lightblue' : '#eee',
              borderRadius: '6px',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
