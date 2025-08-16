import React, { useState } from "react";

function Vijay() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="font-sans text-gray-900 bg-white">
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
          border-radius: 3px;
        }
      `}</style>

      {/* Top bar */}
      <header className="flex items-center justify-between bg-[#2a4d8f] text-white px-3 sm:px-6 h-12">
        <div className="flex items-center space-x-2">
          {/* Menu button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-white text-[#2a4d8f] rounded px-2 py-1 hover:bg-gray-100"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="w-8 h-8 rounded-full bg-[#b81d9a] flex items-center justify-center">
            <span className="text-white font-bold text-lg select-none">DG</span>
          </div>
          <span className="text-sm sm:text-base font-normal select-text">
            SSC CHSL 2022-23 Tier - I Mock Test - 1
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm sm:text-base">
          <button
            className="bg-white text-[#2a4d8f] rounded px-3 py-1 font-semibold hover:bg-gray-100"
            type="button"
          >
            <span>Time Left:</span>
            <span className="font-mono font-bold bg-[#dbeafe] text-[#1e40af] px-2 rounded">
              00 : 59 : 11
            </span>
          </button>
          <button className="bg-white text-[#2a4d8f] rounded px-3 py-1 font-semibold hover:bg-gray-100">
            Pause
          </button>
          <button
            aria-label="Fullscreen"
            className="bg-white text-[#2a4d8f] rounded px-2 py-1 hover:bg-gray-100"
            type="button"
          >
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-3rem)]">
        {/* Left main content */}
        <main className={`flex-1 flex flex-col border-r border-gray-300 overflow-hidden ${showSidebar ? "" : "w-full"}`}>
          {/* Tabs */}
          <nav className="flex space-x-1 bg-[#e1e7f3] px-2 sm:px-4 py-1 border-b border-gray-300 text-xs sm:text-sm font-semibold text-[#2a4d8f]">
            <button className="flex items-center space-x-1 bg-[#cbd7f1] rounded-t px-2 py-1">
              <span>General Intelligence</span>
              <i className="fas fa-info-circle text-[#2a4d8f]"></i>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 rounded-t hover:bg-[#cbd7f1]">
              <span>General Awareness</span>
              <i className="fas fa-info-circle text-[#2a4d8f]"></i>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 rounded-t hover:bg-[#cbd7f1]">
              <span>Quantitative Aptitude</span>
              <i className="fas fa-info-circle text-[#2a4d8f]"></i>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 rounded-t hover:bg-[#cbd7f1]">
              <span>English Language</span>
              <i className="fas fa-info-circle text-[#2a4d8f]"></i>
            </button>
            <select
              aria-label="Select language"
              className="ml-auto border border-gray-600 rounded text-black text-xs sm:text-sm px-1 sm:px-2"
            >
              <option>English</option>
            </select>
          </nav>

          {/* Question info bar */}
          <div className="flex items-center justify-between border-b border-gray-300 px-3 py-2 text-xs sm:text-sm bg-gray-100">
            <div>Q: 2 / 100</div>
            <div className="flex items-center space-x-2">
              <span className="border border-gray-400 rounded px-2 py-0.5 font-mono text-xs sm:text-sm select-none">
                Qn. Time : 00 : 22
              </span>
              <span className="font-semibold text-sm sm:text-base">Marks :</span>
              <span className="text-green-600 font-semibold select-none">+2.00</span>
              <span className="text-red-500 font-semibold select-none">-0.50</span>
            </div>
          </div>

          {/* Question content */}
          <section className="flex-1 overflow-auto p-4 text-sm sm:text-base leading-relaxed">
            <p className="font-bold mb-3 max-w-[700px]">
              Select the set in which the numbers are related in the same way as are the numbers of the given sets.
            </p>
            <p className="mb-3 max-w-[700px]">
              <span className="font-bold">(NOTE: </span>
              Operations should be performed on the whole numbers, without breaking down the numbers into its constituent digits.
            </p>
            <p className="mb-3 max-w-[700px]">(17, 29, 46)</p>
            <p className="mb-3 max-w-[700px]">(24, 36, 60)</p>
            <form className="space-y-3 max-w-[700px]">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input className="form-radio text-[#2a4d8f]" name="answer" type="radio" />
                <span>(36, 46, 81)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input className="form-radio text-[#2a4d8f]" name="answer" type="radio" />
                <span>(29, 41, 64)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input className="form-radio text-[#2a4d8f]" name="answer" type="radio" />
                <span>(21, 33, 54)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input className="form-radio text-[#2a4d8f]" name="answer" type="radio" />
                <span>(48, 52, 98)</span>
              </label>
            </form>
          </section>
        </main>

        {/* Right sidebar */}
        {showSidebar && (
          <aside className="w-72 flex flex-col border-l border-gray-300 bg-[#d9ecff] overflow-hidden">
            <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-300 bg-[#d9ecff]">
              <img
                alt="User avatar"
                className="w-10 h-10 rounded-full"
                loading="lazy"
                src="https://placehold.co/40x40/png?text=User+Avatar"
              />
              <span className="font-semibold text-sm select-text">vijaymarka</span>
            </div>
            <div className="px-3 py-2 border-b border-gray-300 text-sm text-center">
              <span>Time Left:</span>
              <span className="font-mono font-semibold bg-gray-300 rounded px-2 select-none">
                00 : 59 : 11
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
                <div className="text-[10px] leading-tight">Answered &amp; Marked for Review</div>
              </div>
            </div>

            {/* Section title */}
            <div className="px-3 py-1 font-semibold text-sm border-b border-gray-300 select-none">
              General Intelligence
            </div>

            {/* Question grid */}
            <div className="flex-1 overflow-auto scrollbar-thin px-3 py-2">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <button className="bg-green-600 text-white rounded-tl-md rounded-tr-md shadow-md py-2 font-semibold select-none" type="button">
                  1
                </button>
                <button className="bg-red-600 text-white rounded-tl-md rounded-tr-md shadow-md py-2 font-semibold select-none" type="button">
                  2
                </button>
                {[...Array(23)].map((_, idx) => (
                  <button
                    key={idx}
                    className="bg-gray-300 rounded shadow-md py-2 font-semibold select-none"
                    type="button"
                  >
                    {idx + 3}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom bar */}
      <footer className="flex items-center justify-between border-t border-gray-300 px-3 sm:px-6 py-3 text-xs sm:text-sm bg-white">
        <button className="bg-[#a3c4f3] text-[#2a4d8f] rounded px-4 py-2 font-normal hover:bg-[#8bb7f0]" type="button">
          Mark for review &amp; next
        </button>
        <button className="bg-[#a3c4f3] text-[#2a4d8f] rounded px-4 py-2 font-normal hover:bg-[#8bb7f0]" type="button">
          Clear Response
        </button>
        <button className="bg-[#2a4d8f] text-white rounded px-6 py-2 font-semibold hover:bg-[#1f3e6f]" type="button">
          Save &amp; Next
        </button>
        <button className="bg-[#2a4d8f] text-white rounded px-6 py-2 font-semibold hover:bg-[#1f3e6f]" type="button">
          Submit
        </button>
      </footer>
    </div>
  );
}

export default Vijay;
