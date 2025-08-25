/* global __firebase_config */
import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// --- Firebase Configuration & Initialization ---
const firebaseConfig =
  typeof __firebase_config !== "undefined" && __firebase_config
    ? JSON.parse(__firebase_config)
    : {};

// let db;
let firebaseInitializationError = null;

// Check for a valid Firebase configuration to prevent runtime errors.
if (!firebaseConfig.apiKey) {
  firebaseInitializationError =
    "Firebase configuration is missing or invalid. Please ensure the API key is provided correctly.";
  console.error("❌ Firebase config missing:", firebaseConfig);
} else {
  try {
    // Initialize Firebase and Firestore.
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    firebaseInitializationError = `Firebase initialization failed: ${error.message}`;
  }
}

// --- SVG Icon Components ---
// These are simple, stateless components for rendering icons.

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

// --- UI Components ---

/**
 * Header component displaying navigation categories.
 */
const Header = ({ categories, selectedCategory, onSelectCategory }) => (
  <header className="bg-white shadow-md absolute top-0 left-0 right-0 z-30 h-14 flex items-center">
    <nav className="container mx-auto flex items-center justify-start px-2 overflow-x-auto">
      <button
        onClick={() => onSelectCategory("All")}
        className="p-2 text-blue-600 hover:bg-gray-100 rounded-md"
        aria-label="Home"
      >
        <HomeIcon />
      </button>
      <div className="flex items-center space-x-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1.5 text-sm font-bold rounded-full transition-colors duration-200 ${
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

/**
 * YouTubePlayer component for embedding videos.
 */
const YouTubePlayer = ({ videoId }) => (
  <div className="w-full h-full bg-black">
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&loop=1&playlist=${videoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
      title="YouTube player"
    />
  </div>
);

/**
 * NewsShort component displaying a single article.
 * This is the component that was fixed.
 */
const NewsShort = ({ article, isActive }) => {
  if (!article) return null;
  return (
    <div
      className={`absolute inset-0 w-full h-full bg-white transition-transform duration-500 flex flex-col ${
        isActive ? "translate-y-0 z-10" : "translate-y-full z-0"
      }`}
    >
      {/* FIX: Add a transparent overlay.
        This div sits on top of all content (including the iframe) to reliably 
        capture touch events for swiping, preventing the iframe from swallowing them.
      */}
      <div className="absolute inset-0 z-20"></div>

      {/* The visible content is now a sibling to the overlay */}
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
              e.target.src = "https://placehold.co/800x600/ccc/ffffff?text=Image+Error";
            }}
          />
        )}
      </div>
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <img src="https://www.eenadu.net/images/logo.png" alt="Eenadu" className="h-6 mr-2" />
          <div className="flex items-center space-x-4 text-gray-500">
            <BookmarkIcon />
            <ShareIcon />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900">{article.headline}</h2>
        <p className="text-base text-gray-700 flex-grow overflow-y-auto">{article.body}</p>
        <p className="text-xs text-gray-400 mt-2">
          {article.date
            ? new Date(article.date).toLocaleDateString("te-IN", {
                month: "long",
                day: "numeric",
              })
            : "తేదీ లేదు"}{" "}
          / {article.author?.name || "Unknown"}
        </p>
      </div>
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        // FIX: Add z-index to ensure the link is clickable "through" the overlay.
        className="bg-gray-100 text-center p-4 text-sm font-bold text-blue-600 relative z-30"
      >
        పూర్తి వార్త కోసం ఇక్కడ నొక్కండి
      </a>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  // Effect to load the Telugu font.
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const categories = ["ఆంధ్రప్రదేశ్", "తెలంగాణ", "జాతీయం", "సినిమా", "క్రీడలు", "Cinema"];
  const [selectedCategory, setSelectedCategory] = useState("Cinema");

  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const mainRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Effect for fetching articles from Firestore.
  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError(firebaseInitializationError);
      console.error("❌ Firestore not initialized:", firebaseInitializationError);
      return;
    }

    try {
      const articlesCollection = collection(db, "articles");
      const q = query(articlesCollection); 

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const articles = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNewsItems(articles);
          setLoading(false);
        },
        (err) => {
          console.error("❌ Snapshot error:", err);
          setError("Could not load articles: " + err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("❌ Firestore query error:", err);
      setError("Could not fetch articles: " + err.message);
      setLoading(false);
    }
  }, []);

  // Filter news based on the selected category.
  const filteredNews =
    selectedCategory === "All"
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  // Effect to reset the index when the category changes.
  useEffect(() => {
    const firstVideoIndex = filteredNews.findIndex((item) => item.videoId);
    setCurrentIndex(firstVideoIndex >= 0 ? firstVideoIndex : 0);
  }, [selectedCategory, newsItems, filteredNews]);

  // Effect for handling touch swipe logic.
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleTouchStart = (e) => {
      // FIX: Removed the check for `e.target.tagName === "IFRAME"`
      // The overlay now handles event capturing, so this is no longer needed.
      touchStartY.current = e.targetTouches[0].clientY;
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      touchEndY.current = e.targetTouches[0].clientY;
    };
    const handleTouchEnd = () => {
      if (touchStartY.current === 0) return;
      const swipeThreshold = 75; // Minimum pixels to be considered a swipe
      const deltaY = touchStartY.current - touchEndY.current;

      if (deltaY > swipeThreshold) { // Swiped Up
        setCurrentIndex((prev) => (prev + 1) % filteredNews.length);
      } else if (deltaY < -swipeThreshold) { // Swiped Down
        setCurrentIndex(
          (prev) => (prev - 1 + filteredNews.length) % filteredNews.length
        );
      }
      // Reset touch coordinates
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
  }, [filteredNews]);

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-10 text-gray-600">వార్తలు లోడ్ అవుతున్నాయి...</div>;
    }
    if (error) {
      return <div className="text-red-600 text-center p-10 bg-red-50 rounded-lg">{error}</div>;
    }
    if (filteredNews.length > 0) {
      return filteredNews.map((article, index) => (
        <NewsShort key={article.id} article={article} isActive={index === currentIndex} />
      ));
    }
    return <div className="text-center p-10 text-gray-500">ఈ వర్గంలో కథనాలు లేవు.</div>;
  };

  return (
    <div className="bg-gray-200 h-screen w-screen overflow-hidden relative font-[Noto Sans Telugu]">
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main ref={mainRef} className="h-full w-full relative pt-14">
        {renderContent()}
      </main>
    </div>
  );
}
