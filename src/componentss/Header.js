import React, { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo + Mobile Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <img
              alt="IXL Logo"
              className="h-6 w-auto"
              src="https://www.ixl.com/favicon.ico"
            />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Search (Desktop) */}
          <form className="hidden sm:block flex-1 max-w-md">
            <div className="relative">
              <input
                type="search"
                placeholder="Search topics and skills"
                className="w-full py-1 px-3 pr-8 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Login Section (Desktop) */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Username"
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium">
              Sign in
            </button>
            <label className="flex items-center gap-1 text-gray-500">
              <input
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs">Remember</span>
            </label>
            <button className="flex items-center gap-1">
              <img
                alt="Country Flag"
                className="h-4 w-6"
                src="https://flagcdn.com/w20/in.png"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-3">
            <form className="px-4">
              <input
                type="search"
                placeholder="Search topics"
                className="w-full py-1 px-3 border border-gray-300 rounded"
              />
            </form>
            <div className="px-4 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Username"
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium">
                Sign in
              </button>
            </div>
            <nav className="bg-green-600 text-white">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <ul className="flex gap-8 px-4 py-3">
                  <li className="font-serif text-lg cursor-pointer hover:underline">
                    Learning
                  </li>
                  <li className="font-serif text-lg cursor-pointer hover:underline">
                    Analytics
                  </li>
                </ul>
                <button className="bg-teal-400 hover:bg-teal-500 px-6 py-3 font-serif text-lg cursor-pointer">
                  JOIN NOW
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Navigation */}
      <nav className="bg-green-600 text-white hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <ul className="flex gap-8 px-4 py-3">
            <li className="font-serif text-lg cursor-pointer hover:underline">
              Learning
            </li>
            <li className="font-serif text-lg cursor-pointer hover:underline">
              Analytics
            </li>
          </ul>
          <button className="bg-teal-400 hover:bg-teal-500 px-6 py-3 font-serif text-lg cursor-pointer">
            JOIN NOW
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
