import React, { useState, useEffect } from 'react';

// Main App component
export default function ArticlesTable() {
  // State to store the list of articles for the current page
  const [articles, setArticles] = useState([]);
  // State to manage the loading status
  const [loading, setLoading] = useState(true);
  // State to store any potential errors during data fetching
  const [error, setError] = useState(null);
  // State for pagination: current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State for pagination: total number of pages available from the API
  const [totalPages, setTotalPages] = useState(0);
  // State for pagination: total number of articles available
  const [totalArticles, setTotalArticles] = useState(0);

  // useEffect hook to fetch data when the component mounts or when currentPage changes
  useEffect(() => {
    // Asynchronous function to fetch articles for a specific page
    const fetchArticles = async (page) => {
      setLoading(true); // Show loader while fetching new page
      setError(null); // Clear previous errors
      try {
        // Fetch data from the provided API endpoint with the page query parameter
        const response = await fetch(`https://newsai-8a45.onrender.com/api/articles?page=${page}`);
        
        // Check if the network response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Update state with the fetched data
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setTotalArticles(data.totalArticles);
        setCurrentPage(data.currentPage);

      } catch (e) {
        // If an error occurs, store the error message in state
        setError(e.message);
        console.error("Failed to fetch articles:", e);
      } finally {
        // Set loading to false once the fetch is complete
        setLoading(false);
      }
    };

    fetchArticles(currentPage);
  }, [currentPage]); // Dependency array includes currentPage to refetch on page change

  // Helper function to format the date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handlers for pagination buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-tight">
            Latest News Articles
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            A real-time feed of articles from the news API.
          </p>
        </header>

        {/* Conditional rendering for loading and error states */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        ) : (
          <>
            {/* Main content: The articles table */}
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-2xl">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Published At</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {articles.map((article) => (
                    <tr key={article._id} className="hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-normal">
                         <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-cyan-400 transition-colors">
                           {article.title}
                         </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-900 text-cyan-300">
                          {article.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {article.topCategory || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(article.publishedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Total Articles: <span className="font-medium text-white">{totalArticles}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-300">
                  Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
