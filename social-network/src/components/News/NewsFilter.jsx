import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const CATEGORIES = [
    'general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment'
];

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'ar', label: 'Arabic' },
    { code: 'zh', label: 'Chinese' },
    { code: 'nl', label: 'Dutch' },
    { code: 'ru', label: 'Russian' },
    { code: 'sv', label: 'Swedish' },
];

const NewsFilter = ({ filters, onFilterChange, showSearch = true }) => {
    const handleCategoryChange = (cat) => {
        onFilterChange({ ...filters, categories: cat === filters.categories ? '' : cat });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            categories: '',
            language: 'en',
            domains: '',
        });
    };

    return (
        <div className="bg-[#0f1115] rounded-[2.5rem] border border-white/10 p-8 h-fit sticky top-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 overflow-hidden">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                        <Filter size={20} className="text-white" />
                    </div>
                    <h3 className="font-black text-xl text-white uppercase tracking-tighter">
                        Filters
                    </h3>
                </div>
                {(filters.categories || filters.search || filters.language !== 'en') && (
                    <button
                        onClick={clearFilters}
                        className="text-[9px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-full transition-all font-black uppercase tracking-widest border border-red-500/20"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Global Search */}
            {showSearch && (
                <div className="mb-8">
                    <label className="block text-[10px] font-black uppercase text-white/60 tracking-[0.2em] mb-3 ml-1">Search Keywords</label>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600/5 rounded-2xl blur-md group-focus-within:bg-blue-600/10 transition-all"></div>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find stories..."
                            value={filters.search || ''}
                            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                            className="relative w-full bg-[#1a1d23] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-[#20242b] transition-all placeholder-white/20 font-bold"
                        />
                    </div>
                </div>
            )}

            {/* Language Selection */}
            <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-white/60 tracking-[0.2em] mb-3 ml-1">News Language</label>
                <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.slice(0, 10).map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onFilterChange({ ...filters, language: lang.code })}
                            className={`px-3 py-3 text-[10px] font-black rounded-xl border transition-all uppercase tracking-widest ${filters.language === lang.code
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-[#1a1d23] border-white/5 text-white/50 hover:border-blue-500/30 hover:text-white hover:bg-[#20242b]'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Navigation */}
            <div>
                <label className="block text-[10px] font-black uppercase text-white/60 tracking-[0.2em] mb-3 ml-1">Categories</label>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`flex items-center justify-between w-full px-5 py-3.5 rounded-xl border transition-all group ${filters.categories === cat
                                ? 'bg-blue-600 border-blue-500 text-white font-black'
                                : 'bg-[#1a1d23] border-white/5 text-white/50 hover:bg-[#20242b] hover:text-white hover:border-white/10'
                                }`}
                        >
                            <span className="capitalize text-[11px] font-bold tracking-tight">{cat}</span>
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${filters.categories === cat ? 'bg-white shadow-[0_0_5px_white]' : 'bg-white/20'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsFilter;
