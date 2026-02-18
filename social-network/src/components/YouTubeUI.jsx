import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/YouTubeUI.css';

const YouTubeUI = ({ onBack }) => {
    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(false);
    const [nextPageToken, setNextPageToken] = useState('');

    // Observer for infinite scroll
    const observer = useRef();

    const getYTKey = () => {
        try {
            const saved = localStorage.getItem('adminApiKeys');
            if (saved) {
                const keys = JSON.parse(saved);
                return keys.youtube || import.meta.env.VITE_YT_API_KEY;
            }
        } catch (e) { /* ignore */ }
        return import.meta.env.VITE_YT_API_KEY;
    };

    const API_KEY = getYTKey();

    const categories = [
        'All', 'Music', 'Gaming', 'Mixes', 'News', 'Live', 'Tech', 'ReactJS', 'Python', 'Movies', 'Sports', 'Fashion', 'Learning'
    ];

    const fetchVideos = useCallback(async (query = '', pageToken = '') => {
        if (loading) return;
        try {
            setLoading(true);
            const searchQuery = query || (selectedCategory === 'All' ? 'trending' : selectedCategory);

            let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&key=${API_KEY}`;
            if (query === 'live' || selectedCategory === 'Live') {
                apiUrl += `&eventType=live`;
            } else {
                apiUrl += `&order=date`;
            }
            if (pageToken) apiUrl += `&pageToken=${pageToken}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.items) {
                setVideos(prev => pageToken ? [...prev, ...data.items] : data.items);
                setNextPageToken(data.nextPageToken || '');
            }
        } catch (error) {
            console.error('YouTube API Error:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, API_KEY]);

    useEffect(() => {
        fetchVideos();
    }, [selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setVideos([]); // Clear current videos for new search
            fetchVideos(searchTerm);
        }
    };

    const handleCategoryClick = (category) => {
        if (category === selectedCategory) return;
        setVideos([]); // Clear videos on category change
        setSelectedCategory(category);
        setSearchTerm('');
    };

    const [activeVideoId, setActiveVideoId] = useState(null);

    const handleVideoClick = (videoId) => {
        setActiveVideoId(videoId);
    };

    // Infinite Scroll Logic
    const lastVideoRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPageToken) {
                fetchVideos(searchTerm || selectedCategory, nextPageToken);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, nextPageToken, fetchVideos, searchTerm, selectedCategory]);

    return (
        <div className="youtube-clone-wrapper">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

            <header>
                <div className="left-section">
                    <i className="material-icons" onClick={onBack} style={{ cursor: 'pointer' }}>menu</i>
                    <div className="yt-logo-container" onClick={onBack} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                            alt="YouTube"
                            width="90"
                        />
                    </div>
                </div>
                <div className="search-container">
                    <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="search-btn"><i className="material-icons">search</i></button>
                    </form>
                    <div style={{ marginLeft: '16px', background: '#181818', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <i className="material-icons" style={{ fontSize: 24 }}>mic</i>
                    </div>
                </div>
                <div className="right-section">
                    <i className="material-icons">video_call</i>
                    <i className="material-icons">notifications</i>
                    <div className="channel-icon" style={{ background: '#FF0000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>H</div>
                </div>
            </header>

            <aside>
                <div className={`nav-item ${selectedCategory === 'All' ? 'active' : ''}`} onClick={() => handleCategoryClick('All')}><i className="material-icons">home</i> Home</div>
                <div className="nav-item"><i className="material-icons">explore</i> Shorts</div>
                <div className="nav-item"><i className="material-icons">subscriptions</i> Subscriptions</div>
                <hr />
                <div className="nav-item">You <i className="material-icons" style={{ fontSize: '16px', marginLeft: 'auto' }}>chevron_right</i></div>
                <div className="nav-item"><i className="material-icons">history</i> History</div>
                <div className="nav-item"><i className="material-icons">playlist_play</i> Playlists</div>
                <div className="nav-item"><i className="material-icons">smart_display</i> Your Videos</div>
                <div className="nav-item"><i className="material-icons">watch_later</i> Watch Later</div>
                <div className="nav-item"><i className="material-icons">thumb_up</i> Liked Videos</div>
                <hr />
                <div style={{ paddingLeft: '12px', marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Subscriptions</div>
                <div className="nav-item">
                    <div className="channel-icon" style={{ width: '24px', height: '24px', marginRight: '20px', background: 'url(https://ui-avatars.com/api/?name=Music&background=random) center/cover' }}></div> Music
                </div>
                <div className="nav-item">
                    <div className="channel-icon" style={{ width: '24px', height: '24px', marginRight: '20px', background: 'url(https://ui-avatars.com/api/?name=Gaming&background=random) center/cover' }}></div> Gaming
                </div>
                <div className="nav-item">
                    <div className="channel-icon" style={{ width: '24px', height: '24px', marginRight: '20px', background: 'url(https://ui-avatars.com/api/?name=Tech&background=random) center/cover' }}></div> Tech
                </div>
                <div className="nav-item">
                    <div className="channel-icon" style={{ width: '24px', height: '24px', marginRight: '20px', background: 'url(https://ui-avatars.com/api/?name=News&background=random) center/cover' }}></div> News
                </div>
                <hr />
                <div className="nav-item"><i className="material-icons">settings</i> Settings</div>
                <div className="nav-item"><i className="material-icons">flag</i> Report History</div>
                <div className="nav-item"><i className="material-icons">help</i> Help</div>
                <div className="nav-item"><i className="material-icons">feedback</i> Send feedback</div>
            </aside>

            <main>
                <div className="filters">
                    {categories.map(cat => (
                        <div
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>

                <div className="video-grid">
                    {activeVideoId ? (
                        <div className="inline-player-container" style={{ gridColumn: '1/-1', width: '100%', aspectRatio: '16/9', marginBottom: '20px', position: 'relative' }}>
                            <button
                                onClick={() => setActiveVideoId(null)}
                                style={{ position: 'absolute', top: '-40px', right: '0', background: '#ff0000', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}
                            >
                                Close Player
                            </button>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: '12px' }}
                            ></iframe>
                        </div>
                    ) : null}
                    {loading && videos.length === 0 ? (
                        <div style={{ color: 'white', padding: '40px', gridColumn: '1/-1', textAlign: 'center' }}>
                            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#ff0000', animation: 'spin 1s ease-in-out infinite' }}></div>
                        </div>
                    ) : (
                        videos.map((video, index) => {
                            if (videos.length === index + 1) {
                                return (
                                    <div ref={lastVideoRef} className="video-card" key={`${video.id.videoId}-${index}`} onClick={() => handleVideoClick(video.id.videoId)}>
                                        <div className="thumbnail">
                                            <img
                                                src={video.snippet.thumbnails.medium.url}
                                                alt={video.snippet.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                                            />
                                            {selectedCategory === 'Live' && <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'red', color: 'white', padding: '2px 5px', borderRadius: 4, fontSize: 12 }}>LIVE</span>}
                                        </div>
                                        <div className="video-info">
                                            <div className="channel-icon" style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=${video.snippet.channelTitle}&background=random)`, backgroundSize: 'cover' }}></div>
                                            <div className="video-text">
                                                <h3 dangerouslySetInnerHTML={{ __html: video.snippet.title }}></h3>
                                                <div className="video-meta">{video.snippet.channelTitle}</div>
                                                <div className="video-meta">
                                                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="video-card" key={`${video.id.videoId}-${index}`} onClick={() => handleVideoClick(video.id.videoId)}>
                                        <div className="thumbnail">
                                            <img
                                                src={video.snippet.thumbnails.medium.url}
                                                alt={video.snippet.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                                            />
                                            {selectedCategory === 'Live' && <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'red', color: 'white', padding: '2px 5px', borderRadius: 4, fontSize: 12 }}>LIVE</span>}
                                        </div>
                                        <div className="video-info">
                                            <div className="channel-icon" style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=${video.snippet.channelTitle}&background=random)`, backgroundSize: 'cover' }}></div>
                                            <div className="video-text">
                                                <h3 dangerouslySetInnerHTML={{ __html: video.snippet.title }}></h3>
                                                <div className="video-meta">{video.snippet.channelTitle}</div>
                                                <div className="video-meta">
                                                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    )}
                </div>
                {loading && videos.length > 0 && (
                    <div style={{ color: 'white', padding: '20px', textAlign: 'center', width: '100%' }}>
                        <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#ff0000', animation: 'spin 1s ease-in-out infinite' }}></div>
                    </div>
                )}
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </main>
        </div>
    );
};

export default YouTubeUI;
