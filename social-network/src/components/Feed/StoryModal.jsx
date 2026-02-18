import React, { useEffect, useRef, useState } from 'react';
import { Heart, Send, X } from 'lucide-react';
import "../../styles/NewFeed.css";

const StoryModal = ({ isOpen, stories, activeIndex, onClose, onNext, onPrev }) => {
    const scrollerRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [liked, setLiked] = useState(false);
    const timerRef = useRef(null);

    // Ensure activeIndex is valid
    const currentStory = stories[activeIndex];

    // Scroll to active index
    useEffect(() => {
        if (scrollerRef.current && isOpen) {
            const width = scrollerRef.current.offsetWidth;
            scrollerRef.current.scrollTo({ left: width * activeIndex, behavior: 'smooth' });
            setProgress(0);
            // Reset like state for new story (in a real app, fetch from backend)
            setLiked(false);
        }
    }, [activeIndex, isOpen]);

    // Timer for auto-advance
    useEffect(() => {
        if (!isOpen) return;

        const duration = 5000; // 5 seconds per story
        const interval = 50;

        timerRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timerRef.current);
                    onNext();
                    return 0;
                }
                return prev + (100 / (duration / interval));
            });
        }, interval);

        return () => clearInterval(timerRef.current);
    }, [activeIndex, isOpen, onNext]);

    if (!isOpen || !currentStory) return null;

    return (
        <div className="story-modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#1a1a1a', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            {/* Close Button */}
            <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 3001, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={32} />
            </button>

            <div className="app-container-story" style={{
                width: '100%', maxWidth: '430px', height: '100%', maxHeight: '932px',
                position: 'relative', background: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
            }}>

                {/* Static Header */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 20, padding: '16px',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)'
                }}>
                    {/* Progress Bars */}
                    <div className="progress-bar-group" style={{ display: 'flex', gap: '4px', marginBottom: '12px', marginTop: '10px' }}>
                        {stories.map((_, idx) => (
                            <div key={idx} className="bar" style={{
                                height: '2px', flex: 1, borderRadius: '2px',
                                background: idx < activeIndex ? '#ffffff' : idx === activeIndex ? `rgba(255,255,255,${0.3 + (progress / 140)})` : 'rgba(255,255,255,0.3)',
                                position: 'relative'
                            }}>
                                {idx === activeIndex && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, height: '100%',
                                        background: '#ffffff', width: `${progress}%`, transition: 'width 0.05s linear'
                                    }}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="story-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={currentStory.user.pic} className="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #fff', objectFit: 'cover' }} alt="" />
                            <span className="username" style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{currentStory.user.username}</span>
                            <span className="time" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>2h</span>
                        </div>
                    </div>
                </div>

                {/* Scroller Content */}
                <div className="story-scroller" ref={scrollerRef} style={{
                    flex: 1, display: 'flex', overflowX: 'auto',
                    scrollSnapType: 'x mandatory', scrollbarWidth: 'none', cursor: 'grab'
                }}>
                    {stories.map((story, i) => (
                        <div key={i} className="slide" style={{
                            flex: '0 0 100%', width: '100%', height: '100%',
                            scrollSnapAlign: 'start', position: 'relative', background: '#333'
                        }}>
                            {/* Click Zones */}
                            <div style={{ position: 'absolute', top: '100px', bottom: '100px', left: 0, width: '30%', zIndex: 9 }} onClick={onPrev}></div>
                            <div style={{ position: 'absolute', top: '100px', bottom: '100px', right: 0, width: '30%', zIndex: 9 }} onClick={onNext}></div>

                            <img src={story.image} className="main-content" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} alt="Story" />
                        </div>
                    ))}
                </div>

                {/* Static Footer */}
                <div className="story-footer" style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 20,
                    padding: '20px', paddingBottom: '30px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                    <div className="reply-box" style={{
                        flexGrow: 1, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '25px',
                        padding: '10px 18px', color: 'white', fontSize: '14px', background: 'rgba(0,0,0,0.2)'
                    }}>
                        Send message...
                    </div>
                    <button className={`icon-btn ${liked ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
                        <Heart size={26} fill={liked ? '#ff3040' : 'none'} color={liked ? '#ff3040' : 'white'} />
                    </button>
                    <button className="icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
                        <Send size={26} color="white" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StoryModal;
