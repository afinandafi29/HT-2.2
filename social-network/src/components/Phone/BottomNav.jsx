import React from 'react';

const BottomNav = ({ onHomeClick, onSearchClick, onBackClick }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900/60 backdrop-blur-3xl border border-white/10 py-4 px-6 flex justify-around items-center rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50">
      <button
        onClick={onHomeClick}
        className="text-white/90 hover:text-white transition-all transform hover:scale-110 active:scale-95 bg-transparent border-none p-2 flex items-center justify-center"
        title="Home"
      >
        <i className="fas fa-home text-2xl"></i>
      </button>

      <button
        onClick={onSearchClick}
        className="text-white/90 hover:text-white transition-all transform hover:scale-110 active:scale-95 bg-transparent border-none p-2 flex items-center justify-center"
        title="Search"
      >
        <i className="fas fa-search text-2xl"></i>
      </button>

      <button
        onClick={onBackClick}
        className="text-white/90 hover:text-white transition-all transform hover:scale-110 active:scale-95 bg-transparent border-none p-2 flex items-center justify-center"
        title="Back"
      >
        <i className="fas fa-arrow-left text-2xl"></i>
      </button>
    </div>
  );
};

export default BottomNav;