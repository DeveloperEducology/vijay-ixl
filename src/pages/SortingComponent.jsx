import React, { useEffect, useRef, useState, useCallback } from "react";
// Dynamic import will be used for SortableJS

// --- Helper Components ---

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

// --- Game Configuration ---
const GAME_CONFIG = {
  easy: { count: 5, time: 60 },
  medium: { count: 7, time: 45 },
  hard: { count: 9, time: 30 },
};

const SortingGame = () => {
  // --- State Management ---
  const [gameState, setGameState] = useState("idle"); // 'idle', 'playing', 'feedback', 'gameOver'
  const [difficulty, setDifficulty] = useState("medium");
  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState("asc");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [timer, setTimer] = useState(GAME_CONFIG.medium.time);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [mnemonic, setMnemonic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const containerRef = useRef(null);
  const sortableInstance = useRef(null);

  // --- Utility Functions ---
  const generateRandomNumbers = useCallback((count, min = 1, max = 99) => {
    const numbers = new Set();
    while (numbers.size < count) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(value);
    }
    return Array.from(numbers).map((value, index) => ({
      id: `item-${index + 1}-${Date.now()}`,
      value,
    }));
  }, []);

  // --- Game Logic ---
  const generateQuestion = useCallback(() => {
    const config = GAME_CONFIG[difficulty];
    const newItems = generateRandomNumbers(config.count);
    const newOrderType = Math.random() > 0.5 ? "asc" : "desc";

    setItems(newItems);
    setOrderType(newOrderType);
    setFeedback({ message: "", type: "" });
    setTimer(config.time);
    setGameState("playing");
    setMnemonic(""); // Clear previous mnemonic
  }, [difficulty, generateRandomNumbers]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("sortingGameHighScore") || 0;
    setHighScore(parseInt(savedHighScore, 10));
  }, []);

  const updateHighScore = useCallback((newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem("sortingGameHighScore", newScore);
    }
  }, [highScore]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timer === 0) {
      setGameState("gameOver");
      updateHighScore(score);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [gameState, timer, score, updateHighScore]);

  useEffect(() => {
    if (containerRef.current && items.length > 0) {
      import("https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/modular/sortable.esm.js")
        .then(({ default: Sortable }) => {
          if (containerRef.current) {
            sortableInstance.current = new Sortable(containerRef.current, {
              animation: 200,
              ghostClass: "bg-blue-200/50",
              dragClass: "opacity-100",
              onEnd: (evt) => {
                setItems((currentItems) => {
                  const newItems = [...currentItems];
                  const [movedItem] = newItems.splice(evt.oldIndex, 1);
                  newItems.splice(evt.newIndex, 0, movedItem);
                  return newItems;
                });
              },
            });
          }
        })
        .catch(error => console.error("Failed to load SortableJS module", error));
    }
    return () => {
      if (sortableInstance.current) {
        sortableInstance.current.destroy();
        sortableInstance.current = null;
      }
    };
  }, [items]);

  const checkAnswer = () => {
    if (gameState !== "playing") return;
    const currentValues = items.map((item) => item.value);
    const sortedValues = orderType === "asc"
        ? [...currentValues].sort((a, b) => a - b)
        : [...currentValues].sort((a, b) => b - a);
    const isCorrect = JSON.stringify(currentValues) === JSON.stringify(sortedValues);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback({ message: "Correct!", type: "success" });
    } else {
      setFeedback({ message: "Incorrect!", type: "error" });
    }
    setGameState("feedback");
    setTimeout(() => {
      if (timer > 0) generateQuestion();
    }, 1500);
  };
  
  // --- Gemini API Integration ---
  const handleGetMnemonic = async () => {
    setIsGenerating(true);
    setMnemonic("");
    
    const sortedValues = orderType === "asc"
        ? [...items].map(i => i.value).sort((a, b) => a - b)
        : [...items].map(i => i.value).sort((a, b) => b - a);

    const prompt = `Create a short, fun, one-sentence story or mnemonic to help me remember the numbers ${sortedValues.join(', ')} in that specific order. Make it creative and easy to remember.`;
    
    const apiKey = ""; // API key will be injected by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setMnemonic(text.trim());
      } else {
        setMnemonic("Sorry, couldn't generate a hint right now.");
      }
    } catch (error) {
      console.error("Gemini API call failed:", error);
      setMnemonic("Error generating hint. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };


  const handleStartGame = () => {
    setScore(0);
    generateQuestion();
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setTimer(GAME_CONFIG[newDifficulty].time);
  };

  const getTimerColor = () => {
    const percentage = (timer / GAME_CONFIG[difficulty].time) * 100;
    if (percentage < 25) return "text-red-500";
    if (percentage < 50) return "text-yellow-500";
    return "text-slate-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          Number Sort Challenge
        </h1>
        <p className="text-slate-600 mb-6">Test your speed and accuracy!</p>

        <div className="flex justify-around items-center bg-slate-100 rounded-lg p-3 mb-6 text-lg">
          <div className="flex items-center gap-2"><TimerIcon /><span className={`font-bold ${getTimerColor()}`}>{timer}s</span></div>
          <div className="flex items-center gap-2 text-slate-700"><TrophyIcon /><span className="font-bold">{score} <span className="text-sm font-normal text-slate-500">/ HS: {highScore}</span></span></div>
        </div>

        {gameState === "idle" && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Choose your difficulty:</h2>
            <div className="flex justify-center gap-2 sm:gap-4 mb-6">
              {Object.keys(GAME_CONFIG).map((level) => (
                <button key={level} onClick={() => handleDifficultyChange(level)} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 capitalize w-28 ${difficulty === level ? "bg-indigo-600 text-white shadow-md" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>{level}</button>
              ))}
            </div>
            <button onClick={handleStartGame} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-lg text-xl transition-transform transform hover:scale-105">Start Game</button>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-red-500 mb-2">Time's Up!</h2>
            <p className="text-xl text-slate-700 mb-4">You scored <span className="font-bold">{score}</span> points!</p>
            <button onClick={handleStartGame} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-lg text-xl transition-transform transform hover:scale-105">Play Again</button>
          </div>
        )}

        {(gameState === "playing" || gameState === "feedback") && (
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">Sort in <span className="text-indigo-600 font-bold uppercase">{orderType}</span> order</h2>
            <div ref={containerRef} className="flex flex-wrap justify-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-lg min-h-[80px] mb-4 relative">
              {items.map((item) => (<div key={item.id} className="bg-blue-500 text-white rounded-lg px-4 py-3 text-lg sm:text-xl font-bold cursor-grab select-none w-16 h-16 flex items-center justify-center shadow-md transition-transform transform hover:scale-110">{item.value}</div>))}
              {gameState === 'feedback' && (<div className={`absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center animate-fade-in ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}><span className="text-3xl font-bold">{feedback.message}</span></div>)}
            </div>
            
            {/* Mnemonic Display Area */}
            {mnemonic && (
              <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded-lg mb-4 text-left animate-fade-in">
                <p className="font-bold">✨ Hint:</p>
                <p>{mnemonic}</p>
              </div>
            )}
            {isGenerating && (
                 <div className="bg-purple-100 p-4 rounded-lg mb-4">Generating a hint...</div>
            )}

            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={handleGetMnemonic} disabled={isGenerating || gameState === 'feedback'} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg text-base font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                {isGenerating ? "Thinking..." : "✨ Get a Hint"}
              </button>
              <button onClick={checkAnswer} disabled={gameState === 'feedback'} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-base font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">Check Answer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingGame;
