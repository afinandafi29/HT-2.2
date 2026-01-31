import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsApi } from '../../api/newsApi';
import NewsCard from '../../components/News/NewsCard';
import NewsSkeleton from '../../components/News/NewsSkeleton';
import Pagination from '../../components/News/Pagination';
import NewsFilter from '../../components/News/NewsFilter';
import ActionButtons from '../../components/ActionButtons';
import { Search } from 'lucide-react';

const NewsSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categories: searchParams.get('categories') || '',
        language: searchParams.get('language') || 'en',
    });

    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ found: 0 });
    const [hasSearched, setHasSearched] = useState(false); // To show "Start searching" state

    // Debounce search/filter updates to URL
    useEffect(() => {
        const params = { ...filters, page };
        // Remove empty keys
        Object.keys(params).forEach(key => !params[key] && delete params[key]);
        setSearchParams(params);
    }, [filters, page, setSearchParams]);

    // Fetch data
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // Determine if we should call getHeadlines or getAllNews based on if search term exists
                // Actually /news/all is for search, /news/headlines for categories.
                // If the user searches "tech", they might want /news/all?search=tech OR /news/headlines?categories=tech
                // The prompt says "All News Search: Advanced search with filters by category..." which usually implies /news/all

                const data = await newsApi.getAllNews({
                    search: filters.search,
                    categories: filters.categories,
                    language: filters.language,
                    page: page,
                    limit: 12
                });

                setArticles(data.data || []);
                setMeta(data.meta || { found: 0 });
                setHasSearched(true);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetch
        const timeoutId = setTimeout(() => {
            fetchNews();
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [filters, page]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <div className="w-full px-4 md:px-8 py-8 pb-24 md:pb-12 max-w-[1920px] mx-auto animate-fadeIn">
            <ActionButtons />

            <div className="mb-12 border-b border-gray-800 pb-10 mt-4">
                <div className="relative">
                    <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <h1 className="relative text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-md uppercase">
                        SEARCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">NEWS</span>
                    </h1>
                    <p className="text-white/60 text-xl font-light max-w-2xl">Find stories that matter to you with advanced filters.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-80 shrink-0">
                    <NewsFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        showSearch={true}
                    />
                </aside>

                {/* News Grid */}
                <main className="flex-grow">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {Array(6).fill(0).map((_, i) => <NewsSkeleton key={i} />)}
                        </div>
                    ) : (
                        <>
                            {!hasSearched && !loading && articles.length === 0 ? (
                                <div className="text-center py-32 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search size={32} className="text-blue-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Ready to explore?</h3>
                                        <p className="text-white/60 text-lg">Use the filters or type a keyword to start searching global headlines.</p>
                                    </div>
                                </div>
                            ) : articles.length === 0 ? (
                                <div className="text-center py-32 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
                                    <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-red-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">No results found</h3>
                                    <p className="text-white/60 text-lg">Try adjusting your filters or search query.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {articles.map((article, index) => (
                                        <div key={`${article.uuid}-${index}`} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                                            <NewsCard article={article} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {articles.length > 0 && (
                                <div className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
                                    <Pagination
                                        currentPage={page}
                                        totalPages={Math.min(10, Math.ceil(meta.found / 10))}
                                        onPageChange={(p) => {
                                            setPage(p);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default NewsSearch;
