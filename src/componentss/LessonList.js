import React, { useState } from "react";
import { class2LessonData } from "./LessonData_class2";
import { useNavigate } from "react-router-dom";


const LessonList = () => {
      const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Classes");
  const [topics, setTopics] = useState(class2LessonData);

  // Auto-generate codes (A, B, C...) for each category
  const topicsWithCodes = topics.map((topic, catIndex) => ({
    ...topic,
    code: String.fromCharCode(65 + catIndex), // A=0, B=1...
  }));

  // Split into 3 columns
  const column1 = topicsWithCodes.slice(0, 6);
  const column2 = topicsWithCodes.slice(6, 12);
  const column3 = topicsWithCodes.slice(12);


  const renderColumn = (column) =>
    column.map((topic) => (
      <div key={topic.code}>
        <h2 className="text-[13px] font-bold mb-1 text-[#8a8a8a] mt-5 first:mt-0">
          {topic.category}
        </h2>
        <ul className="list-none space-y-0.5">
          {topic.items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(`/quiz/${item.id}`)}
                className="text-left hover:underline cursor-pointer w-full"
              >
                <span className="font-semibold" style={{ color: topic.color }}>
                  {topic.code}.{item.id.split("-").pop()}
                </span>{" "}
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    ));
    
  return (
    <div className="max-w-[900px] mx-auto p-4 bg-white font-sans text-[13px] leading-tight text-[#333]">
      {/* Top tabs */}
      <div className="flex border-b border-[#00a1e0] overflow-x-auto scrollbar-hide">
        {["Classes", "Topics"].map((tab) => (
          <button
            key={tab}
            className={`text-[11px] font-semibold px-3 py-1 whitespace-nowrap ${
              activeTab === tab
                ? "text-[#00a1e0] border-b-2 border-[#00a1e0]"
                : "text-[#00a1e0] bg-[#00a1e0]/10"
            }`}
            type="button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title */}
      <h1 className="mt-3 mb-1 text-[22px] font-bold text-[#e94e1b] leading-tight">
        Class II maths
      </h1>

      {/* Description */}
      <p className="mb-4 text-[11px] leading-snug text-[#333] max-w-[700px]">
        Here is a list of all of the maths skills students learn in class II!
        These skills are organised into categories, and you can move your mouse
        over any skill name to preview the skill. To start practising, just
        click on any link. IXL will track your score, and the questions will
        automatically increase in difficulty as you improve!
      </p>

      {/* 3 columns */}
      <div className="flex flex-wrap -mx-2 text-[11px] leading-snug text-[#333]">
        <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-6">
          {renderColumn(column1)}
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-6">
          {renderColumn(column2)}
        </div>
        <div className="w-full md:w-1/3 px-2 mb-6">{renderColumn(column3)}</div>
      </div>
    </div>
  );
};

export default LessonList;
