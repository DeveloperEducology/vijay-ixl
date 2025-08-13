import React from "react";
import { useParams } from "react-router-dom";

function QuizPage() {
  const { subject, lessonName, skillName } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>
      <p>
        <strong>Subject:</strong> {decodeURIComponent(subject)}
      </p>
      <p>
        <strong>Lesson:</strong> {decodeURIComponent(lessonName)}
      </p>
      <p>
        <strong>skill:</strong> {decodeURIComponent(skillName)}
      </p>
    </div>
  );
}

export default QuizPage;
