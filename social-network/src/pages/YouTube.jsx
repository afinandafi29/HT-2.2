import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './YouTubeClone.css';

const YouTube = () => {
    const [videos, setVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [contentType, setContentType] = useState('videos'); // 'videos', 'shorts', 'live'
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextPageToken, setNextPageToken] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const scrollSentinelRef = useRef(null);
    const navigate = useNavigate();

    const YT_KEY = 'AIzaSyDtLX6171RySOtqd-U2Pgcjy_9o2rWDNrc';

    const categories = [
        'All', 'Music', 'Mixes', 'Malayalam cinema', 'Tamil Cinema',
        'Gaming', 'News', 'JavaScript', 'ReactJs', 'Python',
        'Web Development', 'AI & ML', 'Live Coding', 'Tech News'
    ];

    const fetchVideos = useCallback(async (query = '', pageToken = '', append = false) => {
        try {
            if (append) setLoadingMore(true);
            else setLoading(true);
            const searchQuery = query || (selectedCategory === 'All' ? 'trending' : selectedCategory);

            let apiUrl = '';
            if (contentType === 'live') {
                apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&eventType=live&key=${YT_KEY}&pageToken=${pageToken}`;
            } else if (contentType === 'shorts') {
                apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery + ' shorts')}&type=video&videoDuration=short&key=${YT_KEY}&pageToken=${pageToken}`;
            } else {
                apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(searchQuery)}&type=video&order=date&key=${YT_KEY}&pageToken=${pageToken}`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.items) {
                if (append) {
                    setVideos(prev => [...prev, ...data.items]);
                } else {
                    setVideos(data.items);
                }
                setNextPageToken(data.nextPageToken || '');
            }
        } catch (error) {
            console.error('YouTube API Error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategory, contentType]);

    useEffect(() => {
        setNextPageToken('');
        fetchVideos();
    }, [selectedCategory, contentType, fetchVideos]);

    // Infinite scroll: load more when sentinel is visible
    useEffect(() => {
        if (!nextPageToken || loading || loadingMore) return;
        const el = scrollSentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const q = searchTerm || (selectedCategory === 'All' ? '' : selectedCategory);
                    fetchVideos(q, nextPageToken, true);
                }
            },
            { rootMargin: '200px', threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [nextPageToken, loading, loadingMore, searchTerm, selectedCategory, fetchVideos]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            fetchVideos(searchTerm);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSearchTerm('');
    };

    const [activeVideoId, setActiveVideoId] = useState(null);

    const handleVideoClick = (videoId) => {
        setActiveVideoId(videoId);
    };

    return (
        <div className="youtube-dark-wrapper">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

            {/* Top Header */}
            <header className="yt-header">
                <div className="yt-left-section">
                    <i className="material-icons yt-menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>menu</i>
                    <div className="yt-logo-container" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 90 20" className="yt-logo-svg">
                            <g>
                                <path fill="#FF0000" d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
                                <path fill="#FFFFFF" d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" />
                            </g>
                            <g>
                                <path fill="#FFFFFF" d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z" />
                                <path fill="#FFFFFF" d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0508 7.34234 47.2765 8.15137C47.5023 8.96275 47.6176 10.0422 47.6176 11.3898V13.2078C47.6176 14.5437 47.5023 15.6161 47.2765 16.4251C47.0508 17.2365 46.6508 17.8292 46.0887 18.2031C45.5243 18.5771 44.7905 18.7652 43.8828 18.7652C42.9514 18.7675 42.0365 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8123 7.7351C43.4219 7.7351 43.1468 7.94206 42.9914 8.35833C42.8337 8.77461 42.7561 9.43077 42.7561 10.3292V14.2309C42.7561 15.1575 42.8337 15.8254 42.9914 16.2323C43.1468 16.6415 43.4242 16.8461 43.8123 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z" />
                                <path fill="#FFFFFF" d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z" />
                                <path fill="#FFFFFF" d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z" />
                                <path fill="#FFFFFF" d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z" />
                                <path fill="#FFFFFF" d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7588 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z" />
                                <path fill="#FFFFFF" d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z" />
                            </g>
                        </svg>
                    </div>
                </div>

                <div className="yt-search-container">
                    <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <input
                            type="text"
                            className="yt-search-bar"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="yt-search-btn">
                            <i className="material-icons">search</i>
                        </button>
                        <i className="material-icons yt-mic-icon">mic</i>
                    </form>
                </div>

                <div className="yt-right-section">
                    <i className="material-icons">video_call</i>
                    <i className="material-icons">notifications</i>
                    <i className="material-icons yt-user-icon">account_circle</i>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`yt-sidebar ${sidebarOpen ? '' : 'yt-sidebar-closed'}`}>
                <div className="yt-nav-item yt-nav-active" onClick={() => setContentType('videos')}>
                    <i className="material-icons">home</i> Home
                </div>
                <div className="yt-nav-item" onClick={() => setContentType('shorts')}>
                    <i className="material-icons">movie</i> Shorts
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">subscriptions</i> Subscriptions
                </div>
                <hr className="yt-divider" />
                <div className="yt-nav-item" onClick={() => setContentType('live')}>
                    <i className="material-icons">sensors</i> Live
                </div>
                <div className="yt-nav-item">
                    You <i className="material-icons" style={{ fontSize: '16px', marginLeft: '5px' }}>chevron_right</i>
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">history</i> History
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">playlist_play</i> Playlists
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">watch_later</i> Watch Later
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">thumb_up</i> Liked Videos
                </div>
                <hr className="yt-divider" />
                <div className="yt-subscriptions-title">Subscriptions</div>
                <div className="yt-nav-item">
                    <div className="yt-channel-small-icon"></div> T-Series
                </div>
                <div className="yt-nav-item">
                    <div className="yt-channel-small-icon"></div> Movie Mania
                </div>
                <div className="yt-nav-item">
                    <div className="yt-channel-small-icon"></div> Tech Channel
                </div>
                <hr className="yt-divider" />
                <div className="yt-subscriptions-title">Explore</div>
                <div className="yt-nav-item">
                    <i className="material-icons">local_fire_department</i> Trending
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">shopping_bag</i> Shopping
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">music_note</i> Music
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">movie_creation</i> Movies
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">sports_esports</i> Gaming
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">newspaper</i> News
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">emoji_events</i> Sports
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">lightbulb</i> Learning
                </div>
                <hr className="yt-divider" />
                <div className="yt-nav-item">
                    <i className="material-icons">settings</i> Settings
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">flag</i> Report history
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">help</i> Help
                </div>
                <div className="yt-nav-item">
                    <i className="material-icons">feedback</i> Send feedback
                </div>
            </aside>

            {/* Main Content */}
            <main className={`yt-main ${sidebarOpen ? '' : 'yt-main-full'}`}>
                {/* Content Type Indicator */}
                <div style={{ padding: '10px 0', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                    {contentType === 'live' && '🔴 Live Now'}
                    {contentType === 'shorts' && '📱 Shorts'}
                    {contentType === 'videos' && '🎬 Videos'}
                </div>

                {/* Filter Chips */}
                <div className="yt-filters">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className={`yt-filter-chip ${selectedCategory === category ? 'yt-filter-active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                {/* Video Grid */}
                <div className="yt-video-grid">
                    {activeVideoId ? (
                        <div className="inline-player-container" style={{ gridColumn: '1/-1', width: '100%', aspectRatio: '16/9', marginBottom: '20px', position: 'relative' }}>
                            <button
                                onClick={() => setActiveVideoId(null)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff0000', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', zIndex: 101 }}
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
                    {loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#aaa' }}>
                            Loading {contentType}...
                        </div>
                    )}

                    {!loading && videos.map((video) => (
                        <div
                            key={video.id.videoId}
                            className="yt-video-card"
                            onClick={() => handleVideoClick(video.id.videoId)}
                        >
                            <div className="yt-thumbnail">
                                <img
                                    src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url}
                                    alt={video.snippet.title}
                                />
                                {contentType === 'live' && (
                                    <div className="yt-live-badge">
                                        <span>🔴 LIVE</span>
                                    </div>
                                )}
                                {contentType === 'shorts' && (
                                    <div className="yt-shorts-badge">
                                        <i className="material-icons">movie</i>
                                    </div>
                                )}
                            </div>
                            <div className="yt-video-info">
                                <div className="yt-channel-icon-small"></div>
                                <div className="yt-video-text">
                                    <h3>{video.snippet.title}</h3>
                                    <div className="yt-video-meta">{video.snippet.channelTitle}</div>
                                    <div className="yt-video-meta">
                                        {new Date(video.snippet.publishedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Infinite scroll sentinel */}
                {!loading && videos.length > 0 && nextPageToken && (
                    <div ref={scrollSentinelRef} style={{ gridColumn: '1 / -1', minHeight: '20px', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        {loadingMore && <span style={{ color: '#aaa' }}>Loading more...</span>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default YouTube;
