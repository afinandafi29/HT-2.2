import React, { useState, useEffect } from 'react';

const getYTKey = () => {
  try {
    const saved = localStorage.getItem('adminApiKeys');
    if (saved) {
      const keys = JSON.parse(saved);
      return keys.youtube || import.meta.env.VITE_YT_API_KEY || 'AIzaSyDtLX6171RySOtqd-U2Pgcjy_9o2rWDNrc';
    }
  } catch (e) { /* ignore */ }
  return import.meta.env.VITE_YT_API_KEY || 'AIzaSyDtLX6171RySOtqd-U2Pgcjy_9o2rWDNrc';
};

const API_KEY = getYTKey();

const YouTubeContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageToken, setPageToken] = useState('');
  const [activeCategory, setActiveCategory] = useState('Reels');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { label: 'Reels', query: '#shorts' },
    { label: 'Live', query: 'live', eventType: 'live' },
    { label: 'All', query: 'trending' },
    { label: 'Music', query: 'official music videos' },
    { label: 'Gaming', query: 'gaming' },
    { label: 'Learning', query: 'educational' },
    { label: 'English', query: 'english speaking practice' }
  ];

  useEffect(() => {
    fetchVideos('#shorts', true);
  }, []);

  const fetchVideos = async (query = 'trending', reset = true, eventType = null) => {
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
        let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=${API_KEY}&type=video`;

        if (query) apiUrl += `&q=${encodeURIComponent(query)}`;
        if (token) apiUrl += `&pageToken=${token}`;
        if (eventType === 'live' || (activeCategory === 'Live' && !reset)) apiUrl += `&eventType=live`;

        const response = await fetch(apiUrl);

        if (response.ok) {
          data = await response.json();
          if (data.items) {
            fetchSuccess = true;
          }
        }
      } catch (apiError) { /* ignore */ }

      if (!fetchSuccess) {
        const mockVideos = generateMockVideos(query || 'trending', 10);
        if (reset) setVideos(mockVideos);
        else setVideos(prev => [...prev, ...mockVideos]);
        setPageToken('');
        setHasMore(false);
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
    } catch (err) {
      console.error('Error fetching videos:', err);
      const mockVideos = generateMockVideos(query || 'trending', 10);
      if (reset) setVideos(mockVideos);
      else setVideos(prev => [...prev, ...mockVideos]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockVideos = (query, count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
      id: { videoId: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', '9bZkp7q19f0', 'kJQP7kiw5Fk'][i % 4] },
      snippet: {
        title: `${query} - Premium Experience ${videos.length + i + 1}`,
        channelTitle: `Creator ${i + 1} ⭐`,
        thumbnails: {
          medium: { url: `https://picsum.photos/seed/${query}${i}/320/180` }
        },
        publishedAt: new Date().toISOString(),
        liveBroadcastContent: activeCategory === 'Live' ? 'live' : 'none'
      },
      isLive: activeCategory === 'Live'
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchVideos(searchQuery, true);
      setIsSearching(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.label);
    setSelectedVideo(null);
    fetchVideos(cat.query, true, cat.eventType);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      const currentCat = categories.find(c => c.label === activeCategory);
      fetchVideos(searchQuery || currentCat?.query || activeCategory, false, currentCat?.eventType);
    }
  };

  return (
    <div className="h-full bg-[#0f0f0f] text-white flex flex-col relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Premium Header - Logo REMOVED as per request */}
      {!isSearching ? (
        <div className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ff0000]/10 flex items-center justify-center">
              <i className="fab fa-youtube text-[#ff0000] text-xl"></i>
            </div>
            <span className="font-bold tracking-tight text-white/90">Premium</span>
          </div>
          <div className="flex items-center gap-4">
            <i className="fas fa-search text-white/70 text-lg cursor-pointer hover:text-white" onClick={() => setIsSearching(true)}></i>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20"></div>
          </div>
        </div>
      ) : (
        /* Better Search Bar - Matching Image style */
        <div className="sticky top-0 z-50 bg-[#0f0f0f] px-2 py-2 flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <button onClick={() => setIsSearching(false)} className="p-2 text-white/70 hover:text-white">
            <i className="fas fa-arrow-left"></i>
          </button>
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                autoFocus
                type="text"
                className="w-full bg-[#222] border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-white/20 outline-none"
                placeholder="Search YouTube"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                <i className="fas fa-search text-xs"></i>
              </button>
            </div>
          </form>
          <button className="p-2 w-9 h-9 rounded-full bg-[#222] flex items-center justify-center text-white/70">
            <i className="fas fa-microphone"></i>
          </button>
        </div>
      )}

      {/* Categories Bar */}
      <div className="sticky top-[56px] z-40 bg-[#0f0f0f]/95 backdrop-blur-sm py-2 px-3 overflow-x-auto no-scrollbar border-b border-white/5">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat.label
                ? 'bg-white text-black shadow-lg shadow-white/5'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar" onScroll={handleScroll}>
        {/* Video Player - Integrated in-app feel */}
        {selectedVideo && (
          <div className="sticky top-0 z-50 bg-black animate-in fade-in zoom-in duration-300">
            <div className="relative aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-2 right-2 bg-black/40 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-black/60 transition-colors"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            <div className="p-4 bg-[#0f0f0f] border-b border-white/10">
              <h3 className="text-[14px] font-semibold leading-tight text-white/95">{selectedVideo.snippet.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10"></div>
                <p className="text-[12px] text-white/60 font-medium">{selectedVideo.snippet.channelTitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Shimmer Loading or Video List */}
        {loading && videos.length === 0 ? (
          <div className="p-4 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-video bg-white/5 rounded-xl"></div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pb-20">
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="group flex flex-col p-4 active:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 mb-3 group-hover:shadow-2xl group-hover:shadow-red-500/5 transition-all duration-300">
                  <img src={video.snippet.thumbnails.medium.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="thumb" />
                  {video.isLive ? (
                    <div className="absolute top-2 left-2 bg-[#ff0000] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                      Live
                    </div>
                  ) : (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {Math.floor(Math.random() * 12)}:30
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium leading-snug text-white/90 line-clamp-2 md:line-clamp-none">{video.snippet.title}</h3>
                    <p className="text-[12px] text-white/40 mt-1 font-medium italic">
                      {video.snippet.channelTitle} • {video.isLive ? <span className="text-[#ff0000] font-bold">{Math.floor(Math.random() * 50) + 1}K watching</span> : `${Math.floor(Math.random() * 900)}K views`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="p-6 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#ff0000] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeContainer;