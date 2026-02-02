
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { newsApi } from '../api/newsApi';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/feed-page.css';

// --- Name Database & Helper ---
const NAME_REGISTRY = {
    English: { m: ["James", "John", "Robert", "Michael", "William"], f: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth"] },
    Spanish: { m: ["Antonio", "Manuel", "José", "Francisco", "Juan"], f: ["María", "Carmen", "Ana", "Isabel", "Dolores"] },
    Arabic: { m: ["Ahmed", "Mohamed", "Omar", "Khaled", "Tariq"], f: ["Fatima", "Aisha", "Layla", "Zainab", "Nora"] },
    Japanese: { m: ["Hiroshi", "Kenji", "Takashi", "Haruto", "Ren"], f: ["Sakura", "Yui", "Aoi", "Hana", "Mei"] },
    Hindi: { m: ["Aarav", "Vihaan", "Arjun", "Sai", "Reyansh"], f: ["Aanya", "Diya", "Anika", "Priya", "Saanvi"] },
    Russian: { m: ["Alexander", "Dmitry", "Mikhail", "Ivan", "Sergei"], f: ["Anastasia", "Maria", "Sofia", "Anna", "Ekaterina"] },
    Turkish: { m: ["Mehmet", "Mustafa", "Ali", "Ahmet", "Emre"], f: ["Ayşe", "Fatma", "Zeynep", "Elif", "Merve"] },
    Swahili: { m: ["Juma", "Baraka", "Simba", "Jabari", "Faraji"], f: ["Neema", "Amani", "Zawadi", "Asha", "Imani"] },
    French: { m: ["Jean", "Pierre", "Michel", "Philippe", "Alain"], f: ["Marie", "Nathalie", "Isabelle", "Sophie", "Françoise"] },
    Portuguese: { m: ["João", "Pedro", "Tiago", "António", "Francisco"], f: ["Maria", "Ana", "Matilde", "Beatriz", "Mariana"] },
    German: { m: ["Thomas", "Michael", "Andreas", "Stefan", "Markus"], f: ["Maria", "Ursula", "Monika", "Sabine", "Petra"] },
    Italian: { m: ["Andrea", "Marco", "Alessandro", "Luca", "Matteo"], f: ["Maria", "Anna", "Giuseppina", "Rosa", "Angela"] },
    Korean: { m: ["Min-jun", "Seo-jun", "Do-yun", "Ha-joon"], f: ["Ji-woo", "Seo-yeon", "Ha-yoon", "Seo-yoon"] }
};

const getRandomUser = () => {
    const cultures = Object.keys(NAME_REGISTRY);
    const culture = cultures[Math.floor(Math.random() * cultures.length)];
    const isMale = Math.random() > 0.5;
    const nameList = isMale ? NAME_REGISTRY[culture].m : NAME_REGISTRY[culture].f;
    const name = nameList[Math.floor(Math.random() * nameList.length)];
    return {
        name,
        username: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_') + Math.floor(Math.random() * 1000),
        pic: `https://i.pravatar.cc/150?u=${name}${Math.random()}`,
        location: `${culture} Region`
    };
};

const FAMOUS_PROFILES = [
    { name: "Cristiano Ronaldo", username: "cristiano", pic: "https://i.pravatar.cc/150?u=cristiano", location: "Turin, Italy" },
    { name: "Taylor Swift", username: "taylorswift", pic: "https://i.pravatar.cc/150?u=taylor", location: "Nashville, USA" },
    { name: "The Rock", username: "therock", pic: "https://i.pravatar.cc/150?u=rock", location: "Miami, USA" },
    { name: "Selena Gomez", username: "selenagomez", pic: "https://i.pravatar.cc/150?u=selena", location: "LA, USA" },
    { name: "Lionel Messi", username: "leomessi", pic: "https://i.pravatar.cc/150?u=messi", location: "Paris, France" }
];

const PEXELS_KEY = 'XkN36hK2S0z876lWSlI5YoB9ZscPAq4cZbcL6SXABt9CyZmqBwwjov1P';

// --- Story Modal Component ---
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="story-modal"
                onClick={onClose}
            >
                <motion.div
                    className="story-modal-content"
                    onClick={(e) => e.stopPropagation()}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset }) => {
                        if (offset.x > 100) onPrev();
                        else if (offset.x < -100) onNext();
                    }}
                >
                    <div className="story-progress-container">
                        {stories.map((_, i) => (
                            <div key={i} className="story-progress-bar">
                                <div
                                    className="story-progress-fill"
                                    style={{
                                        width: i < activeIndex ? '100%' : i === activeIndex ? `${progress}%` : '0%',
                                        transition: i === activeIndex ? 'none' : '0.3s'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="story-header">
                        <div className="usrProfile">
                            <div className="uplogo"><img src={currentStory.user.pic} alt="" /></div>
                            <p style={{ color: '#fff' }}>{currentStory.user.username} <small>Sponsored</small></p>
                        </div>
                        <button className="story-close" onClick={onClose}><i className="fas fa-times"></i></button>
                    </div>

                    <img src={currentStory.image} alt="Story" className="story-image" />

                    <div className="story-nav story-nav-prev" onClick={onPrev}></div>
                    <div className="story-nav story-nav-next" onClick={onNext}></div>

                    <div className="story-footer">
                        <input type="text" placeholder="Send message..." className="story-input" />
                        <i
                            className={`${liked ? 'fas' : 'far'} fa-heart`}
                            style={{ color: liked ? '#ed4956' : '#fff' }}
                            onClick={() => setLiked(!liked)}
                        ></i>
                        <i className="far fa-paper-plane"></i>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- ProfileView (User) Component ---
const ProfileView = ({ user }) => {
    const [activeTab, setActiveTab] = useState('grid');
    const posts = Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        url: `https://images.pexels.com/photos/${1000 + i * 150}/pexels-photo-${1000 + i * 150}.jpeg?auto=compress&cs=tinysrgb&w=300`
    }));

    return (
        <div className="user-profile-view">
            <div className="profile-header-top">
                <p>{user.username} <span><img src="https://img.icons8.com/ios/30/000000/expand-arrow--v3.png" style={{ width: 10 }} alt="" /></span></p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <img src="https://img.icons8.com/ios/50/000000/plus-2-math.png" style={{ width: 30 }} alt="" />
                    <img src="https://img.icons8.com/ios-filled/50/000000/menu--v2.png" style={{ width: 30 }} alt="" />
                </div>
            </div>

            <div className="profile-bio-section">
                <div className="bio-top">
                    <div className="profile-main-pic" style={{ backgroundImage: `url(${user.pic})` }}></div>
                    <div className="stats-flex">
                        <div className="stat-item"><span className="num">14</span><span className="label">Posts</span></div>
                        <div className="stat-item"><span className="num">230</span><span className="label">Followers</span></div>
                        <div className="stat-item"><span className="num">400</span><span className="label">Following</span></div>
                    </div>
                </div>
                <p className="profile-name">{user.name}</p>
                <p className="profile-bio-text">Hi peeps! Exploring the digital world. ✨</p>

                <div className="edit-profile-row">
                    <div className="edit-btn-box">Edit Profile</div>
                    <div className="arrow-btn-box">
                        <img src="https://img.icons8.com/ios/30/000000/expand-arrow--v3.png" style={{ width: 10 }} alt="" />
                    </div>
                </div>
            </div>

            <div className="highlights-section">
                <p className="highlights-title">Story Highlights</p>
                <p style={{ fontSize: 12, color: '#888' }}>Keep your favourite stories on your profile</p>
                <div className="highlights-list">
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/airport.png)' }}></div>
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/new-delhi.png)' }}></div>
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/hamburger.png)' }}></div>
                    <div className="highlight-item highlight-plus">
                        <img src="https://img.icons8.com/android/24/000000/plus.png" style={{ width: 20 }} alt="" />
                    </div>
                    <div className="highlight-item" style={{ backgroundColor: '#e5e4e2' }}></div>
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
                {posts.map(post => (
                    <div key={post.id} className="profile-post-item">
                        <img src={post.url} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ExploreGrid Component ---
const ExploreGrid = () => {
    const [content, setContent] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const fetchExplore = useCallback(async (p) => {
        setLoading(true);
        try {
            const pexelsRes = await fetch(`https://api.pexels.com/v1/curated?per_page=12&page=${p}`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexData = await pexelsRes.json();
            const newsRes = await newsApi.getAllNews({ page: p, limit: 3 });
            const combined = [
                ...pexData.photos.map(ph => ({ type: 'image', id: ph.id, url: ph.src.large })),
                ...newsRes.data.map(ns => ({ type: 'news', id: ns.uuid, title: ns.title, url: ns.image_url }))
            ];
            setContent(prev => [...prev, ...combined.sort(() => Math.random() - 0.5)]);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchExplore(page); }, [page, fetchExplore]);

    const lastRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setPage(p => p + 1);
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    return (
        <div className="img-grid">
            {content.map((item, i) => (
                <div key={`${item.id}-${i}`} className="grid-item" ref={i === content.length - 1 ? lastRef : null}>
                    <img src={item.url} alt="" />
                    {item.type === 'news' && <div className="news-label" style={{ position: 'absolute', bottom: 5, left: 5 }}>NEWS</div>}
                </div>
            ))}
            {loading && <div className="loader-feed">Discovery loading...</div>}
        </div>
    );
};

// --- ReelSection Component ---
const ReelSection = () => {
    const [interactions, setInteractions] = useState({});
    const reelVideos = [
        { id: "M7lc1UVf-VE", username: "GoogleTech", desc: "The beauty of code. 🤖 #tech #coding" },
        { id: "LXb3EKWsInQ", username: "ArtStation", desc: "Mastering light and shadow. 🎨 #digitalart" },
        { id: "aqz-KE-bpKQ", username: "NatureVibe", desc: "Serenity in the forest. 🍃 #nature" },
        { id: "jNQXAC9IVRw", username: "YouTubeHistory", desc: "Where it all started. 🐘 #classic" },
        { id: "d_BThelYlqE", username: "AeroDrones", desc: "Eagle eye view of the coast. 🌊 #drones" }
    ];

    const toggle = (id, field) => {
        setInteractions(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: !prev[id]?.[field] }
        }));
    };

    return (
        <div className="reels-scroll-container">
            {reelVideos.map((video, idx) => (
                <div key={idx} className="reel-container">
                    <div className="reel-section">
                        <div className="phone-mic"></div>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#000' }}>
                            <iframe
                                className="iframe-reel"
                                width="100%" height="100%"
                                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&modestbranding=1&rel=0`}
                                frameBorder="0" allow="autoplay; encrypted-media" title="Video"
                            />
                        </div>

                        <div className="post-section">
                            <div className="pshead">
                                <h4>HappyTalk Reels</h4>
                                <button className="iconbtn"><i className="fas fa-camera"></i></button>
                            </div>
                            <div className="psfooter">
                                <div className="usrProfile">
                                    <div className="uplogo"><img src={`https://i.pravatar.cc/150?u=${video.username}`} alt="" /></div>
                                    <p>{video.username} <small>Verified Content</small></p>
                                </div>
                                <p>{video.desc}</p>
                            </div>
                            <div className="action-btn">
                                <ul>
                                    <li>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'liked')}>
                                            <i className={`fas fa-heart ${interactions[video.id]?.liked ? 'liked' : ''}`}></i>
                                        </button>
                                        <p>{interactions[video.id]?.liked ? '13.1K' : '13K'}</p>
                                    </li>
                                    <li><button className="iconbtn"><i className="fas fa-comment"></i></button><p>450</p></li>
                                    <li>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'shared')}>
                                            <i className={`fas fa-paper-plane ${interactions[video.id]?.shared ? 'shared' : ''}`}></i>
                                        </button>
                                        <p>Share</p>
                                    </li>
                                    <li>
                                        <button className="iconbtn" onClick={() => toggle(video.id, 'saved')}>
                                            <i className={`fas fa-bookmark ${interactions[video.id]?.saved ? 'saved' : ''}`}></i>
                                        </button>
                                        <p>Save</p>
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

// --- Main FeedPage Component ---
const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('home');
    const [likedPosts, setLikedPosts] = useState({});
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [storyModal, setStoryModal] = useState({ isOpen: false, index: 0 });
    const [stories, setStories] = useState([]);
    const [selectedUser, setSelectedUser] = useState(getRandomUser());

    const { theme, changeTheme } = useTheme();
    const observer = useRef();

    const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
    const toggleTheme = () => changeTheme(theme === 'light' ? 'dark' : 'light');
    const toggleLike = (id) => setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch(`https://api.pexels.com/v1/search?query=portrait&orientation=portrait&per_page=15`, {
                    headers: { Authorization: PEXELS_KEY }
                });
                const data = await res.json();
                setStories(data.photos.map(ph => ({
                    user: getRandomUser(),
                    image: ph.src.large,
                    id: ph.id,
                    isUpdate: Math.random() > 0.3
                })));
            } catch (err) { console.error(err); }
        };
        fetchStories();
    }, []);

    const fetchHomePosts = useCallback(async (p) => {
        setLoading(true);
        try {
            const pexRes = await fetch(`https://api.pexels.com/v1/curated?per_page=10&page=${p}`, {
                headers: { Authorization: PEXELS_KEY }
            });
            const pexData = await pexRes.json();
            const newsRes = await newsApi.getHeadlines({ page: p, limit: 5 });
            const newPosts = [
                ...pexData.photos.map(ph => {
                    const isFamous = Math.random() > 0.8;
                    const user = isFamous ? FAMOUS_PROFILES[Math.floor(Math.random() * FAMOUS_PROFILES.length)] : getRandomUser();
                    return {
                        id: ph.id,
                        type: 'post',
                        user,
                        image: ph.src.large2x,
                        likes: Math.floor(Math.random() * 10000),
                        caption: ph.alt || "Captured a special perspective today.",
                        time: "Active now",
                        comments: Math.floor(Math.random() * 300)
                    };
                }),
                ...newsRes.data.map(ns => ({
                    id: ns.uuid,
                    type: 'news',
                    user: { username: ns.source, pic: "https://cdn-icons-png.flaticon.com/512/21/21601.png", name: ns.source, location: "Global News" },
                    image: ns.image_url,
                    likes: Math.floor(Math.random() * 500),
                    caption: ns.title,
                    time: "Breaking News",
                    comments: Math.floor(Math.random() * 50)
                }))
            ].sort(() => Math.random() - 0.5);
            setPosts(prev => [...prev, ...newPosts]);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchHomePosts(page); }, [page, fetchHomePosts]);

    const lastPostRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setPage(prev => prev + 1);
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    const openProfile = (user) => {
        setSelectedUser(user);
        setActiveView('user');
    };

    const isDarkMode = theme === 'dark' || theme === 'space';

    const renderContent = () => {
        if (activeView === 'explore') return <ExploreGrid />;
        if (activeView === 'video') return <ReelSection />;
        if (activeView === 'user') return <ProfileView user={selectedUser} />;

        return (
            <div className="main-content-feed">
                <div className="stories-container">
                    <ul className="stories" style={{ listStyle: 'none', display: 'flex', gap: 15 }}>
                        <li className="flex flex-none flex-col items-center space-y-1" style={{ textAlign: 'center' }}>
                            <div className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1 rounded-full" style={{ padding: 3, background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderRadius: '50%' }}>
                                <a href="#0" className="block bg-white p-1 rounded-full relative" style={{ display: 'block', background: isDarkMode ? '#000' : '#fff', padding: 2, borderRadius: '50%', position: 'relative' }}>
                                    <img src="https://i.pravatar.cc/150?u=me" alt="Me" className="w-16 h-16 rounded-full object-cover" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-1" style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid white', borderRadius: '50%' }}>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.125 16C12.4742 16 16 12.4742 16 8.125C16 3.77576 12.4742 0.25 8.125 0.25C3.77576 0.25 0.25 3.77576 0.25 8.125C0.25 12.4742 3.77576 16 8.125 16Z" fill="#0074cc" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.61719 4.67969C8.61719 4.40786 8.39683 4.1875 8.125 4.1875C7.85317 4.1875 7.63281 4.40786 7.63281 4.67969V7.63281H4.67969C4.40786 7.63281 4.1875 7.85317 4.1875 8.125C4.1875 8.39683 4.40786 8.61719 4.67969 8.61719H7.63281V11.5703C7.63281 11.8421 7.85317 12.0625 8.125 12.0625C8.39683 12.0625 8.61719 11.8421 8.61719 11.5703V8.61719H11.5703C11.8421 8.61719 12.0625 8.39683 12.0625 8.125C12.0625 7.85317 11.8421 7.63281 11.5703 7.63281H8.61719V4.67969Z" fill="#FFFFFF" />
                                    </svg>
                                </a>
                            </div>
                            <span className="text-xs font-semibold" style={{ fontSize: 12, display: 'block', marginTop: 5 }}>Your story</span>
                        </li>
                        {stories.map((s, i) => (
                            <li key={i} className="flex flex-none flex-col items-center space-y-1" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setStoryModal({ isOpen: true, index: i })}>
                                <div className={s.isUpdate ? "bg-active" : ""} style={{ padding: 3, borderRadius: '50%', background: s.isUpdate ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' : '#ddd' }}>
                                    <div style={{ background: isDarkMode ? '#000' : '#fff', padding: 2, borderRadius: '50%' }}>
                                        <img src={s.user.pic} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <span style={{ fontSize: 11, display: 'block', marginTop: 5 }}>{s.user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {posts.map((post, i) => (
                    <div key={`${post.id}-${i}`} className={`post-feed ${post.type === 'news' ? 'news-post' : ''}`} ref={i === posts.length - 1 ? lastPostRef : null}>
                        <div className="post-header">
                            <div className="post-user" onClick={() => openProfile(post.user)} style={{ cursor: 'pointer' }}>
                                <img src={post.user.pic} alt="" className="post-user-pic" />
                                <div className="post-user-info">
                                    <div className="post-username">{post.user.username} {post.type === 'news' && <i className="fas fa-check-circle" style={{ color: '#1DA1F2', fontSize: 12 }} />}</div>
                                    <div className="post-location">{post.user.location}</div>
                                </div>
                            </div>
                            <i className="fas fa-ellipsis-h" />
                        </div>
                        <img src={post.image} alt="" className="post-image" />
                        <div className="post-actions">
                            <div className="post-actions-left">
                                <i className={`fa-heart ${likedPosts[post.id] ? 'fas liked' : 'far'} post-action`} onClick={() => setLikedPosts({ ...likedPosts, [post.id]: !likedPosts[post.id] })} />
                                <i className="far fa-comment post-action" />
                                <i className="far fa-paper-plane post-action" />
                            </div>
                            <i className="far fa-bookmark post-action" />
                        </div>
                        <div className="post-likes">{(post.likes + (likedPosts[post.id] ? 1 : 0)).toLocaleString()} likes</div>
                        <div className="post-caption"><span className="post-caption-user">{post.user.username}</span>{post.caption}</div>
                        <div className="post-comments">View all {post.comments} comments</div>
                        <div className="post-time">{post.time}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`feed-page-root ${isDarkMode ? 'dark-mode' : ''}`}>
            <StoryModal
                isOpen={storyModal.isOpen} stories={stories} activeIndex={storyModal.index}
                onClose={() => setStoryModal({ ...storyModal, isOpen: false })}
                onNext={() => setStoryModal(p => ({ ...p, index: (p.index + 1) % stories.length }))}
                onPrev={() => setStoryModal(p => ({ ...p, index: (p.index - 1 + stories.length) % stories.length }))}
            />

            <div className={`left-sidebar-overlay ${isLeftSidebarOpen ? 'active' : ''}`} onClick={toggleLeftSidebar}></div>
            <div className={`left-sidebar-feed ${isLeftSidebarOpen ? 'active' : ''}`}>
                <div className="left-sidebar-header">
                    <div className="logo-feed" onClick={() => setActiveView('home')}>HappyTalk<span>.in</span></div>
                    <button className="close-sidebar" onClick={toggleLeftSidebar}><i className="fas fa-times"></i></button>
                </div>
                <nav className="left-sidebar-nav">
                    <a className={activeView === 'home' ? 'active' : ''} onClick={() => { setActiveView('home'); setIsLeftSidebarOpen(false); }}><i className="fas fa-home"></i> <span>Home</span></a>
                    <a className={activeView === 'explore' ? 'active' : ''} onClick={() => { setActiveView('explore'); setIsLeftSidebarOpen(false); }}><i className="fas fa-search"></i> <span>Explore</span></a>
                    <a className={activeView === 'video' ? 'active' : ''} onClick={() => { setActiveView('video'); setIsLeftSidebarOpen(false); }}><ReelIcon /> <span>Reels</span></a>
                    <a onClick={() => { openProfile({ username: 'happy_user_2024', name: 'Global Citizen', pic: 'https://i.pravatar.cc/150?u=me' }); setIsLeftSidebarOpen(false); }}><i className="fas fa-user"></i> <span>Profile</span></a>
                </nav>
            </div>

            <header className="header-feed">
                <div className="header-content">
                    <div className="header-left">
                        <button className="menu-toggle" onClick={toggleLeftSidebar}><i className="fas fa-bars"></i></button>
                        <div className="logo-feed" onClick={() => setActiveView('home')}>HappyTalk<span>.in</span></div>
                    </div>
                    <div className="search-box-feed">
                        <i className="fas fa-search" />
                        <input type="text" placeholder="Search world news..." onFocus={() => setActiveView('explore')} />
                    </div>
                    <div className="nav-icons-feed">
                        <a onClick={toggleTheme}><i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i></a>
                        <a onClick={() => setActiveView('home')}><i className="fas fa-home"></i></a>
                        <img src="https://i.pravatar.cc/150?u=me" alt="" className="profile-pic-small" onClick={() => openProfile({ username: 'happy_user_2024', name: 'Global Citizen', pic: 'https://i.pravatar.cc/150?u=me' })} />
                    </div>
                </div>
            </header>

            <div className={`container-feed ${isLeftSidebarOpen ? 'with-sidebar' : ''}`}>
                {renderContent()}
                {activeView === 'home' && (
                    <div className="sidebar-feed">
                        <div className="profile-card" onClick={() => openProfile({ username: 'happy_user_2024', name: 'Global Citizen', pic: 'https://i.pravatar.cc/150?u=me' })} style={{ cursor: 'pointer' }}>
                            <img src="https://i.pravatar.cc/150?u=me" alt="" className="profile-card-pic" />
                            <div className="profile-card-info">
                                <div className="profile-card-username">happy_user_2024</div>
                                <div className="profile-card-name">Global Citizen</div>
                            </div>
                        </div>
                        <div className="suggestions">
                            <div className="suggestions-title">Influencers to Follow</div>
                            {FAMOUS_PROFILES.slice(0, 5).map((u, i) => (
                                <div key={i} className="suggestion-user" onClick={() => openProfile(u)} style={{ cursor: 'pointer' }}>
                                    <div className="suggestion-user-info">
                                        <img src={u.pic} alt="" className="suggestion-user-pic" />
                                        <div>
                                            <div className="suggestion-username">{u.username} <i className="fas fa-check-circle" style={{ color: '#1DA1F2', fontSize: 10 }} /></div>
                                            <div className="suggestion-followers">Famous Personality</div>
                                        </div>
                                    </div>
                                    <button className="follow-btn">Follow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mobile-bottom-nav-feed">
                <a className={activeView === 'home' ? 'active' : ''} onClick={() => setActiveView('home')}><i className="fas fa-home"></i></a>
                <a className={activeView === 'explore' ? 'active' : ''} onClick={() => setActiveView('explore')}><i className="fas fa-search"></i></a>
                <a className="add-nav-item"><i className="fas fa-plus"></i></a>
                <a className={activeView === 'video' ? 'active' : ''} onClick={() => setActiveView('video')}><ReelIcon /></a>
                <img src="https://i.pravatar.cc/150?u=me" alt="" className="mobile-profile-pic" onClick={() => openProfile({ username: 'happy_user_2024', name: 'Global Citizen', pic: 'https://i.pravatar.cc/150?u=me' })} />
            </div>
        </div>
    );
};

const ReelIcon = () => (
    <svg aria-label="Reels" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="13.504" x2="16.362" y1="2.001" y2="7.002"></line>
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="7.207" x2="10.002" y1="2.11" y2="7.002"></line>
        <path d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <path d="M9.763 17.664a.908.908 0 01-.454-.787V11.63a.909.909 0 011.364-.788l4.545 2.624a.909.909 0 010 1.575l-4.545 2.624a.91.91 0 01-.51.012z"></path>
    </svg>
);

export default FeedPage;
