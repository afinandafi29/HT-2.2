import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Radio, CheckCircle, Heart, MessageCircle, Share2 } from 'lucide-react';

const LiveSection = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState('');
    const [interactions, setInteractions] = useState({});
    const [activeIdx, setActiveIdx] = useState(0);
    const observer = useRef();

    const fetchLive = async (pageToken = '') => {
        try {
            setLoading(true);
            const YT_KEY = import.meta.env.VITE_YT_API_KEY;
            const queries = ['breaking news live', 'crypto live', 'gaming live', 'lofi hip hop live'];
            const query = queries[Math.floor(Math.random() * queries.length)];

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&eventType=live&key=${YT_KEY}&pageToken=${pageToken}`
            );
            const data = await response.json();
            if (data.items) {
                const newVideos = data.items.map(item => ({
                    id: item.id.videoId,
                    username: item.snippet.channelTitle,
                    desc: item.snippet.title,
                    pic: `https://i.pravatar.cc/150?u=${item.id.videoId}`
                }));
                setVideos(prev => [...prev, ...newVideos]);
                setNextPageToken(data.nextPageToken || '');
            }
        } catch (error) {
            console.error('Live Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLive();
    }, []);

    const lastReelRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPageToken) {
                fetchLive(nextPageToken);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, nextPageToken]);

    const handleScroll = (e) => {
        const container = e.target;
        const index = Math.round(container.scrollTop / container.clientHeight);
        if (index !== activeIdx) setActiveIdx(index);
    };

    const toggle = (id, field) => {
        setInteractions(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: !prev[id]?.[field] }
        }));
    };

    if (loading && videos.length === 0) return null;

    return (
        <div className="shorts-scroll-container" onScroll={handleScroll}>
            {videos.map((video, idx) => (
                <div key={`${video.id}-${idx}`} className="reel-container" ref={idx === videos.length - 1 ? lastReelRef : null} style={{ height: '100%', scrollSnapAlign: 'start' }}>
                    <div className="reel-section" style={{ height: '100%', width: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#000' }}>
                            {activeIdx === idx ? (
                                <iframe
                                    className="iframe-reel"
                                    width="100%" height="100%"
                                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0&modestbranding=1&rel=0`}
                                    frameBorder="0" allow="autoplay; encrypted-media" title="Video"
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <img src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.8 }}>
                                        <Radio size={48} color="#ef4444" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="post-section">
                            <div className="pshead" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                    <h4 style={{ color: '#fff', fontSize: '28px', fontWeight: '900', textShadow: '0 4px 8px rgba(0,0,0,0.8)', letterSpacing: '1px' }}>LIVE</h4>
                                </div>
                                <button className="iconbtn" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}><Camera size={24} color="white" /></button>
                            </div>
                            <div className="psfooter" style={{ padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                                <div className="usrProfile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="uplogo" style={{ border: '2px solid #ef4444', width: '45px', height: '45px' }}><img src={video.pic} alt="" /></div>
                                        <div>
                                            <p style={{ color: '#fff', fontWeight: '700', fontSize: '18px', margin: 0 }}>{video.username} <CheckCircle size={14} color="#3b82f6" fill="#3b82f6" /></p>
                                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Live Streaming</span>
                                        </div>
                                    </div>
                                    <button style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>SUBSCRIBE</button>
                                </div>
                                <p style={{ color: '#eee', fontSize: '15px', marginTop: '12px', textShadow: '0 1px 3px rgba(0,0,0,0.8)', lineHeight: '1.4' }}>{video.desc}</p>
                            </div>
                            <div className="action-btn" style={{ right: '15px', bottom: '40px', zIndex: 10 }}>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '25px', alignItems: 'center' }}>
                                    <li>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <button className="iconbtn" onClick={() => toggle(video.id, 'liked')} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                <Heart size={28} fill={interactions[video.id]?.liked ? '#3b82f6' : 'none'} color={interactions[video.id]?.liked ? '#3b82f6' : 'white'} />
                                            </button>
                                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>LIVE</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <button className="iconbtn" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                <MessageCircle size={28} color="white" />
                                            </button>
                                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>Chat</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <button className="iconbtn" onClick={() => toggle(video.id, 'shared')} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                <Share2 size={28} color="white" />
                                            </button>
                                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>Share</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LiveSection;
