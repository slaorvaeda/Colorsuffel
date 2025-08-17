import React from 'react';

const CardListSlider = ({ viewMode, setViewMode, className = "" }) => {
  return (
    <div className={`flex items-center justify-center mb-4 sm:mb-6 w-[250px]  px-2 ${className}`}>
      <div className="bg-white rounded-4xl p-1 sm:p-2 shadow-lg border border-gray-200 w-full max-w-xs sm:max-w-none">
        <div className="flex space-x-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 sm:px-4 py-2 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-1 sm:space-x-2 flex-1 justify-center ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 sm:px-4 py-2 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-1 sm:space-x-2 flex-1 justify-center ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardListSlider; 