import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";

export default function ArticlesTable() {
  // Core state for articles and pagination
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);

  // State for category filtering
  const [categories, setCategories] = useState(["All", "N/A"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    source: "",
    topCategory: "",
    url: "",
    summary: "",
    body: "",
    media: [{ type: "image", src: "" }],
  });

  // Effect to fetch a comprehensive list of categories on initial mount
  useEffect(() => {
    const fetchAllArticlesForCategories = async () => {
      try {
        // Fetch a large number of articles to derive a comprehensive category list.
        // This assumes your API supports a 'limit' parameter.
        const response = await fetch(
          `https://newsai-8a45.onrender.com/api/articles?limit=200`
        );
        if (!response.ok)
          throw new Error("Failed to fetch articles for categories");
        const data = await response.json();
        // Extract all non-empty topCategory values
        const allCategories = data.articles
          .map((article) => article.topCategory)
          .filter(Boolean); // filter out null/undefined/empty strings
        // Get the unique categories and sort them
        const uniqueCategories = [...new Set(allCategories)].sort();
        // Set the state for the dropdown filter
        setCategories(["All", ...uniqueCategories, "N/A"]);
      } catch (e) {
        console.error(
          "Could not derive categories from fetched data:",
          e.message
        );
        // If the fetch fails, the dropdown will just have the default 'All' and 'N/A'
      }
    };
    fetchAllArticlesForCategories();
  }, []);

  // Effect to fetch articles when page or category changes
  useEffect(() => {
    const fetchArticles = async (page, category) => {
      setLoading(true);
      setError(null);
      try {
        let url = `https://newsai-8a45.onrender.com/api/articles?page=${page}`;
        if (category && category !== "All") {
          // Handle the 'N/A' case for the backend if it expects an empty string for uncategorized articles
          const categoryQuery = category === "N/A" ? "" : category;
          url += `&category=${encodeURIComponent(categoryQuery)}`;
        }
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages);
        setTotalArticles(data.totalArticles);
        setCurrentPage(data.currentPage);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to the first page when the category changes
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // 📝 Edit
  const handleEdit = (article) => {
    setEditArticle(article);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`https://newsai-8a45.onrender.com/api/articles/${editArticle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editArticle),
      });
      setArticles((prev) =>
        prev.map((a) => (a._id === editArticle._id ? editArticle : a))
      );
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to update article");
    }
  };

  // ❌ Delete
  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await fetch(`https://newsai-8a45.onrender.com/api/articles/${articleId}`, {
        method: "DELETE",
      });
      setArticles((prev) => prev.filter((a) => a._id !== articleId));
    } catch (err) {
      alert("Failed to delete article");
    }
  };

  // ➕ Create
  const handleCreate = async () => {
    try {
      const res = await fetch(`https://newsai-8a45.onrender.com/api/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArticle),
      });
      const created = await res.json();
      setArticles((prev) => [created, ...prev]); // prepend new one
      setIsCreateOpen(false);
      // Reset the form to its initial state, including the media array
      setNewArticle({
        title: "",
        source: "",
        topCategory: "",
        url: "",
        summary: "",
        body: "",
        media: [{ type: "image", src: "" }],
      });
    } catch (err) {
      alert("Failed to create article");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-tight">
              Latest News Articles
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              A real-time feed of articles from the news API.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium"
            >
              <Plus size={18} /> New Article
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg text-center">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-2xl">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Published At
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-cyan-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-normal">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                        >
                          {article.title}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-900 text-cyan-300">
                          {article.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {article.topCategory || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(article.publishedAt)}
                      </td>
                      <td className="px-6 py-4 text-center space-x-4">
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-blue-400 hover:text-blue-600 transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Total Articles:{" "}
                <span className="font-medium text-white">{totalArticles}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-cyan-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-300">
                  Page{" "}
                  <span className="font-bold text-white">{currentPage}</span> of{" "}
                  <span className="font-bold text-white">{totalPages}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-cyan-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* 🔹 Edit Modal */}
        {isModalOpen && editArticle && (
          <Modal
            title="Edit Article"
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEdit}
          >
            <FormInputs data={editArticle} setData={setEditArticle} />
          </Modal>
        )}

        {/* 🔹 Create Modal */}
        {isCreateOpen && (
          <Modal
            title="Create New Article"
            onClose={() => setIsCreateOpen(false)}
            onSave={handleCreate}
          >
            <FormInputs data={newArticle} setData={setNewArticle} />
          </Modal>
        )}
      </div>
    </div>
  );
}

// 🔹 Reusable Modal
function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{title}</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
        <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable Form Fields
function FormInputs({ data, setData }) {
  return (
    <>
      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Title</span>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Source</span>
        <input
          type="text"
          value={data.source}
          onChange={(e) => setData({ ...data, source: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Category</span>
        <input
          type="text"
          value={data.topCategory}
          onChange={(e) => setData({ ...data, topCategory: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-300 text-sm">URL</span>
        <input
          type="text"
          value={data.url}
          onChange={(e) => setData({ ...data, url: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Image URL</span>
        <input
          type="text"
          value={data.media && data.media[0] ? data.media[0].src : ""}
          onChange={(e) => {
            const updatedMedia = [{ type: "image", src: e.target.value }];
            setData({ ...data, media: updatedMedia });
          }}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Summary</span>
        <textarea
          value={data.summary || ""}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 h-24 resize-y"
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-300 text-sm">Body</span>
        <textarea
          value={data.body || ""}
          onChange={(e) => setData({ ...data, body: e.target.value })}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-500 h-40 resize-y"
        />
      </label>
    </>
  );
}
