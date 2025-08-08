import React from "react";
import "./MathTopicsList.css";
import { useNavigate } from "react-router-dom";
import { class2_maths_topicList } from "../data/Class2_maths";

const MathTopicsList = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topicId) => {
    navigate(`/kid/${encodeURIComponent(topicId)}`);
  };

  // Group by category
  const groupedTopics = class2_maths_topicList.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return (
    <div className="container">
      <h1 className="title">🎓 Math Playground</h1>
      <p className="subtitle">Choose a topic to begin learning!</p>

      {Object.entries(groupedTopics).map(([category, topics]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <ul className="topic-list">
            {topics.map((topic) => (
              <li
                key={topic.id}
                className="topic-item"
                onClick={() => handleTopicClick(topic.name)}
              >
                <span className="topic-code">{topic.name}</span>{" "}
                {/* <span className="grade-tag">Grade {topic.grade}</span> */}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <h2 className="category-title">Other Topics</h2>
        <p
          //   key={topic.id}
          className="topic-item"
          onClick={() => navigate(`/sorting`)}
        >
          <span className="topic-code">Sorting</span>{" "}
          {/* <span className="grade-tag">Grade {topic.grade}</span> */}
        </p>
        <p
          //   key={topic.id}
          className="topic-item"
          onClick={() => navigate(`/bucket`)}
        >
          <span className="topic-code">Bucket Sorting</span>{" "}
          {/* <span className="grade-tag">Grade {topic.grade}</span> */}
        </p>
      </div>
    </div>
  );
};

export default MathTopicsList;
