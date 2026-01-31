import React, { useEffect, useState } from 'react';
import { newsApi } from '../../api/newsApi';
import NewsCard from '../../components/News/NewsCard';
import NewsSkeleton from '../../components/News/NewsSkeleton';
import Pagination from '../../components/News/Pagination';
import NewsFilter from '../../components/News/NewsFilter';

const NewsTopStories = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ found: 0, returned: 0, limit: 10, page: 1 });
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ language: 'en', categories: '' });

    useEffect(() => {
        const fetchTopStories = async () => {
            setLoading(true);
            try {
                const data = await newsApi.getTopStories({
                    page: page,
                    limit: 12,
                    language: filters.language,
                    ...(filters.categories ? { categories: filters.categories } : {})
                    // Top stories might not support broad search queries, usually just locale/cat
                });
                setArticles(data.data || []);
                setMeta(data.meta || { found: 0, returned: 0, limit: 10, page: 1 });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopStories();
    }, [page, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1); // Reset to page 1 on filter change
    };

    const totalPages = Math.ceil((meta.found > 1000 ? 100 : meta.found) / meta.limit);
    // API might limit depth.

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2 text-white">Trending Stories</h1>
                <p className="text-white/60">What's happening right now.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full lg:w-1/4 shrink-0">
                    <NewsFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        showSearch={false} // Top stories usually don't have keyword search, use Search Page
                    />
                </div>

                {/* News Grid */}
                <div className="w-full lg:w-3/4">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, i) => <NewsSkeleton key={i} />)}
                        </div>
                    ) : (
                        <>
                            {articles.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 rounded-xl">
                                    <h3 className="text-xl font-bold text-white/50">No stories found</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {articles.map(article => (
                                        <NewsCard key={article.uuid} article={article} />
                                    ))}
                                </div>
                            )}

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages > 10 ? 10 : totalPages} // Limit max pages if API returns huge 'found' count but limits offset
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsTopStories;
