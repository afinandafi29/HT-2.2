import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { newsApi } from '../../api/newsApi';
import { ShortsIcon } from '../ShortsSection';

const ReelIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="white" />
    </svg>
);

const ExploreGrid = ({ onOpenPost }) => {
    const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
    const YT_KEY = import.meta.env.VITE_YT_API_KEY;
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeVideoId, setActiveVideoId] = useState(null);
    const observer = useRef();

    const fetchExploreItems = useCallback(async (p, query = '') => {
        setLoading(true);
        try {
            const q = query || 'trending technology adventure';

            // Fetch YouTube Videos
            const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(q)}&type=video&key=${YT_KEY}&pageToken=${p > 1 ? p : ''}`);
            const ytData = await ytRes.json();
            const ytItems = (ytData.items || []).map(v => ({
                id: `yt-${v.id.videoId}`,
                videoId: v.id.videoId,
                url: v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url,
                type: 'video',
                alt: v.snippet.title,
                author: v.snippet.channelTitle
            }));

            // Fetch Images from Pexels
            const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&page=${p}&per_page=6`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexelsData = await pexelsRes.json();
            const pexelsItems = (pexelsData.photos || []).map(photo => ({
                id: `pexels-${photo.id}`,
                url: photo.src.large || photo.src.medium,
                type: 'image',
                alt: photo.alt || 'Pexels Image',
                author: photo.photographer
            }));

            // Fetch News (using existing logic)
            const newsRes = await newsApi.getAllNews({ search: q, page: p, limit: 6 });
            const newsItems = (newsRes.data || []).map(n => ({
                id: `news-${n.uuid}`,
                url: n.image_url,
                type: 'news',
                alt: n.title,
                author: n.source
            })).filter(n => n.url);

            // Mix them
            const mixed = [];
            let i = 0, j = 0, k = 0;
            while (i < ytItems.length || j < pexelsItems.length || k < newsItems.length) {
                if (i < ytItems.length) mixed.push(ytItems[i++]);
                if (j < pexelsItems.length) mixed.push(pexelsItems[j++]);
                if (k < newsItems.length) mixed.push(newsItems[k++]);
            }

            if (p === 1) setItems(mixed);
            else setItems(prev => [...prev, ...mixed]);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchExploreItems(1, searchQuery);
        setPage(1);
    }, [searchQuery, fetchExploreItems]);

    useEffect(() => {
        if (page > 1) fetchExploreItems(page, searchQuery);
    }, [page, fetchExploreItems, searchQuery]);

    const lastRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setPage(p => p + 1);
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    return (
        <div className="discovery-container">
            <div className="discover-search-bar" style={{ padding: '10px 15px', background: 'var(--card-bg)', borderBottom: 'none', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: 'none', background: 'var(--bg-secondary)', outline: 'none', color: 'var(--ig-font)' }}
                    />
                </div>
            </div>

            <div className="img-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                {items.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="grid-item" ref={i === items.length - 1 ? lastRef : null}
                        onClick={() => {
                            if (item.type === 'video') {
                                setActiveVideoId(item.videoId);
                            } else {
                                onOpenPost({
                                    id: item.id,
                                    image: item.url,
                                    caption: item.alt,
                                    user: {
                                        username: item.author.toLowerCase().replace(/\s+/g, '_'),
                                        pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author)}&background=random&color=fff`
                                    },
                                    likes: Math.floor(Math.random() * 10000),
                                    comments: Math.floor(Math.random() * 500),
                                    source: item.type === 'news' ? 'News' : 'Pexels'
                                });
                            }
                        }}
                        style={{ aspectRatio: '1/1', background: '#000', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>

                        {activeVideoId === item.videoId ? (
                            <iframe
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=0`}
                                allow="autoplay; encrypted-media"
                                title={item.alt}
                            />
                        ) : (
                            <>
                                <img src={item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {item.type === 'video' && (
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px', pointerEvents: 'none' }}>
                                        <ReelIcon />
                                    </div>
                                )}
                                {item.type === 'news' && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>
                                        NEWS
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ExploreGrid;
