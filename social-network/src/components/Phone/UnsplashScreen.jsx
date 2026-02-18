import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const UnsplashScreen = () => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const fetchImages = async (searchTerm = 'nature', pageNum = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos`, {
                params: {
                    query: searchTerm,
                    per_page: 15,
                    page: pageNum,
                    client_id: UNSPLASH_ACCESS_KEY,
                },
            });
            if (pageNum === 1) {
                setImages(response.data.results);
            } else {
                setImages((prev) => [...prev, ...response.data.results]);
            }
        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages('wallpaper', 1);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setPage(1);
            fetchImages(query, 1);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchImages(query || 'wallpaper', nextPage);
    };

    return (
        <div className="w-full h-full bg-zinc-950 text-white flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="p-4 bg-zinc-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white text-black rounded-lg">
                        <ImageIcon size={18} />
                    </div>
                    <h2 className="text-xl font-black tracking-tight uppercase">Unsplash</h2>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        placeholder="Search high-res photos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                </form>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
                <div className="grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                        <div key={`${img.id}-${idx}`} className="relative group aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                            <img
                                src={img.urls.small}
                                alt={img.alt_description}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                <p className="text-[10px] font-bold truncate mb-1">by {img.user.name}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(img.links.download, '_blank')}
                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md backdrop-blur-md transition-colors"
                                    >
                                        <Download size={12} />
                                    </button>
                                    <button
                                        onClick={() => window.open(img.links.html, '_blank')}
                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-md backdrop-blur-md transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-zinc-500" size={24} />
                    </div>
                ) : images.length > 0 && (
                    <button
                        onClick={loadMore}
                        className="w-full mt-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors mb-20"
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default UnsplashScreen;
