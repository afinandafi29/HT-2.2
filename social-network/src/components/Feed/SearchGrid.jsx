import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';

// Cache-bust image URL so search always shows fresh images
const freshImageUrl = (url) => {
    if (!url) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${Date.now()}`;
};

const SearchGrid = ({ onOpenPost }) => {
    const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
    const SOURCESPLASH_KEY = import.meta.env.VITE_SOURCESPLASH_API_KEY;
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchRunId, setSearchRunId] = useState(0); // force new images per search
    const observer = useRef();

    const fetchSearchItems = useCallback(async (p, query = '') => {
        setLoading(true);
        try {
            const q = query || 'lifestyle decoration';

            // Fetch Images from Pexels
            const pexelsPromise = fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&page=${p}&per_page=18`, {
                headers: { Authorization: PEXELS_KEY }
            }).then(res => res.json())
                .then(data => (data.photos || []).map(photo => ({
                    id: `pexels-${photo.id}`,
                    url: photo.src.large || photo.src.medium,
                    type: 'image',
                    alt: photo.alt || 'Pexels Image',
                    author: photo.photographer
                })))
                .catch(err => {
                    console.error("Pexels Error:", err);
                    return [];
                });

            // Fetch Images from SourceSplash
            // Assuming endpoint structure based on common Laravel setups with Sanctum
            const sourceSplashPromise = fetch(`https://www.sourcesplash.com/api/search?q=${encodeURIComponent(q)}&page=${p}`, {
                headers: {
                    'Authorization': `Bearer ${SOURCESPLASH_KEY}`,
                    'Accept': 'application/json'
                }
            }).then(res => res.json())
                .then(data => {
                    // Adjust parsing based on actual response structure. 
                    // Assuming data.data or data is the area array
                    const images = data.data || data || [];
                    return images.map(img => ({
                        id: `ss-${img.id}`,
                        url: img.url || img.path || (img.image ? img.image.url : null), // Fallbacks
                        type: 'image',
                        alt: img.title || 'SourceSplash Image',
                        author: img.user ? img.user.name : 'Unknown'
                    })).filter(img => img.url);
                })
                .catch(err => {
                    console.error("SourceSplash Error:", err);
                    return [];
                });

            const [pexelsItems, sourceSplashItems] = await Promise.all([pexelsPromise, sourceSplashPromise]);

            // Interleave items
            const newItems = [];
            const maxLength = Math.max(pexelsItems.length, sourceSplashItems.length);
            for (let i = 0; i < maxLength; i++) {
                if (i < pexelsItems.length) newItems.push(pexelsItems[i]);
                if (i < sourceSplashItems.length) newItems.push(sourceSplashItems[i]);
            }

            if (p === 1) setItems(newItems);
            else setItems(prev => [...prev, ...newItems]);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    useEffect(() => {
        setSearchRunId(prev => prev + 1);
        fetchSearchItems(1, searchQuery);
        setPage(1);
    }, [searchQuery, fetchSearchItems]);

    useEffect(() => {
        if (page > 1) fetchSearchItems(page, searchQuery);
    }, [page, fetchSearchItems, searchQuery]);

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
            <div className="discover-search-bar feed-search-bar-sticky" style={{ padding: '10px 15px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: 'none', background: 'var(--bg-secondary)', outline: 'none', color: 'var(--ig-font)' }}
                    />
                </div>
            </div>

            <div className="img-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                {items.map((item, i) => (
                    <div key={`${item.id}-${searchRunId}-${i}`} className="grid-item" ref={i === items.length - 1 ? lastRef : null}
                        onClick={() => onOpenPost({
                            id: item.id,
                            image: item.url,
                            caption: item.alt,
                            user: {
                                username: (item.author || (item.type === 'news' ? item.source : 'User')).toLowerCase().replace(/\s+/g, '_'),
                                pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author || item.source || 'U')}&background=random&color=fff`
                            },
                            likes: Math.floor(Math.random() * 5000),
                            comments: Math.floor(Math.random() * 200),
                            source: item.id.startsWith('ss-') ? 'SourceSplash' : (item.type === 'news' ? 'News' : 'Pexels')
                        })}
                        style={{ aspectRatio: '1/1', background: '#000', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                        <img src={freshImageUrl(item.url)} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {item.id.startsWith('ss-') && (
                            <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 4px', borderRadius: '4px', fontSize: '10px' }}>SS</div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default SearchGrid;
