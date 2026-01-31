import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserProfileApi } from '../../api/userApi';
import ChatInterface from '../Chat/ChatInterface';
import NotificationList from '../Notifications/NotificationList';

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isStandalone) {
            setShowInstallButton(false);
        } else if (isIosDevice) {
            setShowInstallButton(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setShowInstallButton(false);
        setDeferredPrompt(null);
    };

    if (!showInstallButton) return null;

    return (
        <>
            <button onClick={handleInstallClick} className="menu-item-small border-[#38bdf8]/30 bg-[#38bdf8]/10 group">
                <i className="fas fa-download text-[#38bdf8] text-lg transition-transform group-hover:scale-110"></i>
                <span className="text-[#38bdf8] font-bold">INSTALL</span>
            </button>

            {showIOSInstructions && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setShowIOSInstructions(false)}>
                    <div className="w-full max-w-sm rounded-[32px] bg-[#0f172a] p-8 text-center shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="mb-6 flex justify-center text-[#38bdf8]">
                            <i className="fas fa-download text-5xl"></i>
                        </div>
                        <h3 className="mb-3 text-2xl font-black text-white uppercase tracking-tight">Install HAPPYY TALK</h3>
                        <p className="mb-8 text-gray-400 font-medium">Add to your Home Screen for the best experience.</p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]">1</span>
                                <span className="text-gray-300 font-medium text-sm">Tap <span className="text-white font-bold">Share</span> in Safari</span>
                            </div>
                            <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]">2</span>
                                <span className="text-gray-300 font-medium text-sm">Tap <span className="text-white font-bold">Add to Home Screen</span></span>
                            </div>
                        </div>
                        <button onClick={() => setShowIOSInstructions(false)} className="mt-10 w-full rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] py-4 font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">Got it</button>
                    </div>
                </div>
            )}
        </>
    );
};

const RightSidebar = ({ isOpen, onClose, onCreateRoomClick }) => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [activeView, setActiveView] = useState('profile'); // 'profile' or 'chat'

    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
            const swipeDistance = touchStartX - touchEndX;
            const threshold = 100;

            if (swipeDistance > threshold && !isOpen) {
                // Swipe Left (Open Right Sidebar)
                const isEdgeSwipe = touchStartX > window.innerWidth - 50;
                if (isEdgeSwipe || window.innerWidth <= 768) {
                    onClose(); // Invert logic if needed, but here onClose is actually a toggle or open
                    // Actually onClose is passed as toggleRightSidebar in Layout.
                }
            } else if (swipeDistance < -threshold && isOpen) {
                // Swipe Right (Close Right Sidebar)
                onClose();
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isOpen, onClose]);

    const handleFeatureClick = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    return (
        <>
            <aside className={`right-sidebar ${isOpen ? 'active' : ''}`}>
                <div className="right-sidebar-header flex justify-between items-center pr-4">
                    <button onClick={onClose} className="close-btn">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="right-sidebar-content custom-scrollbar h-full flex flex-col">
                    {/* Toggle between views */}
                    {activeView === 'notifications' ? (
                        <NotificationList
                            onClose={() => setActiveView('profile')}
                        />
                    ) : (
                        <>
                            {currentUser ? (
                                <div className="user-overview">
                                    {/* ... existing user profile ... */}
                                    <div className="user-header-vertical flex flex-col items-center text-center p-4">
                                        <img
                                            src={profileData?.avatar_url || currentUser?.avatar_url || "https://via.placeholder.com/150"}
                                            alt="Avatar"
                                            className="user-avatar-large w-20 h-20 rounded-full border-2 border-blue-500 shadow-lg mb-3"
                                        />
                                        <div className="user-info-vertical w-full">
                                            <div className="flex flex-col items-center justify-center gap-1 mb-2">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                                    {profileData?.username || currentUser?.username}
                                                </h3>
                                                <button
                                                    onClick={() => handleFeatureClick('/profile')}
                                                    className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mt-1"
                                                >
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Edit Profile</span>
                                                </button>
                                            </div>
                                            <p className="user-email text-[12px] text-gray-400 font-medium break-all mb-3 px-4 leading-relaxed">
                                                {currentUser?.email || 'cupyragu@denipl.com'}
                                            </p>
                                            <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-white/5 w-full">
                                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                                                <span className="text-[11px] text-green-500 font-black uppercase tracking-widest">Active Now</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="quick-stats grid grid-cols-3 gap-2 px-4 mb-6">
                                        <div className="stat-card-mini flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                                            <span className="text-white font-black text-lg">{profileData?.posts_count || 0}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Posts</span>
                                        </div>
                                        <div className="stat-card-mini flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                                            <span className="text-white font-black text-lg">{profileData?.followers_count || 0}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Followers</span>
                                        </div>
                                        <div className="stat-card-mini flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                                            <span className="text-white font-black text-lg">{profileData?.following_count || 0}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Following</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="guest-view p-8 text-center">
                                    <p className="text-gray-400 mb-4">Sign in to unlock your profile and see your stats!</p>
                                    <button onClick={() => handleFeatureClick('/in')} className="auth-btn w-full">Sign In</button>
                                </div>
                            )}

                            <div className="menu-group px-4">
                                <p className="group-label text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-3">Navigation</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setActiveView('notifications')} className="menu-item-small border-yellow-500/30 bg-yellow-500/10">
                                        <i className="fas fa-bell text-yellow-500 text-lg"></i>
                                        <span className="font-bold">ALERTS</span>
                                    </button>
                                    <button onClick={() => {
                                        onClose();
                                        window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL'));
                                    }} className="menu-item-small border-blue-500/30 bg-blue-500/10">
                                        <i className="fas fa-comment text-blue-400 text-lg"></i>
                                        <span className="font-bold">CHAT</span>
                                    </button>
                                    <button onClick={() => handleFeatureClick('/feed')} className="menu-item-small">
                                        <i className="fas fa-rss"></i>
                                        <span>FEED</span>
                                    </button>
                                    <button onClick={() => handleFeatureClick('/news')} className="menu-item-small">
                                        <i className="fas fa-newspaper"></i>
                                        <span>NEWS</span>
                                    </button>
                                    <button onClick={() => handleFeatureClick('/1to1')} className="menu-item-small">
                                        <i className="fas fa-phone"></i>
                                        <span>1-to-1 Call</span>
                                    </button>
                                    <button onClick={() => handleFeatureClick('/youtube')} className="menu-item-small">
                                        <span className="font-black text-[10px]">YOUTUBE</span>
                                    </button>
                                    <PWAInstallButton />
                                </div>

                                <div className="mt-4 flex flex-col gap-2 pb-10">
                                    <button onClick={() => handleFeatureClick('/premium')} className="menu-item gradient w-full py-4 rounded-2xl flex items-center justify-center gap-2">
                                        <i className="fas fa-crown"></i>
                                        <span className="font-bold uppercase tracking-widest text-sm">Premium</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onCreateRoomClick();
                                            onClose();
                                        }}
                                        className="menu-item w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 text-blue-400"
                                    >
                                        <i className="fas fa-plus-circle"></i>
                                        <span className="font-bold uppercase tracking-widest text-sm">CREATE NEW ROOM</span>
                                    </button>
                                    {currentUser && (
                                        <button
                                            onClick={handleLogout}
                                            className="menu-item w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center justify-center gap-2 text-red-500"
                                        >
                                            <i className="fas fa-power-off"></i>
                                            <span className="font-bold uppercase tracking-widest text-sm">LOGOUT</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </aside >
            {isOpen && <div className="right-sidebar-overlay" onClick={onClose}></div>}
        </>
    );
};

export default RightSidebar;
