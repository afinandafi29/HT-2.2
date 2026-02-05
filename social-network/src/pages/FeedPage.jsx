// v2 - Triggering Vite refresh
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { newsApi } from '../api/newsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, PlusSquare, User, RefreshCw, Camera, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Moon, Sun, Menu, X, Compass, Radio, Youtube } from 'lucide-react';
import YouTubeUI from '../components/YouTubeUI';
import '../styles/feed-page.css';

const NAME_REGISTRY = {
    English: { m: ["James", "John", "Robert", "Michael", "William", "David", "Richard"], f: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara"] },
    Spanish: { m: ["Antonio", "Manuel", "José", "Francisco", "Juan", "Carlos"], f: ["María", "Carmen", "Ana", "Isabel", "Dolores"] },
    Arabic: { m: ["Ahmed", "Mohamed", "Omar", "Khaled", "Tariq"], f: ["Fatima", "Aisha", "Layla", "Zainab", "Nora"] },
    Japanese: { m: ["Hiroshi", "Kenji", "Takashi", "Haruto"], f: ["Sakura", "Yui", "Aoi", "Hana"] },
    Hindi: { m: ["Aarav", "Vihaan", "Arjun", "Sai"], f: ["Aanya", "Diya", "Anika", "Priya"] },
    Russian: { m: ["Alexander", "Dmitry", "Mikhail", "Ivan"], f: ["Anastasia", "Maria", "Sofia", "Anna"] }
};

const COUNTRIES = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Spain", "Italy", "Japan", "South Korea", "Brazil", "Mexico", "India", "UAE", "Singapore"];

const getRandomUser = () => {
    const cultures = Object.keys(NAME_REGISTRY);
    const culture = cultures[Math.floor(Math.random() * cultures.length)];
    const isMale = Math.random() > 0.5;
    const nameList = isMale ? NAME_REGISTRY[culture].m : NAME_REGISTRY[culture].f;
    const name = nameList[Math.floor(Math.random() * nameList.length)];
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    return {
        id: userId,
        name,
        username: name.toLowerCase().replace(/\s+/g, '_') + Math.floor(Math.random() * 1000),
        location: country,
        bio: `${name} | ${country} 🌍 | Living my best life ✨`,
        isActive: Math.random() > 0.7
    };
};

const SELF_USER_ID = `user_${Math.random().toString(36).substr(2, 9)}`;
const SELF_USER_BIO = "Living life one post at a time ✨ | Explorer 🌍 | Coffee lover ☕";

const STATIC_STORY_USERS = [
    { id: 1, name: "Tatiana Pavlova", username: "tatiana_pavlova", isUpdate: true, image_url: "https://images.unsplash.com/photo-1626071466175-79ab723e9fdd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=759&q=80" },
    { id: 2, name: "Aiony Haust", username: "aiony_haust", isUpdate: true, image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80" },
    { id: 3, name: "Joel Mott", username: "joel_mott", isUpdate: true, image_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80" },
    { id: 4, name: "Caique Silva", username: "caique_silva", isUpdate: true, image_url: "https://images.unsplash.com/photo-1504363081893-c8226db66926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 5, name: "Jemima Wood", username: "jemima_wood", isUpdate: true, image_url: "https://images.unsplash.com/photo-1644456070980-a6be4db8910a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 6, name: "Leio McLaren", username: "leio_mclaren", isUpdate: true, image_url: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 7, name: "Alex Suprun", username: "alex_suprun", isUpdate: false, image_url: "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 8, name: "Charles Deluvio", username: "charles_deluvio", isUpdate: false, image_url: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 9, name: "Luis Villasmil", username: "luis_villasmil", isUpdate: false, image_url: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60" },
    { id: 10, name: "Jabari Timothy", username: "jabari_timothy", isUpdate: false, image_url: "https://images.unsplash.com/photo-1656473040206-53753fbbc767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 11, name: "Ben Parker", username: "ben_parker", isUpdate: false, image_url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 12, name: "Ayo Ogunseinde", username: "ayo_ogunseinde", isUpdate: false, image_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
    { id: 13, name: "Vince Fleming", username: "vince_fleming", isUpdate: false, image_url: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 14, name: "Huston Wilson", username: "huston_wilson", isUpdate: false, image_url: "https://images.unsplash.com/photo-1507114845806-0347f6150324?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
    { id: 15, name: "Leon Ell'", username: "leon_ell", isUpdate: false, image_url: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" },
];

const ReelIcon = () => (
    <svg aria-label="Reels" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line>
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line>
        <path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <path d="M9.763 17.664a.908.908 0 01-.454-.787V11.63a.909.909 0 011.364-.788l4.545 2.624a.909.909 0 010 1.575l-4.545 2.624a.91.91 0 01-.51.012z"></path>
    </svg>
);

// Custom Feed Sidebar
const FeedSidebarInsta = ({ activeView, setActiveView, onGoHome, onOpenProfile, isDarkMode, toggleTheme, isCollapsed, setIsCollapsed, isOpen, setIsOpen, navigate, setIsCreationModalOpen }) => {
    return (
        <>
            {isOpen && (
                <div
                    className="feed-sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9998,
                        display: window.innerWidth <= 768 ? 'block' : 'none'
                    }}
                />
            )}
            <nav className={`navbar-insta ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'active' : ''}`}>
                <div className="instagram-text-logo" onClick={onGoHome} style={{ cursor: 'pointer', marginBottom: '30px' }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '24px', color: 'var(--ig-font)' }}>{isCollapsed ? 'HT.' : 'HappyTalk.'}</span>
                </div>
                <div className={`sub-section ${activeView === 'home' ? 'clicked' : ''}`} onClick={() => { setActiveView('home'); setIsOpen(false); }}>
                    <Home size={24} color="var(--ig-font)" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Home</a>
                </div>
                <div className={`sub-section ${activeView === 'search' ? 'clicked' : ''}`} onClick={() => { setActiveView('search'); setIsOpen(false); }}>
                    <Search size={24} color="var(--ig-font)" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Search</a>
                </div>
                <div className={`sub-section ${activeView === 'explore' ? 'clicked' : ''}`} onClick={() => { setActiveView('explore'); setIsOpen(false); }}>
                    <Compass size={24} color="var(--ig-font)" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Explore</a>
                </div>
                <div className={`sub-section ${activeView === 'reels' ? 'clicked' : ''}`} onClick={() => { setActiveView('reels'); setIsOpen(false); }}>
                    <ReelIcon />
                    <a href="#" onClick={(e) => e.preventDefault()}>Reels</a>
                </div>
                <div className={`sub-section ${activeView === 'live' ? 'clicked' : ''}`} onClick={() => { setActiveView('live'); setIsOpen(false); }}>
                    <Radio size={24} color="#ef4444" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Live</a>
                </div>
                <div className={`sub-section ${activeView === 'youtube' ? 'clicked' : ''}`} onClick={() => { setActiveView('youtube'); setIsOpen(false); }}>
                    <Youtube size={24} color="#ff0000" />
                    <a href="#" onClick={(e) => e.preventDefault()}>YouTube</a>
                </div>
                <div className="sub-section" onClick={() => { window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL')); setIsOpen(false); }}>
                    <MessageCircle size={24} color="var(--ig-font)" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Messages</a>
                </div>
                <div className="sub-section">
                    <Heart size={24} color="var(--ig-font)" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Notifications</a>
                </div>
                <div className="sub-section" onClick={() => setIsCreationModalOpen(true)}>
                    <PlusSquare size={24} color="var(--ig-font)" />
                    <a href="#" onClick={(e) => e.preventDefault()}>Create</a>
                </div>
                <div className="sub-section" onClick={toggleTheme}>
                    {isDarkMode ? <Sun size={24} color="var(--ig-font)" /> : <Moon size={24} color="var(--ig-font)" />}
                    <a href="#" onClick={(e) => e.preventDefault()}>{isDarkMode ? 'Light-mode' : 'Dark-mode'}</a>
                </div>
                <div className="sub-section" onClick={() => onOpenProfile(null, true)}>
                    <div className="profile-img" style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                        <img src="https://cdn-icons-png.flaticon.com/511/149/149071.png" alt="" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <a href="#" onClick={(e) => e.preventDefault()}>Profile</a>
                </div>
                <div className="menu-section" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
                    <div className="sub-section" onClick={() => setIsCollapsed(!isCollapsed)} style={{ background: 'var(--ig-hover)', borderRadius: '12px' }}>
                        <Menu size={24} color="var(--ig-font)" />
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none', color: 'var(--ig-font)', fontWeight: 700 }}>{isCollapsed ? '' : 'Collapse'}</a>
                    </div>
                </div>
            </nav>
        </>
    );
};

// Mobile Header Component
const FeedMobileHeader = ({ navigate, isDarkMode, toggleTheme, onMenuOpen }) => {
    return (
        <div className="feed-mobile-header">
            <button className="mobile-sidebar-toggle" onClick={onMenuOpen}>
                <Menu size={26} />
            </button>
            <h1 className="mobile-header-title" onClick={() => navigate('/')}>HappyTalk</h1>
            <button className="mobile-theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
        </div>
    );
};

// New Mobile Sidebar Drawer Component
const MobileSidebarDrawer = ({ isOpen, onClose, activeView, setActiveView, onOpenProfile, toggleTheme, isDarkMode, navigate, setIsCreationModalOpen }) => {
    return (
        <>
            <div className={`mobile-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`mobile-sidebar-drawer ${isOpen ? 'open' : ''}`}>
                <div className="mobile-sidebar-header">
                    <span className="mobile-sidebar-logo">HappyTalk.</span>
                    <button className="mobile-sidebar-close" onClick={onClose}>
                        <X size={28} />
                    </button>
                </div>



                <div className="mobile-sidebar-menu">
                    <div className={`mobile-menu-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => { setActiveView('home'); onClose(); }}>
                        <Home size={24} />
                        <span>Home</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'search' ? 'active' : ''}`} onClick={() => { setActiveView('search'); onClose(); }}>
                        <Search size={24} />
                        <span>Search</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'explore' ? 'active' : ''}`} onClick={() => { setActiveView('explore'); onClose(); }}>
                        <Compass size={24} />
                        <span>Explore</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'reels' ? 'active' : ''}`} onClick={() => { setActiveView('reels'); onClose(); }}>
                        <ReelIcon />
                        <span>Reels</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'youtube' ? 'active' : ''}`} onClick={() => { setActiveView('youtube'); onClose(); }}>
                        <Youtube size={24} color="#ff0000" />
                        <span>YouTube</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'live' ? 'active' : ''}`} onClick={() => { setActiveView('live'); onClose(); }}>
                        <Radio size={24} color="#ef4444" />
                        <span>Live TV</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL')); onClose(); }}>
                        <MessageCircle size={24} />
                        <span>Messages</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { setIsCreationModalOpen(true); onClose(); }}>
                        <PlusSquare size={24} />
                        <span>Create Post</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { toggleTheme(); onClose(); }}>
                        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                </div>


            </div>
        </>
    );
};

// Custom Feed Bottom Nav
const FeedBottomNav = ({ activeView, setActiveView, onOpenProfile, setIsCreationModalOpen, onGoHome }) => {
    return (
        <div className="feed-custom-bottom-nav">
            <button className={activeView === 'home' ? 'active' : ''} onClick={() => { setActiveView('home'); window.scrollTo(0, 0); }}>
                <Home size={24} />
            </button>
            <button className={activeView === 'search' ? 'active' : ''} onClick={() => setActiveView('search')}>
                <Search size={24} />
            </button>
            <button className="plus-nav-btn" onClick={() => setIsCreationModalOpen(true)}>
                <PlusSquare size={24} />
            </button>
            <button className={activeView === 'reels' ? 'active' : ''} onClick={() => setActiveView('reels')}>
                <ReelIcon />
            </button>
            <button className={activeView === 'user' ? 'active' : ''} onClick={() => onOpenProfile(null, true)}>
                <User size={24} />
            </button>
        </div>
    );
};

// Story Modal
const StoryModal = ({ isOpen, stories, activeIndex, onClose, onNext, onPrev }) => {
    const [progress, setProgress] = useState(0);
    const [liked, setLiked] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
        if (!isOpen) { setProgress(0); return; }
        setProgress(0);
        setLiked(false);
        timerRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timerRef.current);
                    onNext();
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(timerRef.current);
    }, [isOpen, activeIndex, onNext]);

    if (!isOpen) return null;
    const currentStory = stories[activeIndex];

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="story-modal" onClick={onClose}>
                <motion.div className="story-modal-content" onClick={(e) => e.stopPropagation()} drag="x" dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset }) => { if (offset.x > 100) onPrev(); else if (offset.x < -100) onNext(); }}>
                    <div className="story-progress-container">
                        {stories.map((_, i) => (
                            <div key={i} className="story-progress-bar">
                                <div className="story-progress-fill" style={{ width: i < activeIndex ? '100%' : i === activeIndex ? `${progress}%` : '0%', transition: i === activeIndex ? 'none' : '0.3s' }} />
                            </div>
                        ))}
                    </div>
                    <div className="story-header">
                        <div className="usrProfile">
                            <div className="uplogo"><img src={currentStory.user.pic} alt="" /></div>
                            <p style={{ color: '#fff' }}>{currentStory.user.username} <small>Just now</small></p>
                        </div>
                        <button className="story-close" onClick={onClose}><i className="fas fa-times"></i></button>
                    </div>
                    <img src={currentStory.image} alt="Story" className="story-image" />
                    <div className="story-nav story-nav-prev" onClick={onPrev}></div>
                    <div className="story-nav story-nav-next" onClick={onNext}></div>
                    <div className="story-footer">
                        <input type="text" placeholder="Send message..." className="story-input" />
                        <i className={`${liked ? 'fas' : 'far'} fa-heart`} style={{ color: liked ? '#ed4956' : '#fff' }} onClick={() => setLiked(!liked)}></i>
                        <i className="far fa-paper-plane"></i>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const PostDetailModal = ({ isOpen, post, onClose, onShare }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!isOpen || !post) return null;

    return (
        <div className="post-detail-overlay-alien" onClick={onClose}>
            <div className="alien-wrapper">
                <div className="alien-card" onClick={e => e.stopPropagation()}>
                    <div className="alien-top">
                        <div className="alien-userDetails">
                            <div className="alien-profile_img">
                                <img src={post.user.pic} className="alien-cover" alt="" />
                            </div>
                            <h3>{post.user.username}<br /><span>{post.user.location || "Earth, Solar System"}</span></h3>
                        </div>
                        <div className="alien-dot">
                            <MoreHorizontal size={20} />
                        </div>
                    </div>
                    <div className="alien-imgBx">
                        <img src={post.image} className="alien-cover" alt="" />
                    </div>
                    <div className="alien-actionBtns">
                        <div className="left">
                            <Heart
                                size={24}
                                className={`alien-icon ${liked ? 'liked' : ''}`}
                                color={liked ? '#ef4444' : 'currentColor'}
                                fill={liked ? '#ef4444' : 'none'}
                                onClick={() => setLiked(!liked)}
                            />
                            <MessageCircle size={24} className="alien-icon" />
                            <Send size={24} className="alien-icon" onClick={() => onShare && onShare(post)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="right">
                            <Bookmark
                                size={24}
                                className={`alien-icon ${saved ? 'saved' : ''}`}
                                color={saved ? '#3b82f6' : 'currentColor'}
                                fill={saved ? '#3b82f6' : 'none'}
                                onClick={() => setSaved(!saved)}
                            />
                        </div>
                    </div>
                    <h4 className="alien-likes">{(post.likes + (liked ? 1 : 0)).toLocaleString()} likes</h4>
                    <h4 className="alien-message"><b>{post.user.username}</b> {post.caption} <span>#AlienUI</span> <span>#Future</span> <span>#HappyTalk</span></h4>
                    <h4 className="alien-comments">View all {post.comments || 0} comments</h4>
                    <div className="alien-addComments">
                        <div className="alien-userImg">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" className="alien-cover" alt="" />
                        </div>
                        <input type="text" className="alien-text" placeholder="Add a comment..." />
                    </div>
                    <h5 className="alien-postTime">{post.time || "4 hours ago"}</h5>
                    <button className="alien-close-btn" onClick={onClose}><X size={20} /></button>
                </div>
            </div>
        </div>
    );
};

// ProfileView Component
const ProfileView = ({ user, isSelf }) => {
    const [activeTab, setActiveTab] = useState('grid');
    const [profileImages, setProfileImages] = useState([]);

    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                const res = await newsApi.getAllNews({ search: 'nature lifestyle', limit: 15 });
                setProfileImages((res.data || []).map(n => ({ id: n.uuid, url: n.image_url })));
            } catch (err) { console.error(err); }
        };
        fetchProfileImages();
    }, [user]);

    const displayName = isSelf ? "User" : user?.name || "User";
    const displayBio = isSelf ? SELF_USER_BIO : user?.bio || "";
    const displayId = isSelf ? SELF_USER_ID : user?.id || "";
    const stats = isSelf ? { p: 0, f1: 0, f2: 0 } : { p: profileImages.length, f1: Math.floor(Math.random() * 1000), f2: Math.floor(Math.random() * 800) };
    const pic = isSelf ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : user?.pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="user-profile-view">
            <div className="profile-header-top">
                <p>{isSelf ? "user" : user?.username || "user"} <span><img src="https://img.icons8.com/ios/30/000000/expand-arrow--v3.png" style={{ width: 10 }} alt="" /></span></p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <img src="https://img.icons8.com/ios/50/000000/plus-2-math.png" style={{ width: 30 }} alt="" />
                    <img src="https://img.icons8.com/ios-filled/50/000000/menu--v2.png" style={{ width: 30 }} alt="" />
                </div>
            </div>

            <div className="profile-bio-section">
                <div className="bio-top">
                    <div className="profile-main-pic-wrapper">
                        <div className="profile-main-pic" style={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover' }}></div>
                    </div>
                    <div className="stats-flex">
                        <div className="stat-item"><span className="num">{stats.p}</span><span className="label">Posts</span></div>
                        <div className="stat-item"><span className="num">{stats.f1}</span><span className="label">Followers</span></div>
                        <div className="stat-item"><span className="num">{stats.f2}</span><span className="label">Following</span></div>
                    </div>
                </div>
                <div className="bio-content">
                    <p className="profile-name">{displayName}</p>
                    <p className="profile-bio-text">{displayBio}</p>
                    <p className="profile-user-id">ID: {displayId}</p>
                </div>

                <div className="edit-profile-row">
                    <button className="edit-btn">Edit Profile</button>
                    <button className="share-btn">Share Profile</button>
                </div>
            </div>

            <div className="highlights-section">
                <p className="highlights-title">Story Highlights</p>
                <div className="highlights-list">
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/airport.png)' }}></div>
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/new-delhi.png)' }}></div>
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/hamburger.png)' }}></div>
                    <div className="highlight-item highlight-plus">
                        <img src="https://img.icons8.com/android/24/000000/plus.png" style={{ width: 20 }} alt="" />
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <div className={`profile-tab-item ${activeTab === 'grid' ? 'active' : ''}`} onClick={() => setActiveTab('grid')}>
                    <img src="https://img.icons8.com/small/16/000000/grid.png" alt="" />
                </div>
                <div className={`profile-tab-item ${activeTab === 'tagged' ? 'active' : ''}`} onClick={() => setActiveTab('tagged')}>
                    <img src="https://cdn0.iconfinder.com/data/icons/instagram-ui-1/24/Instagram-UI_tagged-512.png" style={{ width: 20 }} alt="" />
                </div>
            </div>

            <div className="profile-post-grid">
                {profileImages.map(post => (
                    <div key={post.id} className="profile-post-item">
                        <img src={post.url} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// SearchGrid Component - ONLY Images (Pexels + SourceSplash)
const SearchGrid = ({ onOpenPost }) => {
    const PEXELS_KEY = 'XkN36hK2S0z876lWSlI5YoB9ZscPAq4cZbcL6SXABt9CyZmqBwwjov1P';
    const SOURCESPLASH_KEY = '102|Mk05XlXKntW2r3BoeOpYtX9B3OSxPPtiAd8VRpPi7e4fcc79';
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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
            <div className="discover-search-bar" style={{ padding: '10px 15px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
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
                    <div key={`${item.id}-${i}`} className="grid-item" ref={i === items.length - 1 ? lastRef : null}
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
                        <img src={item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {item.id.startsWith('ss-') && (
                            <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 4px', borderRadius: '4px', fontSize: '10px' }}>SS</div>
                        )}
                    </div>
                ))}
                {/* Loader removed */}
            </div>
        </div>
    );
};

// ExploreGrid Component - Mixed Images, News, and YouTube Videos
const ExploreGrid = ({ onOpenPost }) => {
    const PEXELS_KEY = 'XkN36hK2S0z876lWSlI5YoB9ZscPAq4cZbcL6SXABt9CyZmqBwwjov1P';
    const YT_KEY = 'AIzaSyB3GWPQbVRRM3yOqDIKWmRdt333u8Gy-iU';
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
            <div className="discover-search-bar" style={{ padding: '10px 15px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
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
                {/* Loader removed */}
            </div>
        </div>
    );
};

// ReelSection Component - Shows actual short videos/reels
const ReelSection = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState('');
    const [interactions, setInteractions] = useState({});
    const [activeIdx, setActiveIdx] = useState(0);
    const observer = useRef();

    const fetchReels = async (pageToken = '') => {
        try {
            setLoading(true);
            const YT_KEY = 'AIzaSyB3GWPQbVRRM3yOqDIKWmRdt333u8Gy-iU';
            // Fetch recent trending videos
            const queries = ['trending now', 'viral videos', 'popular today', 'latest videos'];
            const query = queries[Math.floor(Math.random() * queries.length)];

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&order=date&key=${YT_KEY}&pageToken=${pageToken}`
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
            console.error('Reels Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReels();
    }, []);

    const lastReelRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextPageToken) {
                fetchReels(nextPageToken);
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
        <div className="reels-scroll-container" onScroll={handleScroll} style={{ height: 'calc(100vh - 70px)', scrollSnapType: 'y mandatory', overflowY: 'scroll' }}>
            {videos.map((video, idx) => (
                <div key={`${video.id}-${idx}`} className="reel-container" ref={idx === videos.length - 1 ? lastReelRef : null} style={{ height: '100%', scrollSnapAlign: 'start' }}>
                    <div className="reel-section">
                        <div className="phone-mic"></div>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#000' }}>
                            {activeIdx === idx ? (
                                <iframe
                                    className="iframe-reel"
                                    width="100%" height="100%"
                                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0&loop=1&playlist=${video.id}&controls=0&modestbranding=1&rel=0`}
                                    frameBorder="0" allow="autoplay; encrypted-media" title="Video"
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <img src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.8 }}>
                                        <ReelIcon />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="post-section">
                            <div className="pshead">
                                <h4 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>REELS</h4>
                                <button className="iconbtn"><Camera size={24} color="white" /></button>
                            </div>
                            <div className="psfooter">
                                <div className="usrProfile">
                                    <div className="uplogo"><img src={video.pic} alt="" /></div>
                                    <p style={{ color: '#fff', fontWeight: '700' }}>{video.username} <i className="fas fa-check-circle" style={{ color: '#38bdf8', fontSize: '12px' }}></i></p>
                                </div>
                                <p style={{ color: '#fff', fontSize: '14px', marginTop: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{video.desc}</p>
                            </div>
                            <div className="action-btn">
                                <ul style={{ listStyle: 'none' }}>
                                    <li style={{ marginBottom: '20px' }}>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'liked')} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <Heart size={24} fill={interactions[video.id]?.liked ? '#ef4444' : 'none'} color={interactions[video.id]?.liked ? '#ef4444' : 'white'} />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>{interactions[video.id]?.liked ? '1.3M' : '1.2M'}</p>
                                    </li>
                                    <li style={{ marginBottom: '20px' }}>
                                        <button className="iconbtn" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <MessageCircle size={24} color="white" />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>42K</p>
                                    </li>
                                    <li style={{ marginBottom: '20px' }}>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'shared')} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <Send size={24} color="white" />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>Share</p>
                                    </li>
                                    <li>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'saved')} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <Bookmark size={24} fill={interactions[video.id]?.saved ? '#3b82f6' : 'none'} color={interactions[video.id]?.saved ? '#3b82f6' : 'white'} />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>Save</p>
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

// LiveSection Component - Shows live TV streams
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
            const YT_KEY = 'AIzaSyB3GWPQbVRRM3yOqDIKWmRdt333u8Gy-iU';
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
        <div className="reels-scroll-container" onScroll={handleScroll} style={{ height: 'calc(100vh - 70px)', scrollSnapType: 'y mandatory', overflowY: 'scroll' }}>
            {videos.map((video, idx) => (
                <div key={`${video.id}-${idx}`} className="reel-container" ref={idx === videos.length - 1 ? lastReelRef : null} style={{ height: '100%', scrollSnapAlign: 'start' }}>
                    <div className="reel-section">
                        <div className="phone-mic"></div>
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
                            <div className="pshead">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                                    <h4 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>LIVE</h4>
                                </div>
                                <button className="iconbtn"><Camera size={24} color="white" /></button>
                            </div>
                            <div className="psfooter">
                                <div className="usrProfile">
                                    <div className="uplogo"><img src={video.pic} alt="" /></div>
                                    <p style={{ color: '#fff', fontWeight: '700' }}>{video.username} <i className="fas fa-check-circle" style={{ color: '#38bdf8', fontSize: '12px' }}></i></p>
                                </div>
                                <p style={{ color: '#fff', fontSize: '14px', marginTop: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{video.desc}</p>
                            </div>
                            <div className="action-btn">
                                <ul style={{ listStyle: 'none' }}>
                                    <li style={{ marginBottom: '20px' }}>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'liked')} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <Heart size={24} fill={interactions[video.id]?.liked ? '#ef4444' : 'none'} color={interactions[video.id]?.liked ? '#ef4444' : 'white'} />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>LIVE</p>
                                    </li>
                                    <li style={{ marginBottom: '20px' }}>
                                        <button className="iconbtn" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <MessageCircle size={24} color="white" />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>Chat</p>
                                    </li>
                                    <li style={{ marginBottom: '20px' }}>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'shared')} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%' }}>
                                            <Send size={24} color="white" />
                                        </button>
                                        <p style={{ color: '#fff', fontSize: '12px', textAlign: 'center', marginTop: '5px' }}>Share</p>
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

const PostCreationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="post-detail-overlay" style={{ zIndex: 5000 }} onClick={onClose}>
            <div className="post-creation-card" onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Create New Post</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><Camera size={20} /> Image</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><ReelIcon /> Video</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><MessageCircle size={20} /> Text</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><RefreshCw size={20} /> Go Live</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }} onClick={() => { window.location.href = '/create-room' }}><Home size={20} /> Create Room</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><i className="fas fa-poll"></i> Poll</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><i className="fas fa-music"></i> Music</button>
                    <button className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><i className="fas fa-map-marker-alt"></i> Location</button>
                </div>
                <textarea placeholder="What's on your mind?" style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', minHeight: '100px' }}></textarea>
                <button className="post-submit-btn" style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', border: 'none' }}>Post Now</button>
            </div>
        </div>
    );
};

// Main FeedPage Component
const FeedPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('home');
    const [likedPosts, setLikedPosts] = useState({});
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [storyModal, setStoryModal] = useState({ isOpen: false, index: 0 });
    const [stories, setStories] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSelfProfile, setIsSelfProfile] = useState(false);
    const [detailModal, setDetailModal] = useState({ isOpen: false, post: null });
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('light');
    const [expandedCaptions, setExpandedCaptions] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [savedPosts, setSavedPosts] = useState({});
    const [showSuggestions, setShowSuggestions] = useState(true);
    const { theme, changeTheme } = useTheme();
    const observer = useRef();

    // Fetch unique stories on mount (Normal + News Mix)
    useEffect(() => {
        const fetchStories = async () => {
            try {
                // Fetch News for stories
                const newsRes = await newsApi.getAllNews({ limit: 50 });
                const newsStories = (newsRes.data || []).filter(n => n.image_url).map(n => ({
                    user: {
                        username: n.source.toLowerCase().replace(/\s+/g, '_'),
                        pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(n.source)}&background=random&color=fff`
                    },
                    image: n.image_url,
                    id: `news-story-${n.uuid}`
                }));

                // Fetch Images for stories
                const PEXELS_KEY = '563492ad6f91700001000001bc20b3327d6d4590bac811e51b69415c';
                const pexelsRes = await fetch(`https://api.pexels.com/v1/curated?per_page=50`, {
                    headers: { Authorization: PEXELS_KEY }
                });
                const pexelsData = await pexelsRes.json();
                const imageStories = (pexelsData.photos || []).map(photo => ({
                    user: {
                        username: photo.photographer.toLowerCase().replace(/\s+/g, '_'),
                        pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(photo.photographer)}&background=random&color=fff`
                    },
                    image: photo.src.large,
                    id: `img-story-${photo.id}`
                }));

                // Mix and shuffle
                const mixed = [...newsStories, ...imageStories].sort(() => Math.random() - 0.5);
                setStories(mixed);
            } catch (err) { console.error(err); }
        };
        fetchStories();
    }, []);

    // Fetch posts with pagination - EXCLUSIVELY NEWS
    const fetchHomePosts = useCallback(async (p) => {
        setLoading(true);
        try {
            // Fetch news only
            const newsRes = await newsApi.getHeadlines({ page: p, limit: 20 });

            const newPosts = (newsRes.data || []).map(ns => {
                const img = ns.image_url || ns.image || (ns.multimedia && ns.multimedia[0]?.url) || 'https://images.unsplash.com/photo-1504711434969?auto=format&fit=crop&q=80&w=800';
                return {
                    id: `news-${ns.uuid || ns.id}-${Date.now()}-${Math.random()}`,
                    type: 'news',
                    user: getRandomUser(),
                    image: img,
                    likes: Math.floor(Math.random() * 5000) + 100,
                    caption: ns.title + (ns.description ? "\n\n" + ns.description : ""),
                    time: "Just now",
                    comments: Math.floor(Math.random() * 200),
                    source: ns.source || 'News Source'
                };
            }).filter(p => p.image && !p.image.includes('placeholder'));

            if (p === 1) setPosts(newPosts);
            else setPosts(prev => [...prev, ...newPosts]);
        } catch (err) {
            console.error('Error fetching news feed:', err);
            if (p === 1) setPosts([]);
        }
        setLoading(false);
    }, []);


    useEffect(() => { fetchHomePosts(page); }, [page, fetchHomePosts]);

    const handleRefresh = () => {
        setPage(1);
        fetchHomePosts(1);
    };

    const lastPostRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setPage(prev => prev + 1);
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    const openProfile = (user, isSelf = false) => {
        setSelectedUser(user);
        setIsSelfProfile(isSelf);
        setActiveView('user');
    };

    const handleShare = async (post) => {
        const shareUrl = `${window.location.origin}/post/${post.id}`;
        const shareText = `Check out this post on HappyTalk!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'HappyTalk',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    copyToClipboard(shareUrl);
                }
            }
        } else {
            copyToClipboard(shareUrl);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', {
                detail: {
                    title: 'Link Copied!',
                    message: 'Post link has been copied to clipboard.'
                }
            }));
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const [feedDarkMode, setFeedDarkMode] = useState(false);

    const isDarkMode = feedDarkMode;

    const toggleTheme = () => {
        setFeedDarkMode(!feedDarkMode);
    };

    const renderHome = () => {
        return (
            <div className="post-section-insta home-no-gap">
                <div className="story-section-insta">
                    <div className="story-insta" onClick={() => openProfile(null, true)}>
                        <div className="story-image-insta" style={{ background: 'none', padding: 0 }}>
                            <div style={{ position: 'relative', width: '65px', height: '65px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ig-bg)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={30} color="var(--ig-sec-font)" />
                                </div>
                                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: '0', right: '0', border: '2px solid var(--ig-bg)', borderRadius: '50%' }}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.125 16C12.4742 16 16 12.4742 16 8.125C16 3.77576 12.4742 0.25 8.125 0.25C3.77576 0.25 0.25 3.77576 0.25 8.125C0.25 12.4742 3.77576 16 8.125 16Z" fill="#0074cc" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.61719 4.67969C8.61719 4.40786 8.39683 4.1875 8.125 4.1875C7.85317 4.1875 7.63281 4.40786 7.63281 4.67969V7.63281H4.67969C4.40786 7.63281 4.1875 7.85317 4.1875 8.125C4.1875 8.39683 4.40786 8.61719 4.67969 8.61719H7.63281V11.5703C7.63281 11.8421 7.85317 12.0625 8.125 12.0625C8.39683 12.0625 8.61719 11.8421 8.61719 11.5703V8.61719H11.5703C11.8421 8.61719 12.0625 8.39683 12.0625 8.125C12.0625 7.85317 11.8421 7.63281 11.5703 7.63281H8.61719V4.67969Z" fill="#FFFFFF" />
                                </svg>
                            </div>
                        </div>
                        <span>Your story</span>
                    </div>
                    {stories.map((s, i) => (
                        <div key={s.id} className="story-insta" onClick={() => setStoryModal({ isOpen: true, index: i })}>
                            <div className="story-image-insta" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', padding: '2px' }}>
                                <img src={s.user.pic} alt="" style={{ border: '2px solid var(--ig-bg)', borderRadius: '50%', width: '100%', height: '100%' }} />
                            </div>
                            <span style={{ fontSize: '11px' }}>{s.user.username}</span>
                        </div>
                    ))}
                </div>

                <div className="post-area-insta">
                    {posts.map((post, i) => (
                        <div key={post.id} className="post-main-insta" ref={i === posts.length - 1 ? lastPostRef : null}>
                            <div className="post-header-insta">
                                <div className="post-left-header-insta" onClick={() => openProfile(post.user)} style={{ cursor: 'pointer' }}>
                                    <div className="post-img-insta" style={{ position: 'relative' }}>
                                        <img src={post.user.pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {post.user.isActive && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: '#22c55e', borderRadius: '50%', border: '2px solid var(--ig-bg)' }} />}
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <p className="post-username-insta" style={{ fontWeight: 'bold', color: 'var(--ig-font)', margin: 0 }}>{post.user.username}</p>
                                        {post.user.isActive && <small style={{ color: '#22c55e', fontSize: '11px', display: 'block' }}>Active now</small>}
                                    </div>
                                </div>
                                <MoreHorizontal size={20} color="var(--ig-font)" />
                            </div>
                            <div className="post-main-image-insta" onClick={() => setDetailModal({ isOpen: true, post })} style={{ cursor: 'pointer' }}>
                                <img src={post.image} alt="" style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div className="post-footer-insta" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <Heart
                                        size={26}
                                        color={likedPosts[post.id] ? '#ef4444' : 'var(--ig-font)'}
                                        fill={likedPosts[post.id] ? '#ef4444' : 'none'}
                                        onClick={() => setLikedPosts({ ...likedPosts, [post.id]: !likedPosts[post.id] })}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <MessageCircle size={26} color="var(--ig-font)" style={{ cursor: 'pointer' }} />
                                    <Send size={26} color="var(--ig-font)" style={{ cursor: 'pointer' }} onClick={() => handleShare(post)} title="Share/Copy" />
                                </div>
                                <Bookmark
                                    size={26}
                                    color={savedPosts[post.id] ? '#3b82f6' : 'var(--ig-font)'}
                                    fill={savedPosts[post.id] ? '#3b82f6' : 'none'}
                                    onClick={() => setSavedPosts({ ...savedPosts, [post.id]: !savedPosts[post.id] })}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className="post-description-insta">
                                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', color: 'var(--ig-font)' }}>{(post.likes + (likedPosts[post.id] ? 1 : 0)).toLocaleString()} likes</p>
                                <div style={{ fontSize: '0.9rem', color: 'var(--ig-font)', lineHeight: '1.4' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{post.user.username}</span>
                                    <span style={{ fontWeight: '800', color: 'var(--primary-color)', marginRight: '5px' }}>[{post.source}]</span>
                                    {post.caption}
                                </div>
                                <p style={{ color: 'var(--ig-sec-font)', fontSize: '0.8rem', marginTop: '8px', cursor: 'pointer' }}>View all {post.comments} comments</p>
                            </div>
                        </div>
                    ))}
                    {/* Loader removed */}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (activeView === 'youtube') return <YouTubeUI onBack={() => setActiveView('home')} />;
        if (activeView === 'search') return <SearchGrid onOpenPost={(p) => setDetailModal({ isOpen: true, post: p })} />;
        if (activeView === 'explore') return <ExploreGrid onOpenPost={(p) => setDetailModal({ isOpen: true, post: p })} />;
        if (activeView === 'reels') return <ReelSection />;
        if (activeView === 'live') return <LiveSection />;
        if (activeView === 'user') return <ProfileView user={selectedUser} isSelf={isSelfProfile} />;

        return renderHome();
    };

    return (
        <div className={`feed-page-root ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Mobile Header */}
            <FeedMobileHeader
                navigate={navigate}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                onMenuOpen={() => setIsMobileSidebarOpen(true)}
            />

            {/* Mobile Sidebar Drawer */}
            <MobileSidebarDrawer
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                activeView={activeView}
                setActiveView={setActiveView}
                onOpenProfile={openProfile}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
                navigate={navigate}
                setIsCreationModalOpen={setIsCreationModalOpen}
            />

            <StoryModal
                isOpen={storyModal.isOpen} stories={stories} activeIndex={storyModal.index}
                onClose={() => setStoryModal({ ...storyModal, isOpen: false })}
                onNext={() => setStoryModal(p => ({ ...p, index: (p.index + 1) % stories.length }))}
                onPrev={() => setStoryModal(p => ({ ...p, index: (p.index - 1 + stories.length) % stories.length }))}
            />

            <PostDetailModal
                isOpen={detailModal.isOpen}
                post={detailModal.post}
                onClose={() => setDetailModal({ isOpen: false, post: null })}
                onShare={handleShare}
            />

            <PostCreationModal
                isOpen={isCreationModalOpen}
                onClose={() => setIsCreationModalOpen(false)}
            />

            <div className="insta-container">
                {/* Sidebar only on desktop */}
                {windowWidth > 768 && (
                    <FeedSidebarInsta
                        activeView={activeView}
                        setActiveView={setActiveView}
                        onGoHome={() => navigate('/')}
                        onOpenProfile={openProfile}
                        isDarkMode={theme === 'dark' || theme === 'space'}
                        toggleTheme={toggleTheme}
                        isCollapsed={isSidebarCollapsed}
                        setIsCollapsed={setIsSidebarCollapsed}
                        isOpen={isMobileSidebarOpen}
                        setIsOpen={setIsMobileSidebarOpen}
                        navigate={navigate}
                        setIsCreationModalOpen={setIsCreationModalOpen}
                    />
                )}

                <div className="middle-section-insta">
                    {renderContent()}

                    {activeView === 'home' && (
                        <div className="follow-section-insta">
                            <div className="profile-follow profile-foolow-hovering" onClick={() => openProfile(null, true)}>
                                <div className="profile-follow-left">
                                    <div className="profile-follow-image">
                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" />
                                    </div>
                                    <div className="profile-follow-content">
                                        <p className="profile-id">user_421</p>
                                        <p className="profile-name">HappyTalk User</p>
                                    </div>
                                </div>
                                <a href="#" className="follow" onClick={(e) => e.preventDefault()}>switch</a>
                            </div>

                            <div className="suggestion-follow">
                                <p className="suggestion">Suggested for you</p>
                                <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); setShowSuggestions(!showSuggestions); }}>{showSuggestions ? 'hide' : 'see all'}</a>
                            </div>

                            {showSuggestions && [
                                { name: "Marcus Rashford", username: "marcus_official", pic: "https://i.pravatar.cc/150?u=marcus", category: "Social Impact", isActive: true },
                                { name: "Sofia Garcia", username: "sofia_design", pic: "https://i.pravatar.cc/150?u=sofia", category: "Digital Designer", isActive: false },
                                { name: "Yuki Tanaka", username: "yuki_camera", pic: "https://i.pravatar.cc/150?u=yuki", category: "Photographer", isActive: true },
                                { name: "Amara Okoro", username: "amara_tech", pic: "https://i.pravatar.cc/150?u=amara", category: "AI Researcher", isActive: false },
                                { name: "Leo Messi", username: "leomessi", pic: "https://i.pravatar.cc/150?u=messi", category: "Athlete", isActive: true },
                                { name: "Zoe Chen", username: "zoe_chef", pic: "https://i.pravatar.cc/150?u=zoe", category: "Pastry Artist", isActive: true },
                                { name: "Arjun Mehta", username: "arjun_travels", pic: "https://i.pravatar.cc/150?u=arjun", category: "Travel Content", isActive: false },
                                { name: "Elena Rossi", username: "elena_fashion", pic: "https://i.pravatar.cc/150?u=elena", category: "Style Guru", isActive: true },
                                { name: "David Kim", username: "david_dev", pic: "https://i.pravatar.cc/150?u=david", category: "Software Engineer", isActive: false },
                                { name: "Nia Jones", username: "nia_vocals", pic: "https://i.pravatar.cc/150?u=nia", category: "Indie Singer", isActive: false },
                                { name: "Liam O'Connor", username: "liam_fit", pic: "https://i.pravatar.cc/150?u=liam", category: "Fitness Coach", isActive: true },
                                { name: "Sana Khan", username: "sana_style", pic: "https://i.pravatar.cc/150?u=sanax", category: "Lifestyle Blogger", isActive: false },
                                { name: "Oliver Smith", username: "oliver_art", pic: "https://i.pravatar.cc/150?u=oliver", category: "Modern Artist", isActive: false },
                                { name: "Maria Silva", username: "maria_eco", pic: "https://i.pravatar.cc/150?u=maria", category: "Environmentalist", isActive: true }
                            ].map((u, i) => (
                                <div key={i} className="profile-follow">
                                    <div className="profile-follow-left" onClick={() => openProfile({ ...u, pic: u.pic, name: u.name, bio: u.category })}>
                                        <div className="profile-follow-image" style={{ position: 'relative' }}>
                                            <img src={u.pic} alt="" />
                                            {u.isActive && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, background: '#22c55e', borderRadius: '50%', border: '1px solid var(--card-bg)' }} />}
                                        </div>
                                        <div className="profile-follow-content">
                                            <p className="profile-id">{u.username}</p>
                                            <p className="profile-name" style={{ color: u.isActive ? '#22c55e' : 'var(--text-secondary)' }}>{u.isActive ? 'Active now' : u.category}</p>
                                        </div>
                                    </div>
                                    <a href="#" className="follow" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL')); }}>Chat</a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <FeedBottomNav
                activeView={activeView}
                setActiveView={setActiveView}
                onOpenProfile={openProfile}
                setIsCreationModalOpen={setIsCreationModalOpen}
                onGoHome={() => navigate('/')}
            />
        </div>
    );
};

export default FeedPage;
