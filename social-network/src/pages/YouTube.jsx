import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/youtube-premium.css';

const API_KEY = import.meta.env.VITE_YT_API_KEY || 'AIzaSyAsQ7E02xCW3qAdxwHK2PLj-pppMfm9fBw';

const YouTube = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageToken, setPageToken] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      handleCategoryClick(categories[1]); // Default to 'Live' on mobile
    } else {
      fetchYouTubeVideos();
    }
  }, []);

  const fetchYouTubeVideos = async (query = 'trending videos', reset = true, eventType = null) => {
    try {
      if (reset) {
        setLoading(true);
        setVideos([]);
        setPageToken('');
      }

      const token = reset ? '' : pageToken;
      let fetchSuccess = false;
      let data = null;

      try {
        let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&key=${API_KEY}&type=video`;

        if (query) apiUrl += `&q=${encodeURIComponent(query)}`;
        if (token) apiUrl += `&pageToken=${token}`;
        if (eventType === 'live' || activeCategory === 'Live') apiUrl += `&eventType=live`;

        const response = await fetch(apiUrl);

        if (response.ok) {
          data = await response.json();
          if (data.items) {
            fetchSuccess = true;
          }
        }
      } catch (apiError) {
        console.log('YouTube API call failed, using fallback data...');
      }

      if (!fetchSuccess) {
        const mockVideos = generateMockVideos(query || 'trending');
        if (reset) setVideos(mockVideos);
        else setVideos(prev => [...prev, ...mockVideos]);
        setPageToken('');
        setHasMore(false);
        setError(null);
        return;
      }

      const formattedVideos = data.items.map(item => ({
        ...item,
        isLive: item.snippet.liveBroadcastContent === 'live' || eventType === 'live'
      }));

      if (reset) setVideos(formattedVideos);
      else setVideos(prev => [...prev, ...formattedVideos]);

      setPageToken(data.nextPageToken || '');
      setHasMore(!!data.nextPageToken);
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      const mockVideos = generateMockVideos(query || 'trending');
      if (reset) setVideos(mockVideos);
      else setVideos(prev => [...prev, ...mockVideos]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockVideos = (query) => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: { videoId: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', '9bZkp7q19f0', 'kJQP7kiw5Fk'][i % 4] },
      snippet: {
        title: `${query} - Premium Video Experience ${i + 1}`,
        channelTitle: `Creator ${i + 1} ⭐`,
        thumbnails: {
          medium: { url: `https://picsum.photos/seed/${query}${i}/320/180` }
        },
        publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
        liveBroadcastContent: (activeCategory === 'Live' || i % 5 === 0) ? 'live' : 'none'
      },
      isLive: activeCategory === 'Live' || i % 5 === 0
    }));
  };

  const categories = [
    { label: 'All', query: 'trending' },
    { label: 'Live', query: 'live', eventType: 'live' },
    { label: 'Music', query: 'official music videos' },
    { label: 'Gaming', query: 'gaming' },
    { label: 'Sports', query: 'sports highlights' },
    { label: 'Tech', query: 'tech reviews' },
    { label: 'News', query: 'world news' },
    { label: 'Mixes', query: 'lo-fi beats' },
    { label: 'Learning', query: 'programming' },
    { label: 'Nature', query: '4k nature' }
  ];

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.label);
    fetchYouTubeVideos(cat.query, true, cat.eventType);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchYouTubeVideos(searchQuery, true);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      const currentCat = categories.find(c => c.label === activeCategory);
      fetchYouTubeVideos(searchQuery || currentCat?.query || activeCategory, false, currentCat?.eventType);
    }
  };

  const formatViewCount = (count) => {
    if (count > 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count > 1000) return (count / 1000).toFixed(1) + 'K';
    return count;
  };

  return (
    <div className="yt-clone-container">
      {/* Header */}
      <header className="yt-header">
        <div className="yt-header-left">
          <div className="yt-menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="material-icons">menu</i>
          </div>
          <div className="yt-logo" onClick={() => navigate('/')}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" />
            <span>Premium</span>
          </div>
          <div className="yt-mobile-back" onClick={() => navigate('/')}>
            <i className="material-icons">arrow_back</i>
          </div>
        </div>

        <div className="yt-header-middle">
          <form className="yt-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="yt-search-input"
              placeholder="Search premium content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="yt-search-btn">
              <i className="material-icons">search</i>
            </button>
          </form>
          <div className="yt-mic-icon">
            <i className="material-icons">mic</i>
          </div>
        </div>

        <div className="yt-mobile-search-trigger" onClick={() => document.querySelector('.yt-mobile-search-bar').classList.toggle('active')}>
          <i className="material-icons">search</i>
        </div>

        <div className="yt-header-right">
          <div className="yt-action-icon"><i className="material-icons">videocam</i></div>
          <div className="yt-action-icon"><i className="material-icons">apps</i></div>
          <div className="yt-action-icon"><i className="material-icons">notifications</i></div>
          <div className="yt-profile"></div>
        </div>
      </header>

      {/* Mobile Search Bar - Specific style from image */}
      <div className="yt-mobile-search-bar">
        <div className="yt-msb-inner">
          <i className="material-icons" onClick={() => document.querySelector('.yt-mobile-search-bar').classList.remove('active')}>arrow_back</i>
          <form onSubmit={(e) => {
            handleSearch(e);
            document.querySelector('.yt-mobile-search-bar').classList.remove('active');
          }}>
            <input
              type="text"
              placeholder="Search YouTube"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
          <i className="material-icons">mic</i>
        </div>
      </div>

      <div className="yt-layout-body">
        {/* Sidebar */}
        <aside className="yt-sidebar" style={{ width: sidebarOpen ? '240px' : '82px' }}>
          <div className="yt-sidebar-section">
            <div className={`yt-sidebar-item ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => handleCategoryClick(categories[0])}>
              <i className="material-icons">home</i>
              {sidebarOpen && <span>Home</span>}
            </div>
            <div className={`yt-sidebar-item ${activeCategory === 'Live' ? 'active' : ''}`} onClick={() => handleCategoryClick(categories[1])}>
              <i className="material-icons">sensors</i>
              {sidebarOpen && <span>Live</span>}
            </div>
            <div className="yt-sidebar-item">
              <i className="material-icons">subscriptions</i>
              {sidebarOpen && <span>Subscriptions</span>}
            </div>
          </div>

          <div className="yt-sidebar-section">
            {sidebarOpen && <div className="yt-section-title">You</div>}
            <div className="yt-sidebar-item"><i className="material-icons">history</i>{sidebarOpen && <span>History</span>}</div>
            <div className="yt-sidebar-item"><i className="material-icons">playlist_play</i>{sidebarOpen && <span>Playlists</span>}</div>
            <div className="yt-sidebar-item"><i className="material-icons">watch_later</i>{sidebarOpen && <span>Watch Later</span>}</div>
            <div className="yt-sidebar-item"><i className="material-icons">thumb_up_off_alt</i>{sidebarOpen && <span>Liked Videos</span>}</div>
          </div>

          {sidebarOpen && (
            <div className="yt-sidebar-section">
              <div className="yt-section-title">Explore</div>
              <div className="yt-sidebar-item"><i className="material-icons">local_fire_department</i><span>Trending</span></div>
              <div className="yt-sidebar-item"><i className="material-icons">shopping_bag</i><span>Shopping</span></div>
              <div className="yt-sidebar-item"><i className="material-icons">music_note</i><span>Music</span></div>
              <div className="yt-sidebar-item"><i className="material-icons">movie</i><span>Movies</span></div>
              <div className="yt-sidebar-item"><i className="material-icons">sports_esports</i><span>Gaming</span></div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="yt-main" onScroll={handleScroll}>
          <div className="yt-categories-wrapper">
            <div className="yt-categories">
              {categories.map(cat => (
                <div
                  key={cat.label}
                  className={`yt-category-pill ${activeCategory === cat.label ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.label}
                </div>
              ))}
            </div>
          </div>

          <div className="yt-video-grid">
            {loading && videos.length === 0 ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="yt-skeleton-card">
                  <div className="yt-skeleton-thumb"></div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <div className="yt-channel-avatar" style={{ background: '#222' }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="yt-skeleton-thumb" style={{ height: '16px', width: '80%', marginBottom: '8px' }}></div>
                      <div className="yt-skeleton-thumb" style={{ height: '12px', width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              videos.map((video, index) => (
                <div key={`${video.id.videoId}-${index}`} className="yt-video-card" onClick={() => handleVideoClick(video)}>
                  <div className="yt-thumbnail-container">
                    <img src={video.snippet.thumbnails.medium.url} alt="Thumbnail" />
                    {video.isLive ? (
                      <div className="live-badge">Live</div>
                    ) : (
                      <div className="yt-duration">
                        {Math.floor(Math.random() * 10) + 1}:{String(Math.floor(Math.random() * 59)).padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  <div className="yt-video-info">
                    <div className="yt-channel-avatar"></div>
                    <div className="yt-video-details">
                      <h3>{video.snippet.title}</h3>
                      <div className="yt-channel-info">
                        {video.snippet.channelTitle}
                        <i className="material-icons" style={{ fontSize: '14px' }}>check_circle</i>
                      </div>
                      <div className="yt-meta-info">
                        {video.isLive ? (
                          <span style={{ color: 'var(--yt-red)' }}>{Math.floor(Math.random() * 50) + 1}K watching</span>
                        ) : (
                          <span>{Math.floor(Math.random() * 900) + 10}K views • {new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {loading && videos.length > 0 && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="yt-spinner"></div>
            </div>
          )}
        </main>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="yt-player-modal" onClick={(e) => {
          if (e.target.className === 'yt-player-modal') setSelectedVideo(null);
        }}>
          <button className="close-btn" onClick={() => setSelectedVideo(null)}>
            <i className="material-icons">close</i>
          </button>
          <div className="player-content">
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTube;

