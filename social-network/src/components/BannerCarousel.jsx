import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, EyeOff, Eye, ExternalLink } from 'lucide-react';
import { getBannersApi } from '../api/bannerApi';

const BannerCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const videoRef = useRef(null);
    const autoPlayIntervalRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getBannersApi();
                setBanners(data.filter(b => b.visible !== false));
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
        fetchBanners();

        // Auto-refresh banners every 5 seconds to show updates
        const intervalId = setInterval(fetchBanners, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, [banners.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        if (banners.length <= 1 || isCollapsed) return;

        // Auto-advance carousel for images/text
        // For videos, we rely on the 'ended' event listener
        const currentBanner = banners[currentIndex];

        if (isAutoPlaying && currentBanner?.type !== 'video') {
            autoPlayIntervalRef.current = setInterval(() => {
                handleNext();
            }, 5000); // Change every 5 seconds
        }

        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current);
            }
        };
    }, [currentIndex, banners, isAutoPlaying, isCollapsed, handleNext]);

    useEffect(() => {
        // Handle video ended event
        const video = videoRef.current;
        if (video && banners[currentIndex]?.type === 'video' && !isCollapsed) {
            const handleVideoEnd = () => {
                handleNext();
            };
            video.addEventListener('ended', handleVideoEnd);

            return () => {
                video.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [currentIndex, banners, isCollapsed, handleNext]);

    useEffect(() => {
        // Update video mute state
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, currentIndex]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (banners.length === 0) {
        return null;
    }

    if (isCollapsed) {
        return (
            <div className="w-full flex justify-center mb-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 font-bold rounded-full transition-all border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-pulse"
                >
                    <Eye size={20} />
                    <span>Show Updates</span>
                </button>
            </div>
        );
    }

    const currentBanner = banners[currentIndex];
    const isVideo = currentBanner?.type === 'video';
    const isText = currentBanner?.type === 'text';

    // Wrap content if link exists
    const ContentWrapper = ({ children }) => {
        if (currentBanner.link) {
            return (
                <a href={currentBanner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">
                    {children}
                </a>
            );
        }
        return <div className="w-full h-full">{children}</div>;
    };

    return (
        <div
            className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[280px] rounded-[24px] md:rounded-[40px] overflow-hidden group shadow-2xl transition-all duration-500 mb-8 border border-white/5"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <ContentWrapper>
                {/* Banner Content */}
                <div className="absolute inset-0">
                    {isVideo ? (
                        <video
                            ref={videoRef}
                            key={currentBanner.id}
                            src={currentBanner.url}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted={isMuted}
                            playsInline
                        />
                    ) : isText ? (
                        <div
                            className="w-full h-full flex items-center justify-center p-8 bg-cover bg-center"
                            style={{
                                background: currentBanner.background || 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                            }}
                        >
                            {/* Text is rendered below as overlay to keep consistent styling */}
                        </div>
                    ) : (
                        <img
                            src={currentBanner.url}
                            alt={currentBanner.name}
                            className="w-full h-full object-cover"
                        />
                    )}

                    {/* Text Overlay for all types */}
                    {currentBanner.text && (
                        <div className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none">
                            <h2 className="text-3xl md:text-5xl font-black text-white text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight tracking-tight uppercase" style={{ textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                                {currentBanner.text}
                            </h2>
                        </div>
                    )}

                    {/* Link Indicator */}
                    {currentBanner.link && (
                        <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest border border-white/10">
                                <span>Learn More</span>
                                <ExternalLink size={14} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </ContentWrapper>


            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all opacity-0 group-hover:opacity-100 z-30"
                    >
                        <ChevronLeft className="text-white" size={28} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all opacity-0 group-hover:opacity-100 z-30"
                    >
                        <ChevronRight className="text-white" size={28} />
                    </button>
                </>
            )}

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-30">
                {/* Mute/Unmute Button (only for videos) */}
                {isVideo && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all"
                    >
                        {isMuted ? (
                            <VolumeX className="text-white" size={20} />
                        ) : (
                            <Volume2 className="text-white" size={20} />
                        )}
                    </button>
                )}

                {/* Hide Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }}
                    className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all"
                    title="Hide Banner"
                >
                    <EyeOff className="text-white" size={20} />
                </button>
            </div>


            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 pointer-events-none">
                    {banners.map((_, index) => (
                        <div
                            key={index}
                            className={`transition-all rounded-full border border-black/10 ${index === currentIndex
                                ? 'w-8 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerCarousel;
