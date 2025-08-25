import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

// --- Global variables (if needed) ---
const initialAuthToken =
  typeof __initial_auth_token !== "undefined"
    ? __initial_auth_token
    : undefined;

export default function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    headline: "",
    body: "",
    imageUrl: "",
    videoId: "",
    authorName: "",
    authorImageUrl: "",
    date: "",
    sourceUrl: "",
  });

  // --- Authentication effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Error signing in:", error);
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // --- Firestore listener (GET) ---
  useEffect(() => {
    if (isAuthReady) {
      const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const articles = [];
          querySnapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() });
          });
          setNewsData(articles);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching articles:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [isAuthReady]);

  // --- Form handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "articles"), {
        category: formData.category,
        headline: formData.headline,
        body: formData.body,
        imageUrl: formData.imageUrl,
        videoId: formData.videoId || null,
        author: {
          name: formData.authorName,
          imageUrl: formData.authorImageUrl,
        },
        date: formData.date,
        sourceUrl: formData.sourceUrl,
        createdAt: serverTimestamp(),
        submitterId: userId,
      });

      // reset form
      setFormData({
        category: "",
        headline: "",
        body: "",
        imageUrl: "",
        videoId: "",
        authorName: "",
        authorImageUrl: "",
        date: "",
        sourceUrl: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-700">
          News Feed (React + Firebase)
        </h1>
        <p className="text-center text-xs text-gray-500 mb-4">
          Your User ID: {userId || "Initializing..."}
        </p>

        {/* --- Add Article Form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg space-y-6 mb-8"
        >
          <h2 className="text-2xl font-semibold border-b pb-3 mb-4">
            Add a New Article
          </h2>

          {/* Category + Headline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="సినిమా">సినిమా</option>
                <option value="జాతీయం">జాతీయం</option>
                <option value="క్రీడలు">క్రీడలు</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="World">World</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the article headline"
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body
            </label>
            <textarea
              name="body"
              rows="4"
              value={formData.body}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the full article body"
            ></textarea>
          </div>

          {/* Image + Video */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video ID
              </label>
              <input
                type="text"
                name="videoId"
                value={formData.videoId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., y1-w1kUGuz8"
              />
            </div>
          </div>

          {/* Author */}
          <h3 className="text-xl font-semibold border-b pb-2 pt-4">
            Author Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Image URL
              </label>
              <input
                type="url"
                name="authorImageUrl"
                value={formData.authorImageUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/author.jpg"
              />
            </div>
          </div>

          {/* Additional */}
          <h3 className="text-xl font-semibold border-b pb-2 pt-4">
            Additional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source URL
              </label>
              <input
                type="url"
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/source"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 disabled:bg-gray-400"
              disabled={!isAuthReady}
            >
              {isAuthReady ? "Add Article" : "Connecting..."}
            </button>
          </div>
        </form>

        {/* --- Articles Feed --- */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-700">
            Live Articles Feed
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading articles...</p>
          ) : newsData.length === 0 ? (
            <p className="text-center text-gray-500">
              No articles added yet. Be the first!
            </p>
          ) : (
            newsData.map((article) => (
              <div
                key={article.id}
                className="bg-white p-6 rounded-lg shadow-md hover:-translate-y-1 transition-transform"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                  <img
                    src={article.imageUrl}
                    alt={article.headline}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/150x100/e2e8f0/4a5568?text=No+Image";
                    }}
                    className="w-full sm:w-32 sm:h-24 object-cover rounded-md"
                  />
                  <div className="mt-3 sm:mt-0">
                    <span className="text-sm font-semibold text-blue-600">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold mt-1">
                      {article.headline}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {article.body}
                    </p>

                    {article.videoId && (
                      <div className="mt-3">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${article.videoId}`}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    )}

                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <img
                        src={article.author?.imageUrl}
                        alt={article.author?.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/40x40/fecdd3/881337?text=A";
                        }}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span>
                        {article.author?.name || "Unknown"} •{" "}
                        {article.date
                          ? new Date(article.date).toLocaleDateString("en-US")
                          : "No date"}
                      </span>
                    </div>

                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-2 inline-block"
                      >
                        Read Full Story →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
