import React, { useState, useRef, useEffect } from "react";

export default function ExamUI() {
  // Sample data for the exam
  const examData = {
    sections: [
      {
        name: "General Intelligence",
        questions: [
          {
            id: 1,
            text: "In the following question, out of the four alternatives, select the alternative which will improve the underlined part of the sentence. In case no improvement is needed, select 'no improvement'.",
            statement: "Kareena Ma'am <u>was the best coach of</u> cricket and students used to loved her so much.",
            options: [
              "Was a better coach of",
              "Was a good coach of all",
              "Was better than coach of",
              "No improvement"
            ],
            correctAnswer: 0,
            status: "answered",
            explanation: "The correct improvement is 'Was a better coach of' as it's more grammatically correct in this context."
          },
          {
            id: 2,
            text: "Select the most appropriate meaning of the given idiom: 'Bite the bullet'",
            statement: "",
            options: [
              "To endure a painful experience",
              "To eat something hard",
              "To show bravery in battle",
              "To make a difficult decision"
            ],
            correctAnswer: 0,
            status: "not-answered",
            explanation: "'Bite the bullet' means to endure a painful or otherwise unpleasant situation that is seen as unavoidable."
          },
          {
            id: 3,
            text: "Choose the word that is opposite in meaning to the given word: 'Ephemeral'",
            statement: "",
            options: [
              "Permanent",
              "Temporary",
              "Fleeting",
              "Momentary"
            ],
            correctAnswer: 0,
            status: "not-visited",
            explanation: "The opposite of 'ephemeral' (lasting for a very short time) is 'permanent'."
          }
        ]
      },
      {
        name: "Quantitative Aptitude",
        questions: [
          {
            id: 4,
            text: "If 2x + 5 = 15, what is the value of x?",
            statement: "",
            options: ["5", "10", "7.5", "2.5"],
            correctAnswer: 0,
            status: "not-visited",
            explanation: "Solving the equation: 2x = 15 - 5 => 2x = 10 => x = 5"
          },
          {
            id: 5,
            text: "What is 25% of 200?",
            statement: "",
            options: ["25", "50", "75", "100"],
            correctAnswer: 1,
            status: "not-visited",
            explanation: "25% of 200 = 0.25 × 200 = 50"
          },
          {
            id: 6,
            text: "If a triangle has angles of 30° and 50°, what is the third angle?",
            statement: "",
            options: ["80°", "90°", "100°", "110°"],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "Sum of angles in a triangle is 180°. So, 180° - 30° - 50° = 100°"
          },
          {
            id: 7,
            text: "Solve for y: 3y - 7 = 14",
            statement: "",
            options: ["y = 3", "y = 5", "y = 7", "y = 9"],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "3y = 14 + 7 => 3y = 21 => y = 7"
          },
          {
            id: 8,
            text: "What is the square root of 144?",
            statement: "",
            options: ["11", "12", "13", "14"],
            correctAnswer: 1,
            status: "not-visited",
            explanation: "12 × 12 = 144"
          }
        ]
      },
      {
        name: "English Comprehension",
        questions: [
          {
            id: 9,
            text: "Identify the correct passive form of: 'The cat chased the mouse.'",
            statement: "",
            options: [
              "The mouse was chased by the cat.",
              "The mouse is chased by the cat.",
              "The mouse has been chased by the cat.",
              "The mouse had been chased by the cat."
            ],
            correctAnswer: 0,
            status: "not-visited",
            explanation: "The correct passive form in simple past tense is 'The mouse was chased by the cat.'"
          },
          {
            id: 10,
            text: "Which of these is a preposition?",
            statement: "",
            options: ["Run", "Beautiful", "Under", "Quickly"],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "'Under' is a preposition indicating position."
          },
          {
            id: 11,
            text: "Choose the correct spelling:",
            statement: "",
            options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "'Accommodate' has double 'm' and double 'c'."
          },
          {
            id: 12,
            text: "Select the synonym for 'Benevolent'",
            statement: "",
            options: ["Kind", "Angry", "Selfish", "Stingy"],
            correctAnswer: 0,
            status: "not-visited",
            explanation: "'Benevolent' means well-meaning and kindly, so the synonym is 'Kind'."
          },
          {
            id: 13,
            text: "Identify the grammatically correct sentence:",
            statement: "",
            options: [
              "She don't like apples.",
              "She doesn't likes apples.",
              "She doesn't like apples.",
              "She didn't likes apples."
            ],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "The correct present tense negative form is 'She doesn't like apples.'"
          }
        ]
      },
      {
        name: "General Knowledge",
        questions: [
          {
            id: 14,
            text: "Which country is known as the 'Land of the Rising Sun'?",
            statement: "",
            options: ["China", "Japan", "South Korea", "Thailand"],
            correctAnswer: 1,
            status: "not-visited",
            explanation: "Japan is known as the 'Land of the Rising Sun'."
          },
          {
            id: 15,
            text: "Who painted the Mona Lisa?",
            statement: "",
            options: [
              "Vincent van Gogh",
              "Pablo Picasso",
              "Leonardo da Vinci",
              "Michelangelo"
            ],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "The Mona Lisa was painted by Leonardo da Vinci."
          },
          {
            id: 16,
            text: "What is the capital of Australia?",
            statement: "",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correctAnswer: 2,
            status: "not-visited",
            explanation: "Canberra is the capital of Australia."
          }
        ]
      }
    ]
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour in seconds
  const [questionTime, setQuestionTime] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const questionRefs = useRef([]);
  const sidebarRef = useRef(null);

  // Flatten all questions for easier navigation
  const allQuestions = examData.sections.flatMap(section => section.questions);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setQuestionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs} : ${mins} : ${secs}`;
  };

  // Format question time as MM:SS
  const formatQuestionTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins} : ${secs}`;
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    // Update question status
    allQuestions[currentQuestionIndex].status = "answered";
    setShowExplanation(true);
  };

  // Handle navigation to next question
  const handleNextQuestion = () => {
    // Save the answer if selected
    if (selectedOption !== null) {
      allQuestions[currentQuestionIndex].status = "answered";
    }
    
    // Move to next question
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setQuestionTime(0);
      setShowExplanation(false);
      
      // Scroll the next question into view on mobile
      if (sidebarOpen && questionRefs.current[currentQuestionIndex + 1]) {
        questionRefs.current[currentQuestionIndex + 1].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  // Handle question selection from sidebar
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
    setQuestionTime(0);
    setShowExplanation(false);
    setSidebarOpen(false);
  };

  // Handle mark for review
  const handleMarkForReview = () => {
    allQuestions[currentQuestionIndex].status = "marked";
    handleNextQuestion();
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedOption(null);
    allQuestions[currentQuestionIndex].status = "not-answered";
    setShowExplanation(false);
  };

  // Get current question
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Determine if the selected answer is correct
  const isCorrect = selectedOption !== null && selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-700 text-white">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="bg-pink-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
            DG
          </div>

          {/* Pause & Time */}
          <button className="bg-blue-500 px-2 py-1 rounded flex items-center space-x-1 text-sm">
            <span>⏸</span>
            <span>{formatTime(timeLeft)}</span>
          </button>

          {/* Qn Time */}
          <div className="bg-blue-500 px-2 py-1 rounded text-sm">
            Qn. Time : {formatQuestionTime(questionTime)}
          </div>

          {/* Scores */}
          <div className="text-green-300 text-sm">+2.00</div>
          <div className="text-red-300 text-sm">-0.50</div>
        </div>

        {/* Menu Button (mobile only) */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          {/* Menu icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Question Section */}
        <main className="flex-1 overflow-auto p-4 flex justify-center">
          <div className="w-full max-w-2xl border rounded p-4 shadow bg-white">
            {/* Question Number and Navigation */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">
                Question {currentQuestion.id}
              </div>
              <div className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {allQuestions.length}
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base font-bold mb-4 leading-relaxed">
              {currentQuestion.text}
            </div>

            {/* Question Statement */}
            {currentQuestion.statement && (
              <p 
                className="mb-4 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentQuestion.statement }}
              />
            )}

            {/* Options */}
            <div className="space-y-2 text-sm mb-4">
              {currentQuestion.options.map((option, index) => {
                let optionClass = "";
                if (selectedOption === index) {
                  optionClass = isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
                }
                return (
                  <label 
                    key={index} 
                    className={`flex items-center space-x-2 p-2 border rounded ${optionClass}`}
                  >
                    <input 
                      type="radio" 
                      name="option" 
                      checked={selectedOption === index}
                      onChange={() => handleOptionSelect(index)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span>{option}</span>
                    {selectedOption === index && isCorrect && (
                      <span className="ml-auto text-green-600">✓ Correct</span>
                    )}
                    {selectedOption === index && !isCorrect && (
                      <span className="ml-auto text-red-600">✗ Incorrect</span>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && currentQuestion.explanation && (
              <div className="bg-blue-50 p-3 rounded mb-4 text-sm">
                <div className="font-semibold text-blue-800">Explanation:</div>
                <div>{currentQuestion.explanation}</div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button 
                className="bg-blue-200 hover:bg-blue-300 px-4 py-1 rounded text-sm font-medium transition-colors"
                onClick={handleMarkForReview}
              >
                Mark & next
              </button>
              <button 
                className="bg-blue-200 hover:bg-blue-300 px-4 py-1 rounded text-sm font-medium transition-colors"
                onClick={handleClearSelection}
              >
                Clear
              </button>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
                onClick={handleNextQuestion}
              >
                Save & Next
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar Backdrop (mobile only) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-72 bg-[#d9ecff] border-l border-gray-300 shadow-lg transform transition-transform duration-300 z-50
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
            md:static md:translate-x-0 md:flex-shrink-0`}
        >
          <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-300 bg-[#d9ecff]">
            <img
              alt="User avatar"
              className="w-10 h-10 rounded-full"
              loading="lazy"
              src="https://placehold.co/40x40/png?text=User+Avatar"
            />
            <span className="font-semibold text-sm select-text">
              vijaymarka
            </span>
          </div>
          <div className="px-3 py-2 border-b border-gray-300 text-sm text-center">
            <span>Time Left:</span>
            <span className="font-mono font-semibold bg-gray-300 rounded px-2 select-none">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Status legend */}
          <div className="px-3 py-2 border-b border-gray-300 space-y-2 text-xs text-gray-900">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded-tl-md rounded-tr-md shadow-md flex items-center justify-center text-white font-semibold select-none">
                1
              </div>
              <div className="text-[10px] leading-tight">Answered</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-600 rounded-tl-md rounded-tr-md shadow-md flex items-center justify-center text-white font-semibold select-none">
                1
              </div>
              <div className="text-[10px] leading-tight">Not Answered</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded shadow-md flex items-center justify-center text-black font-semibold select-none">
                23
              </div>
              <div className="text-[10px] leading-tight">Not Visited</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-700 rounded shadow-md flex items-center justify-center text-white font-semibold select-none">
                0
              </div>
              <div className="text-[10px] leading-tight">Marked for Review</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded shadow-md flex items-center justify-center text-white font-semibold select-none">
                0
              </div>
              <div className="text-[10px] leading-tight">
                Answered &amp; Marked for Review
              </div>
            </div>
          </div>

          {/* Sections and questions */}
          <div className="flex-1 overflow-auto scrollbar-thin h-[calc(100%-210px)]">
            {examData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section title */}
                <div className="px-3 py-1 font-semibold text-sm border-b border-gray-300 select-none sticky top-0 bg-[#d9ecff] z-10">
                  {section.name}
                </div>

                {/* Question grid */}
                <div className="grid grid-cols-4 gap-2 text-xs p-3">
                  {section.questions.map((question, qIndex) => {
                    // Calculate the global index
                    const globalIndex = examData.sections
                      .slice(0, sectionIndex)
                      .reduce((acc, curr) => acc + curr.questions.length, 0) + qIndex;
                    
                    // Determine button style based on status
                    let buttonClass = "bg-gray-300";
                    if (question.status === "answered") buttonClass = "bg-green-600 text-white";
                    if (question.status === "not-answered") buttonClass = "bg-red-600 text-white";
                    if (question.status === "marked") buttonClass = "bg-purple-700 text-white";
                    
                    return (
                      <button
                        key={question.id}
                        ref={el => questionRefs.current[globalIndex] = el}
                        className={`${buttonClass} rounded-tl-md rounded-tr-md shadow-md py-2 font-semibold select-none ${
                          globalIndex === currentQuestionIndex ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => handleQuestionSelect(globalIndex)}
                      >
                        {question.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}