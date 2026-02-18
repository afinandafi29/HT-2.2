import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi, getHeadlines, getTopStories } from '../../api/newsApi';
import NewsCard from '../../components/News/NewsCard';
import NewsHero from '../../components/News/NewsHero';
import ActionButtons from '../../components/ActionButtons';
import { Search } from 'lucide-react';

const CATEGORIES = ['business', 'technology', 'science', 'health', 'sports', 'entertainment'];

const NewsHome = () => {
    const [topStory, setTopStory] = useState(null);
    const [categoryNews, setCategoryNews] = useState({});
    const [generalNews, setGeneralNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreGeneralNews = async (pageNum) => {
        try {
            const res = await getTopStories({ limit: 8, page: pageNum, language: 'en' });
            if (res && res.data && res.data.length > 0) {
                setGeneralNews(prev => (pageNum === 1 ? res.data : [...prev, ...res.data]));
                if (res.data.length < 8) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Failed to load more news", e);
        }
    };

    const fetchInitialNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Top Stories for Hero
            const topStoriesData = await getTopStories({ limit: 1 });
            if (topStoriesData && topStoriesData.data && topStoriesData.data.length > 0) {
                setTopStory(topStoriesData.data[0]);
            }

            // 2. Fetch Category Summaries (Business, Tech, etc.)
            const categoryPromises = CATEGORIES.map(category =>
                getHeadlines({ categories: category, limit: 4, language: 'en' })
            );

            const results = await Promise.allSettled(categoryPromises);

            const newCategoryNews = {};
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const res = result.value;
                    const categoryName = CATEGORIES[index];
                    if (res && res.data) {
                        newCategoryNews[categoryName] = Array.isArray(res.data) ? res.data : (res.data[categoryName] || []);
                    }
                }
            });

            setCategoryNews(newCategoryNews);

            // 3. Fetch initial Global Feed
            await loadMoreGeneralNews(1);

        } catch (err) {
            console.error("Critical news fetch error:", err);
            setError("Failed to load news stream. Please check your connection or try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialNews();
    }, [fetchInitialNews]);

    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        await loadMoreGeneralNews(nextPage);
        setPage(nextPage);
        setLoadingMore(false);
    }, [loadingMore, hasMore, page]);

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
                handleLoadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loadingMore, hasMore, handleLoadMore]); // Dependencies for scroll handler


    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/news/search?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    if (loading && Object.keys(categoryNews).length === 0 && !topStory) return null;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] pt-20 px-4 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-white mb-2">Unavailable</h3>
                    <p className="text-white/60 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 max-w-[1920px] mx-auto animate-fadeIn flex flex-col items-center">
            <div className="w-full">
                <ActionButtons />

                {/* News Feed Header */}
                <div className="relative mb-24 px-4 md:px-0">
                    <header className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-2 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div>
                            <span className="text-blue-500 font-black uppercase tracking-[0.5em] text-xs">Premium Global Coverage</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
                            NEWS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700">FEED</span>
                        </h1>
                    </header>

                    {/* Search & Navbar Section with Big Button */}
                    <div className="relative z-10 -mt-8 flex flex-col gap-12 bg-[#0A0C10]/60 p-12 rounded-[5rem] border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-10">
                            {/* Prominent Search Bar */}
                            <form onSubmit={handleSearchSubmit} className="relative flex-grow group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity"></div>
                                <div className="relative flex items-center bg-black/60 border border-white/10 rounded-full p-3 focus-within:ring-8 focus-within:ring-blue-500/10 transition-all">
                                    <div className="pl-10 text-white/50 group-focus-within:text-blue-500 transition-colors">
                                        <Search size={32} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Scan the global information stream..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-transparent border-none px-8 py-6 text-white placeholder-white/30 focus:outline-none text-2xl font-black italic tracking-tight"
                                    />
                                    <button type="submit" className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-16 py-6 rounded-full font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 whitespace-nowrap">
                                        SEARCH
                                    </button>
                                </div>
                            </form>

                            {/* BIG BUTTON: Discover / Trending */}
                            <Link
                                to="/news/search?trending=true"
                                className="w-full lg:w-96 flex flex-col items-center justify-center gap-1 rounded-[4rem] bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-800 text-white font-black uppercase text-xl tracking-[0.2em] shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 hover:-translate-y-2 active:scale-95 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                                    TREND NOW
                                </div>
                                <span className="text-[10px] opacity-60 tracking-[0.5em] font-medium">DISCOVER TRENDS</span>
                            </Link>
                        </div>

                        {/* Category Navbar */}
                        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none no-scrollbar pt-4">
                            <div className="flex items-center gap-4 bg-black/40 p-2.5 rounded-3xl border border-white/5 shadow-inner">
                                {CATEGORIES.map(category => (
                                    <a
                                        key={category}
                                        href={`#${category}`}
                                        className="px-8 py-4 rounded-2xl bg-[#0f1115] border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] whitespace-nowrap hover:bg-zinc-800 hover:text-white hover:border-blue-500/50 transition-all flex items-center gap-2 group/category shadow-lg"
                                    >
                                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover/category:bg-blue-500 transition-colors shadow-[0_0_5px_rgba(59,130,246,0.3)]"></span>
                                        {category}
                                    </a>
                                ))}
                            </div>

                            <Link
                                to="/news/search"
                                className="ml-auto px-10 py-5 rounded-3xl bg-blue-600 text-white font-black uppercase text-xs tracking-[0.3em] whitespace-nowrap hover:bg-white hover:text-blue-600 transition-all shadow-xl active:scale-95"
                            >
                                Discovery Mode
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full">
                {topStory && (
                    <div className="w-full mb-24 px-4">
                        <NewsHero article={topStory} />
                    </div>
                )}

                <div className="w-full space-y-24">
                    {CATEGORIES.map(category => (
                        categoryNews[category] && categoryNews[category].length > 0 && (
                            <section key={category} id={category} className="scroll-mt-32 px-4">
                                <div className="flex items-center justify-between mb-10 border-l-8 border-blue-600 pl-8">
                                    <div>
                                        <h2 className="text-5xl font-black text-white capitalize tracking-tighter">
                                            {category}
                                        </h2>
                                        <p className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] mt-2">Latest from {category}</p>
                                    </div>
                                    <Link
                                        to={`/news/search?categories=${category}`}
                                        className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        Full Coverage
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                                    {categoryNews[category].map(article => (
                                        <NewsCard key={article.uuid} article={article} />
                                    ))}
                                </div>
                            </section>
                        )
                    ))}
                </div>

                {/* General Feed */}
                <div className="w-full mt-32 border-t border-white/10 pt-24 px-4">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="w-24 h-2 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
                        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">Global Stream</h2>
                    </div>

                    {generalNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                            {generalNews.map((article, idx) => (
                                <NewsCard key={`${article.uuid}-${idx}`} article={article} />
                            ))}
                        </div>
                    ) : (
                        null
                    )}

                    {/* loadingMore spinner removed */}

                    {!hasMore && generalNews.length > 0 && (
                        <div className="text-center py-32">
                            <p className="text-white/40 text-xl font-black uppercase tracking-[0.4em]">End of feed</p>
                            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-8 text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-xs">Scroll to Top</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsHome;
