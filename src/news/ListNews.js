import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Components ---

// A simple loading spinner component for user feedback
const Spinner = () => (
    <div className="flex justify-center items-center my-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
);

// A component to display error messages
const ErrorDisplay = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{message}</p>
    </div>
);

// --- Main App Component ---

export default function ListNews() {
    // --- State Management ---
    const [prompt, setPrompt] = useState('');
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Data Fetching ---

    // Function to fetch articles from the server
    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('https://newsai-8a45.onrender.com/api/articles?limit=20');
            if (!response.ok) {
                throw new Error(`Failed to fetch articles: ${response.status}`);
            }
            const data = await response.json();
            setArticles(data.articles);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // useEffect hook to fetch articles when the component first loads
    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    // --- Event Handlers ---

    // Function to handle the submission of the new article form
    const handleGenerateSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate an article.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://newsai-8a45.onrender.com/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            // After successfully creating an article, clear the prompt
            setPrompt('');
            // And refresh the list of articles to show the new one at the top
            fetchArticles();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- JSX Rendering ---

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">AI News Dashboard</h1>
                    <p className="mt-2 text-gray-600">Generate, save, and view news articles.</p>
                </header>

                {/* Section 1: Article Generation Form */}
                <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Article</h2>
                    <form onSubmit={handleGenerateSubmit}>
                        <label htmlFor="prompt-input" className="block text-md font-medium text-gray-700 mb-2">
                            Enter your prompt
                        </label>
                        <p>దయచేసి ఈ తెలుగు కంటెంట్‌ని 20 పదాలలో తిరిగి వ్రాయండి:</p>
                        <textarea
                            id="prompt-input"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'దయచేసి ఈ తెలుగు కంటెంట్‌ని 20 పదాలలో తిరిగి వ్రాయండి: [your content here]'"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="4"
                            disabled={isLoading}
                        />
                        <div className="text-right mt-4">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Generating...' : 'Generate & Save'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Section 2: Displaying Articles */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Latest Articles</h2>
                        <button
                            onClick={fetchArticles}
                            className="text-indigo-600 font-semibold hover:text-indigo-800 disabled:text-gray-400"
                            disabled={isLoading}
                        >
                            Refresh
                        </button>
                    </div>

                    {/* Display loading, error, or article content */}
                    {isLoading && <Spinner />}
                    {error && <ErrorDisplay message={error} />}
                    {!isLoading && !error && (
                        <div className="space-y-4">
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <div key={article._id} className="bg-white p-6 rounded-xl shadow-md">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                                        <p className="text-gray-700 leading-relaxed">{article.body}</p>
                                        <p className="text-sm text-gray-500 mt-4">
                                            Published: {new Date(article.publishedAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No articles found. Try generating one!</p>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
