const CardListSlider = ({ viewMode, setViewMode, className = '' }) => {
  return (
    <div className={`mb-4 flex w-full max-w-xs justify-center px-2 sm:mb-6 ${className}`}>
      <div className="w-full rounded-[1.25rem] border border-zinc-200/90 bg-white/90 p-1 shadow-sm backdrop-blur-sm sm:p-1.5 dark:border-white/10 dark:bg-zinc-900/80">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:gap-2 sm:text-sm ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-md'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10'
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:gap-2 sm:text-sm ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-md'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10'
            }`}
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
