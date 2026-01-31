import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3 mb-6 p-1.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 w-fit shadow-lg">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-5 py-2 bg-transparent hover:bg-white/5 text-white rounded-xl transition-all border-none font-bold text-sm group"
            >
                <i className="fas fa-home group-hover:scale-110 transition-transform text-blue-400"></i>
                <span>Home</span>
            </button>
            <div className="w-px h-6 bg-white/10"></div>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2 bg-transparent hover:bg-white/5 text-white rounded-xl transition-all border-none font-bold text-sm group"
            >
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform text-blue-400"></i>
                <span>Back</span>
            </button>
        </div>
    );
};

export default ActionButtons;
