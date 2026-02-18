import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Zap, Home, TrendingUp, PlaySquare, Bell, Mail,
    Moon, Sun, Search, Plus, User, Flame, MessageCircle,
    Repeat, Share2, Bookmark, Menu, ArrowLeft, Image, Video, Music, Type, BarChart2, Radio, Users,
    ChevronDown, ChevronUp, Globe, Star, Settings, LogOut, Activity, UserCircle, Heart, X, LayoutGrid
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { newsApi } from '../api/newsApi';
import ShortsSection from '../components/ShortsSection';
import StoryModal from '../components/Feed/StoryModal';
import '../styles/NewFeed.css';

// Helper for truncated text
const PostContent = ({ content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const limit = 150;

    if (content.length <= limit) return <div className="post-content">{content}</div>;

    return (
        <div className="post-content">
            {isExpanded ? content : `${content.substring(0, limit)}...`}
            <button className="read-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show Less' : 'Read More'}
            </button>
        </div>
    );
};

const FeedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [theme, setTheme] = useState('light');
    const [activeTab, setActiveTab] = useState('Home');
    const [stories, setStories] = useState([]);
    const [page, setPage] = useState(1);
    const [trendsPage, setTrendsPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Sidebar States
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
    const [sidebarExpanded, setSidebarExpanded] = useState(false); // Desktop/Mobile 'Show More'
    const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 1200); // Desktop Collapsed Mode
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);

    // Story Modal State
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);

    // Pagination State
    const observer = useRef();

    // Toggle Theme
    useEffect(() => {
        // document.body.setAttribute('data-theme', theme); // Configured to only affect FeedPage via container prop
        const savedTheme = localStorage.getItem('feed_theme') || 'light';
        setTheme(savedTheme);
    }, []); // Run once on mount to get saved theme, or dependency [theme] if we want to sync


    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setTheme(newTheme);
        localStorage.setItem('feed_theme', newTheme);
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchStories();
    }, []);

    // Fetch News Feed with Pagination
    const fetchNewsFeed = useCallback(async (pageNum) => {
        if (loading) return;
        setLoading(true);
        try {
            // Randomize page on first load if page is 1
            const effectivePage = pageNum === 1 ? Math.floor(Math.random() * 5) + 1 : pageNum;
            const res = await newsApi.getHeadlines({ limit: 10, page: effectivePage });

            if (res.data && res.data.length > 0) {
                let mappedPosts = res.data.map(article => ({
                    id: article.uuid || Math.random(),
                    user: {
                        name: article.source || 'News Update',
                        handle: '@' + (article.source || 'news').toLowerCase().replace(/\s/g, ''),
                        pic: `https://ui-avatars.com/api/?name=${article.source}&background=random`
                    },
                    content: article.title + (article.description ? `\n\n${article.description}` : '') + ' Check out the full story for more details on this developing situation.',
                    image: article.image_url,
                    time: new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    likes: Math.floor(Math.random() * 1000) + 100,
                    comments: Math.floor(Math.random() * 100),
                    isNews: true
                }));

                // Randomly inject Room/Live card
                if (Math.random() > 0.7) {
                    const randomUser = ['Alex', 'Sarah', 'Justin'][Math.floor(Math.random() * 3)];
                    const roomPost = {
                        id: `room-${Math.random()}`,
                        user: {
                            name: randomUser,
                            handle: `@${randomUser.toLowerCase()}`,
                            pic: `https://i.pravatar.cc/150?u=${randomUser}`
                        },
                        content: 'Started a live room! Join in.',
                        isRoom: true,
                        time: 'Just now'
                    };
                    mappedPosts.splice(Math.floor(Math.random() * mappedPosts.length), 0, roomPost);
                }

                // Shuffle posts for freshness
                mappedPosts = mappedPosts.sort(() => Math.random() - 0.5);

                setPosts(prev => pageNum === 1 ? mappedPosts : [...prev, ...mappedPosts]);
            }
        } catch (error) {
            console.error("Failed to fetch news", error);
        }
        setLoading(false);
    }, [loading]);

    // Check for shared post ID in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('post');
        if (postId && posts.length > 0) {
            // Wait for render
            setTimeout(() => {
                const element = document.getElementById(`post-${postId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.style.border = '2px solid var(--primary-accent)';
                    setTimeout(() => element.style.border = 'none', 3000);
                }
            }, 1000);
        }
    }, [posts, location.search]);

    useEffect(() => {
        if (activeTab === 'Home' && !isSearchActive) {
            // Clear existing posts on tab switch to 'Home' to ensure freshness if desired, 
            // or just rely on the randomizer in fetchNewsFeed(1)
            fetchNewsFeed(page);
        }
    }, [page, activeTab, isSearchActive, fetchNewsFeed]);

    const lastPostRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    const lastTrendRef = useCallback(node => {
        if (loading) return;
        if (activeTab !== 'Trends') return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setTrendsPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, activeTab]);

    // Fetch Stories
    const fetchStories = async () => {
        const names = ['Alex', 'Emma', 'Sarah', 'Elena', 'Justin', 'Liam', 'Maria', 'Cody', 'Noah', 'Ava', 'Olivia'];
        let storyImages = [];
        let newsStories = [];

        try {
            // Fetch News for Stories
            const newsRes = await newsApi.getTopStories({ limit: 5 });
            if (newsRes.data) {
                newsStories = newsRes.data.map((n, i) => ({
                    id: `news-story-${i}`,
                    user: { username: n.source || 'News', pic: `https://ui-avatars.com/api/?name=${n.source}&background=random` },
                    image: n.image_url,
                    isUser: false,
                    isNews: true,
                    title: n.title // Extra field for news headline overlay
                }));
            }

            const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
            if (PEXELS_KEY) {
                // Use Date.now() to bust cache/ensure randomness
                const res = await fetch(`https://api.pexels.com/v1/search?query=portrait&per_page=${names.length}&page=${Math.floor(Math.random() * 10) + 1}`, {
                    headers: { Authorization: PEXELS_KEY }
                });
                const data = await res.json();
                storyImages = data.photos.map(p => p.src.large);
            }
        } catch (e) { console.error("Story fetch error", e); }

        const userStories = names.map((name, i) => ({
            id: i,
            user: { username: name, pic: `https://i.pravatar.cc/150?u=${name}${Math.random()}` },
            image: storyImages[i] || `https://source.unsplash.com/random/400x800?sig=${i + 200 + Math.random()}`,
            isUser: i === 0,
            isNews: false
        }));

        // Merge User Stories and News Stories and Shuffle slightly (keep User first)
        const combined = [...userStories, ...newsStories].sort(() => Math.random() - 0.5);

        // Ensure "Your Story" is always index 0 visually, but in state usually handled by UI. 
        // Here we just set the stories state.
        setStories(combined);
    };

    const openStory = (val) => {
        if (typeof val === 'number') {
            setActiveStoryIndex(val);
        } else if (typeof val === 'string') {
            const idx = stories.findIndex(s => s.user.username === val);
            if (idx !== -1) {
                setActiveStoryIndex(idx);
            } else {
                // Determine a consistent index based on username hash to show a "random" story
                const hash = val.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                setActiveStoryIndex(hash % stories.length);
            }
        }
        setIsStoryOpen(true);
    };

    const handleSearch = async (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && searchQuery.trim()) {
            setIsSearchActive(true);
            setTrendsPage(1); // Reset trends page for new search
            // The actual fetch will be handled by the useEffect for activeTab === 'Trends'
        }
    };

    const handleNavClick = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
        if (tab === 'Trends') {
            setIsSearchActive(true);
            setSearchQuery('trending'); // Set default search query for trends
            setTrendsPage(1); // Reset trends page when navigating to Trends tab
        } else if (tab === 'Home') {
            setIsSearchActive(false);
            setSearchQuery(''); // Clear search query when going home
            setSearchResults([]); // Clear search results
            setPage(1); // Reset feed page
        } else if (tab === 'Messages') {
            window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL'));
        } else if (tab === 'Main Screen') {
            navigate('/');
        }
    };

    // Sidebar items
    const primaryItems = [
        { name: 'Home', icon: Home },
        { name: 'Trends', icon: TrendingUp },
        { name: 'Shots', icon: PlaySquare },
        { name: 'Notifications', icon: Bell },
        { name: 'Messages', icon: Mail },
        { name: 'Main Screen', icon: LayoutGrid },
    ];

    const secondaryItems = [
        { name: 'Communities', icon: Globe },
        { name: 'Premium', icon: Star },
        { name: 'Bookmarked', icon: Bookmark },
    ];

    const onlineUsers = ['Brooklyn S.', 'Jerome Bell', 'Robert Fox', 'Jane Cooper', 'Floyd Miles', 'Ronald Richards'];



    // Fetch Trends (Default or Search)
    useEffect(() => {
        if (activeTab === 'Trends') {
            // If query empty, default to 'trending'
            const query = searchQuery || 'trending';

            const fetchTrends = async () => {
                setLoading(true);
                try {
                    const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
                    let newImages = [];

                    if (PEXELS_KEY) {
                        const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${trendsPage}`, {
                            headers: { Authorization: PEXELS_KEY }
                        });
                        const data = await res.json();
                        newImages = data.photos.map(p => p.src.large);
                    } else {
                        newImages = Array(15).fill(0).map((_, i) => `https://source.unsplash.com/random/800x600?${query}&sig=${trendsPage * 100 + i}`);
                    }

                    setSearchResults(prev => trendsPage === 1 ? newImages : [...prev, ...newImages]);
                } catch (err) { console.error(err); }
                setLoading(false);
            };
            fetchTrends();
        }
    }, [activeTab, trendsPage, searchQuery]);

    // Reset trends page when query changes (but not on initial tab switch if handled above)
    useEffect(() => {
        if (activeTab === 'Trends' && searchQuery !== 'trending') { // Only reset if it's a user-initiated search, not default 'trending'
            setTrendsPage(1);
        }
    }, [searchQuery, activeTab]);

    const toggleAction = (e) => {
        const target = e.currentTarget;
        target.classList.toggle('liked'); // Toggles heart color
        // Optional: Animate heart
        target.style.transform = target.classList.contains('liked') ? 'scale(1.2)' : 'scale(1)';
        setTimeout(() => target.style.transform = 'scale(1)', 200);
    };

    const handleDoubleTap = (e) => {
        const card = e.currentTarget;
        const fire = document.createElement('div');
        fire.innerHTML = `<svg width="100" height="100" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

        fire.style.position = 'absolute';
        fire.style.top = '50%';
        fire.style.left = '50%';
        fire.style.transform = 'translate(-50%, -50%) scale(0)';
        fire.style.animation = 'likeBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        fire.style.zIndex = 20;
        fire.style.pointerEvents = 'none';

        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }

        card.appendChild(fire);
        setTimeout(() => fire.remove(), 800);

        const btn = card.querySelector('.like-btn');
        if (btn) {
            btn.classList.add('liked');
            btn.style.transform = 'scale(1.4)';
            setTimeout(() => btn.style.transform = 'scale(1)', 300);
        }
    };



    const handleShare = (post) => {
        // Link to Feed page with post query param
        const link = `${window.location.origin}/feed?post=${post.id}`;
        navigator.clipboard.writeText(link);
        // Silent copy - no alerts, no navigation
    };

    const renderContent = () => {
        if (activeTab === 'Shots') return <ShortsSection onBack={() => setActiveTab('Home')} onOpenStory={openStory} />;

        if (isSearchActive || activeTab === 'Trends') {
            return (
                <div style={{ marginTop: '0px' }}> {/* Container for search results */}
                    {/* Search bar is already rendered in the main layout above renderContent */}
                    <div className="image-grid" style={{ marginTop: '20px' }}> {/* Added margin to separate from top */}
                        {searchResults.length > 0 ? searchResults.map((src, i) => (
                            <div key={i} className="grid-item" ref={i === searchResults.length - 1 ? lastTrendRef : null}>
                                <img src={src} alt="Result" />
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                {loading ? 'Loading Trends...' : 'Explore trending topics or search above.'}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="feed" id="feed-posts">
                {posts.map((post, index) => (
                    <div
                        key={`${post.id}-${index}`}
                        id={`post-${post.id}`} /* Add ID for scrolling */
                        className="post-card"
                        ref={index === posts.length - 1 ? lastPostRef : null}
                        onDoubleClick={handleDoubleTap}
                        style={{ position: 'relative' }} /* Force relative for centering */
                    >
                        {post.isRoom ? (
                            <div style={{ background: 'linear-gradient(45deg, #2563eb, #9333ea)', borderRadius: '12px', padding: '20px', color: 'white', textAlign: 'center' }}>
                                <h3>🎵 Live Room Active</h3>
                                <p>{post.content}</p>
                                <button style={{ marginTop: '10px', padding: '8px 20px', background: 'white', color: '#2563eb', border: 'none', borderRadius: '20px', fontWeight: 'bold' }}>Join Room</button>
                            </div>
                        ) : (
                            <>
                                <div className="post-header">
                                    <img src={post.user.pic} className="post-avatar" alt={post.user.name} />
                                    <div className="post-info">
                                        <h4>{post.user.name}</h4>
                                        <span>{post.user.handle} • {post.time}</span>
                                    </div>
                                </div>
                                <PostContent content={post.content} />
                                {post.image && <img src={post.image} className="post-img" alt="Post" />}

                                <div className="alien-actionBtns">
                                    <div className="left">
                                        <div className="flex items-center gap-1">
                                            <Flame size={22} className="alien-icon like-btn" onClick={toggleAction} />
                                            <span className="text-sm font-semibold text-[var(--text-muted)]">{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle size={22} className="alien-icon" />
                                            <span className="text-sm font-semibold text-[var(--text-muted)]">{post.comments}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Repeat size={22} className="alien-icon" />
                                        </div>
                                        <div className="flex items-center" onClick={() => handleShare(post)}>
                                            <Share2 size={22} className="alien-icon share-btn" />
                                        </div>
                                    </div>
                                    <div className="right">
                                        <Bookmark size={22} className="alien-icon" />
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                ))
                }
                {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
            </div >
        );
    };

    return (
        <div className="new-feed-container" data-theme={theme}>
            <div className={`app-container ${activeTab === 'Shots' ? 'full-height-mobile' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

                {/* SIDEBAR LEFT */}
                <aside className={`sidebar-left ${sidebarOpen ? 'mobile-visible open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`} style={sidebarOpen ? {
                    display: 'flex', position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 1000, width: '240px', boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
                } : { width: sidebarCollapsed ? '80px' : '240px' }}>

                    <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                        <Zap size={24} /> <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Happyytalk</span>
                    </div>

                    <nav className="side-nav">
                        {/* Primary Items */}
                        {primaryItems.map((item) => (
                            <div
                                key={item.name}
                                className={`side-link ${activeTab === item.name ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.name)}
                                title={sidebarCollapsed ? item.name : ''}
                                style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                            >
                                <item.icon size={20} />
                                <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>{item.name}</span>
                            </div>
                        ))}

                        {/* Expand/Collapse Button (Show More) */}
                        <button
                            className="side-link"
                            style={{ width: '100%', border: 'none', background: 'none', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                            onClick={() => setSidebarExpanded(!sidebarExpanded)}
                        >
                            {sidebarExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>{sidebarExpanded ? 'Show Less' : 'Show More'}</span>
                        </button>

                        {/* Secondary Items */}
                        {sidebarExpanded && (
                            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                                {secondaryItems.map((item) => (
                                    <div
                                        key={item.name}
                                        className={`side-link ${activeTab === item.name ? 'active' : ''}`}
                                        onClick={() => handleNavClick(item.name)}
                                        style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                                    >
                                        <item.icon size={20} />
                                        <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>{item.name}</span>
                                    </div>
                                ))}

                                {/* Moved More Items */}
                                <div className="side-link" onClick={() => handleNavClick('Settings')} style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                                    <Settings size={20} /> <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Settings</span>
                                </div>
                                <div className="side-link" onClick={() => handleNavClick('Activity')} style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                                    <Activity size={20} /> <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Your Activity</span>
                                </div>
                                <div className="side-link" onClick={() => handleNavClick('Switch')} style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                                    <UserCircle size={20} /> <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Switch Accounts</span>
                                </div>
                                <div className="side-link" onClick={() => alert('Logged Out')} style={{ color: '#ef4444', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                                    <LogOut size={20} /> <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Log Out</span>
                                </div>
                            </div>
                        )}

                        <div className="side-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '15px 0' }}></div>

                        {/* Create Post Action */}
                        <div
                            className="side-link"
                            style={{ color: 'var(--primary-blue)', fontWeight: 'bold', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                            onClick={() => { setCreateModalOpen(true); setSidebarOpen(false); }}
                        >
                            <Plus size={20} />
                            <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Create Post</span>
                        </div>

                        {/* Profile Link */}
                        <div
                            className={`side-link ${activeTab === 'Profile' ? 'active' : ''}`}
                            onClick={() => handleNavClick('Profile')}
                            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                        >
                            <User size={20} />
                            <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Profile</span>
                        </div>

                        {/* Desktop Sidebar Toggle (Collapse/Expand) */}
                        <button
                            className="side-link desktop-only"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            style={{ marginTop: '10px', border: 'none', background: 'none', color: 'var(--text-muted)', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                        >
                            {sidebarCollapsed ? <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} /> : <ArrowLeft size={20} />}
                            <span style={{ display: sidebarCollapsed ? 'none' : 'block' }}>Collapse</span>
                        </button>
                        <style>{`@media(max-width: 900px) { .desktop-only { display: none !important; } }`}</style>
                    </nav>

                    {/* Online Users Section below Nav */}
                    {!sidebarCollapsed && (
                        <div className="desktop-only" style={{ padding: '0 20px', marginTop: '10px', flex: 1, overflowY: 'auto' }}>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '10px' }}>
                                Online People
                            </div>
                            <div className="flex -space-x-2 overflow-hidden mb-4 p-2">
                                {onlineUsers.map((u, i) => (
                                    <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--card-bg)]" src={`https://i.pravatar.cc/150?u=${u}`} alt={u} />
                                ))}
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold ring-2 ring-white">+5</div>
                            </div>
                        </div>
                    )}


                    {/* Close button removed as per request */}
                </aside>

                {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

                {/* MAIN CONTENT */}
                <main className="main-content" style={activeTab === 'Shots' ? { padding: 0, overflow: 'hidden' } : {}}>
                    {activeTab !== 'Shots' && (
                        <>
                            <div className="top-navbar">
                                <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', marginRight: '10px', display: 'none' }}>
                                    <Menu size={24} color="var(--text-main)" />
                                </button>
                                <style>{`@media(max-width: 600px) { .mobile-menu-btn { display: block !important; } }`}</style>

                                <div className="mobile-brand"> <Zap size={24} /> Happyytalk </div>

                                <div className={`search-bar desktop-only`}>
                                    <Search size={18} color="#64748b" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                </div>

                                <button className="theme-btn-top" onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                                    {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                                </button>
                            </div>

                            {/* Mobile Dedicated Search Bar */}
                            <div className={`mobile-search-container ${isSearchActive ? 'visible' : ''}`}>
                                <Search size={18} color="#64748b" />
                                <input
                                    type="text"
                                    placeholder="Search trends, people..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="clear-btn">
                                        <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs">x</div>
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Stories Rail */}
                    {!isSearchActive && activeTab === 'Home' && (
                        <div className="stories-row">
                            <div className="story-circle" onClick={() => setCreateModalOpen(true)}>
                                <div className="img-wrap" style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
                                    <User color="#64748b" />
                                    <div className="plus-badge"><Plus size={12} /></div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>Your Story</div>
                            </div>
                            {stories.map((s, i) => (
                                <div key={i} className="story-circle" onClick={() => openStory(i)}>
                                    <div className="img-wrap">
                                        <img src={s.user.pic} alt={s.user.username} />
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>{s.user.username}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {renderContent()}
                </main>

                {/* SIDEBAR RIGHT */}
                <aside className="sidebar-right">
                    <div className="sidebar-box">
                        <h3 className="sidebar-title" style={{ color: 'var(--text-main)' }}>Trends for you</h3>
                        <div className="flex flex-col gap-4">
                            {['#HappyyTalk', 'F1 2026', '#CodeLife', 'ReactJS', '#SummerVibes', 'AI Revolution'].map((tag, i) => (
                                <div key={i} className="cursor-pointer" onClick={() => { setSearchQuery(tag); handleNavClick('Trends'); }}>
                                    <div className="text-xs text-[var(--text-muted)]">Trending</div>
                                    <div className="font-bold text-[var(--text-main)]">{tag}</div>
                                </div>
                            ))}
                        </div>

                        <div className="side-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '20px 0' }}></div>

                        <h3 className="sidebar-title" style={{ color: 'var(--text-main)' }}>Suggested for you</h3>
                        <div className="flex flex-col gap-3">
                            {['Alex', 'Emma', 'Sarah', 'Justin'].map((name, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={`https://i.pravatar.cc/150?u=${name}`} style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt={name} />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--text-main)' }}>{name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@suggested</div>
                                        </div>
                                    </div>
                                    <button style={{ background: 'var(--text-main)', color: 'var(--bg-color)', border: 'none', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Follow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Create Post Modal */}
                {createModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={(e) => { if (e.target === e.currentTarget) setCreateModalOpen(false) }}>
                        <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl slide-in-from-bottom-5 relative">
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                            >
                                <X size={24} />
                            </button>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Create</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { icon: Image, label: 'Image', color: '#3b82f6' },
                                    { icon: Video, label: 'Video', color: '#ef4444' },
                                    { icon: Music, label: 'Audio', color: '#a855f7' },
                                    { icon: Type, label: 'Text', color: '#f59e0b' },
                                    { icon: BarChart2, label: 'Poll', color: '#10b981' },
                                    { icon: Users, label: 'Room', color: '#6366f1' },
                                    { icon: Radio, label: 'Go Live', color: '#ec4899' },
                                ].map((opt, i) => (
                                    <button key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-color)] bg-[var(--container-bg)]" onClick={() => { }}>
                                        <div style={{ color: opt.color, marginBottom: '8px' }}><opt.icon size={28} /></div>
                                        <span style={{ color: 'var(--text-main)', fontSize: '13px', fontWeight: '600' }}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Story Modal */}
                <StoryModal
                    isOpen={isStoryOpen}
                    stories={stories}
                    activeIndex={activeStoryIndex}
                    onClose={() => setIsStoryOpen(false)}
                    onNext={() => setActiveStoryIndex(prev => (prev + 1) % stories.length)}
                    onPrev={() => setActiveStoryIndex(prev => (prev - 1 + stories.length) % stories.length)}
                />

                {/* Mobile Bottom Nav */}
                <nav className="mobile-bottom-nav">
                    <button className={`mobile-nav-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => handleNavClick('Home')}>
                        <Home size={24} />
                        <span>Home</span>
                    </button>
                    <button className={`mobile-nav-item ${activeTab === 'Trends' ? 'active' : ''}`} onClick={() => { setIsSearchActive(true); handleNavClick('Trends'); }}>
                        <Search size={24} />
                        <span>Search</span>
                    </button>
                    <button className="mobile-nav-item create-nav-btn" onClick={() => setCreateModalOpen(true)}>
                        <div style={{ background: 'var(--primary-blue)', borderRadius: '50%', padding: '12px', marginTop: '-25px', border: '4px solid var(--container-bg)' }}>
                            <Plus size={24} color="white" />
                        </div>
                        <span style={{ marginTop: '4px' }}>Post</span>
                    </button>
                    <button className={`mobile-nav-item ${activeTab === 'Shots' ? 'active' : ''}`} onClick={() => handleNavClick('Shots')}>
                        <PlaySquare size={24} />
                        <span>Shots</span>
                    </button>
                    <button className="mobile-nav-item" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                        <span>Back</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default FeedPage;
