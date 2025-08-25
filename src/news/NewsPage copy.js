import React, { useState, useEffect, useRef } from "react";
import { sampleNewsData } from "./Data"; // Adjust the import path as necessary
// --- SVG Icons ---
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

// --- Components ---

const Header = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <header className="bg-white text-gray-800 shadow-md absolute top-0 left-0 right-0 z-30 h-14 flex items-center">
      <nav className="container mx-auto flex items-center justify-start px-2 overflow-x-auto">
        <button
          onClick={() => onSelectCategory("All")}
          className="p-2 text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Home"
        >
          <HomeIcon />
        </button>
        <div className="flex items-center space-x-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-3 py-1.5 text-sm font-bold whitespace-nowrap rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

const YouTubePlayer = ({ videoId }) => {
  // Re-enabled autoplay and mute. Users can unmute via controls.
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
        className="w-full h-full"
      />
    </div>
  );
};

const NewsShort = ({ article, isActive }) => {
  if (!article) return null;

  return (
    <div
      className={`absolute inset-0 w-full h-full bg-white transition-transform duration-500 ease-in-out flex flex-col ${
        isActive ? "translate-y-0 z-10" : "translate-y-full z-0"
      }`}
    >
      {/* Media Container */}
      <div className="relative h-2/5 w-full">
        {article.videoId ? (
          <YouTubePlayer videoId={article.videoId} />
        ) : (
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/800x600/ccc/ffffff?text=Image+Error";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Content Container */}
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <img
              src="https://www.eenadu.net/images/logo.png"
              alt="Eenadu"
              className="h-6 mr-2"
            />
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <BookmarkIcon />
            <ShareIcon />
          </div>
        </div>
        <h2
          className="text-xl font-bold mb-2 leading-tight text-gray-900"
          style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
        >
          {article.headline}
        </h2>
        <p
          className="text-base leading-relaxed text-gray-700 flex-grow"
          style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
        >
          {article.body}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(article.date).toLocaleDateString("te-IN", {
            month: "long",
            day: "numeric",
          })}{" "}
          / {article.author.name}
        </p>
      </div>

      {/* Read More Link */}
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-100 text-center p-4 text-sm font-bold text-blue-600 hover:bg-gray-200 transition-colors"
      >
        పూర్తి వార్త కోసం ఇక్కడ నొక్కండి
      </a>
    </div>
  );
};

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const categories = ["ఆంధ్రప్రదేశ్", "తెలంగాణ", "జాతీయం", "సినిమా", "క్రీడలు"];
  const [selectedCategory, setSelectedCategory] = useState("సినిమా"); // Start with Cinema to show the video
  const [newsItems, setNewsItems] = useState(sampleNewsData);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const filteredNews =
    selectedCategory === "All"
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    // Find the first video in the selected category and set it as the current index
    const firstVideoIndex = filteredNews.findIndex((item) => item.videoId);
    setCurrentIndex(firstVideoIndex >= 0 ? firstVideoIndex : 0);
  }, [selectedCategory]);

  // Effect to handle touch events and prevent pull-to-refresh
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleTouchStart = (e) => {
      // Only capture the initial touch on the main container, not on the YouTube iframe
      if (e.target.tagName === "IFRAME") return;
      touchStartY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // Prevent the browser's default pull-to-refresh action
      e.preventDefault();
      touchEndY.current = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartY.current === 0) return; // Ignore if touch started on iframe

      const deltaY = touchStartY.current - touchEndY.current;

      if (deltaY > 75) {
        // Swiped up
        setCurrentIndex((prev) => (prev + 1) % filteredNews.length);
      } else if (deltaY < -75) {
        // Swiped down
        setCurrentIndex(
          (prev) => (prev - 1 + filteredNews.length) % filteredNews.length
        );
      }
      // Reset coordinates
      touchStartY.current = 0;
      touchEndY.current = 0;
    };

    mainEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    mainEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    mainEl.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      mainEl.removeEventListener("touchstart", handleTouchStart);
      mainEl.removeEventListener("touchmove", handleTouchMove);
      mainEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [filteredNews]); // Rerun when the list of news changes

  return (
    <div className="bg-gray-200 h-screen w-screen overflow-hidden relative">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main ref={mainRef} className="h-full w-full relative pt-14">
        {filteredNews.length > 0 ? (
          filteredNews.map((article, index) => (
            <NewsShort
              key={article.id}
              article={article}
              isActive={index === currentIndex}
            />
          ))
        ) : (
          <div className="text-gray-800 text-center p-10 bg-white m-auto flex flex-col items-center justify-center h-full">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
            >
              ఈ వర్గంలో కథనాలు లేవు.
            </h2>
            <p
              className="mt-2"
              style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
            >
              దయచేసి మరొక వర్గాన్ని ఎంచుకోండి.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
