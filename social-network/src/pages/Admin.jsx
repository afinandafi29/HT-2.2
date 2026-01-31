import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Settings, Trash2, Plus, Edit2, AlertCircle, Check, X, Eye, EyeOff } from 'lucide-react';
import { initialRooms } from '../data';
import { getBannersApi, uploadBannerApi, deleteBannerApi, updateBannerApi } from '../api/bannerApi';

const Admin = () => {
    // 1. Hooks (Must be at the top)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [rooms, setRooms] = useState(() => {
        const savedRooms = localStorage.getItem('adminRooms');
        return savedRooms ? JSON.parse(savedRooms) : initialRooms;
    });

    const [reportedRooms, setReportedRooms] = useState(() => {
        const savedReports = localStorage.getItem('reportedRooms');
        return savedReports ? JSON.parse(savedReports) : [
            { id: 9991, title: 'Inappropriate Content', language: 'English', reason: 'Abusive language', reporter: 'User_442' },
            { id: 9992, title: 'Spam Room', language: 'Arabic', reason: 'Spamming links', reporter: 'Admin_Bot' }
        ];
    });

    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomForm, setRoomForm] = useState({ title: '', language: 'English', creator: '', category: 'General' });
    const [displayLimit, setDisplayLimit] = useState(10);
    const [banners, setBanners] = useState([]);
    const [isBannerLoading, setIsBannerLoading] = useState(false);

    // 2. Persistence & Auth
    useEffect(() => {
        const adminAuth = localStorage.getItem('isAdmin');
        if (adminAuth === 'true') {
            setIsAuthenticated(true);
            fetchBanners();
        }
        setIsLoading(false);
    }, []);

    const fetchBanners = async () => {
        // Don't set loading to true here to avoid flickering on updates
        // setIsBannerLoading(true); 
        const data = await getBannersApi();
        setBanners(data);
        // setIsBannerLoading(false);
    };

    const handleBannerUpdate = async (banner, updates) => {
        const updatedBanner = { ...banner, ...updates };
        // Optimistic update
        setBanners(banners.map(b => b.id === banner.id ? updatedBanner : b));

        await updateBannerApi(updatedBanner);
        fetchBanners(); // Sync with source
    };

    useEffect(() => {
        localStorage.setItem('adminRooms', JSON.stringify(rooms));
    }, [rooms]);

    useEffect(() => {
        localStorage.setItem('reportedRooms', JSON.stringify(reportedRooms));
    }, [reportedRooms]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'AFINANDDS' && password === 'Afinandds@29052002') {
            setIsAuthenticated(true);
            localStorage.setItem('isAdmin', 'true');
            setError('');
            fetchBanners();
        } else {
            setError('Invalid credentials. Access denied.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    // 3. Room Management Logic
    const handleDeleteRoom = (roomId) => {
        setRooms(rooms.filter(r => r.id !== roomId));
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setRoomForm({
            title: room.title,
            language: room.language,
            creator: room.profile?.username || room.creator || '',
            category: room.category || 'General'
        });
        setShowModal(true);
    };

    const handleSaveRoom = (e) => {
        e.preventDefault();
        if (editingRoom) {
            // Update
            setRooms(rooms.map(r => r.id === editingRoom.id ? {
                ...r,
                title: roomForm.title,
                language: roomForm.language,
                category: roomForm.category,
                profile: { ...r.profile, username: roomForm.creator }
            } : r));
        } else {
            // Create
            const newRoom = {
                id: Date.now(),
                title: roomForm.title,
                language: roomForm.language,
                category: roomForm.category,
                profile: { username: roomForm.creator, avatar: '/profiles/Abraham Baker.webp' },
                participantCount: 0
            };
            setRooms([newRoom, ...rooms]);
        }
        setShowModal(false);
        setEditingRoom(null);
        setRoomForm({ title: '', language: 'English', creator: '', category: 'General' });
    };

    const handleDismissReport = (reportId) => {
        setReportedRooms(reportedRooms.filter(r => r.id !== reportId));
    };

    const handleDeleteReportedRoom = (reportId) => {
        setRooms(rooms.filter(r => r.id !== reportId));
        setReportedRooms(reportedRooms.filter(r => r.id !== reportId));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#000000] flex flex-col md:flex-row relative overflow-hidden">
                {/* Space Theme Background */}
                <div className="background-glows">
                    {/* ... existing glows ... */}
                    <div className="glow1"></div><div className="glow2"></div><div className="glow3"></div><div className="glow4"></div><div className="glow5"></div>
                    <div className="streak streak1"></div><div className="streak streak2"></div><div className="streak streak3"></div><div className="streak streak4"></div>
                </div>

                <div className="hidden md:flex flex-1 flex-col justify-center p-20 relative z-10 border-r border-white/5">
                    <div className="max-w-xl">
                        <div className="w-32 h-32 bg-blue-500/10 rounded-[40px] flex items-center justify-center mb-12 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-pulse">
                            <ShieldCheck size={72} className="text-blue-400" />
                        </div>
                        <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8" style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 30px rgba(59,130,246,0.5)' }}>
                            CONTROL<br />CENTER
                        </h1>
                        <p className="text-2xl text-blue-400 font-bold uppercase tracking-[0.3em] opacity-80 mb-12">System Administrator Access</p>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative z-10 bg-black/40 backdrop-blur-md">
                    <div className="max-w-xl w-full">
                        <div className="mb-16">
                            <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Login</h2>
                            <p className="text-gray-400 text-xl font-medium">Identify your security profile to access parameters.</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-12">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-blue-400 uppercase tracking-widest px-1">Operator ID</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-10 py-7 bg-white/5 border border-white/10 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-white text-2xl transition-all font-bold" placeholder="Username" required autoFocus />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-blue-400 uppercase tracking-widest px-1">Security Key</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-10 py-7 bg-white/5 border border-white/10 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-white text-2xl transition-all font-bold" placeholder="Password" required />
                            </div>
                            {error && <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-500 text-xl font-black text-center">{error}</div>}
                            <button type="submit" className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white text-3xl font-black rounded-[32px] transition-all shadow-[0_20px_60px_rgba(59,130,246,0.3)] uppercase tracking-widest">START SESSION</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="background-glows">
                <div className="glow1"></div><div className="glow2"></div><div className="glow3"></div><div className="glow4"></div><div className="glow5"></div>
            </div>

            {/* Header */}
            <header className="bg-white/5 backdrop-blur-3xl border-b border-white/10 p-8 sticky top-0 z-50">
                <div className="max-w-full px-12 mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <ShieldCheck size={36} className="text-blue-400" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter" style={{ fontFamily: "'Orbitron', sans-serif" }}>ADMIN DASHBOARD</h2>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-4 px-10 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all font-black text-xl border border-red-500/20 active:scale-95">
                        <LogOut size={28} />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-full px-20 py-16 relative z-10 overflow-y-auto">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">

                    {/* 1. Banner Management */}
                    <div className="xl:col-span-3 bg-white/5 backdrop-blur-2xl rounded-[50px] border border-white/10 overflow-hidden shadow-2xl mb-8">
                        <div className="p-12 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h3 className="text-3xl font-black uppercase tracking-wider">Banner Management</h3>
                            <button
                                onClick={async () => {
                                    if (window.confirm('Delete ALL banners from data storage?')) {
                                        for (const b of banners) {
                                            await deleteBannerApi(b);
                                        }
                                        fetchBanners();
                                    }
                                }}
                                className="px-10 py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20"
                            >
                                CLEAR ALL BANNERS
                            </button>
                        </div>
                        <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {/* Upload Files (Image/Video) */}
                            <div className={`bg-white/5 rounded-3xl border border-dashed border-white/20 p-8 flex flex-col items-center justify-center text-center group hover:border-blue-500/50 transition-all ${isBannerLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                                    {isBannerLoading ? <div className="w-6 h-6 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /> : <Settings size={32} className="text-blue-500" />}
                                </div>
                                <h4 className="text-lg font-bold mb-4">Upload Media</h4>
                                <input
                                    type="file"
                                    id="banner-upload"
                                    className="hidden"
                                    multiple
                                    accept="image/*,video/mp4"
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files);
                                        if (files.length === 0) return;

                                        setIsBannerLoading(true);
                                        try {
                                            for (const file of files) {
                                                await uploadBannerApi(file);
                                            }
                                            await fetchBanners();
                                        } catch (err) {
                                            alert('Upload failed: ' + err.message);
                                        } finally {
                                            setIsBannerLoading(false);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <label htmlFor="banner-upload" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl cursor-pointer transition-all shadow-lg text-sm uppercase">
                                    {isBannerLoading ? 'UPLOADING...' : 'SELECT FILES'}
                                </label>
                            </div>

                            {/* Add Text Banner */}
                            <div className="bg-white/5 rounded-3xl border border-dashed border-white/20 p-8 flex flex-col group hover:border-purple-500/50 transition-all">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Edit2 size={32} className="text-purple-500" />
                                </div>
                                <h4 className="text-lg font-bold mb-4 text-center">Add Text Banner</h4>
                                <div className="space-y-3 w-full">
                                    <input
                                        type="text"
                                        id="new-text-banner-content"
                                        placeholder="Banner Text Content..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        id="new-text-banner-link"
                                        placeholder="Banner Link (URL)..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                    />
                                    <button
                                        onClick={async () => {
                                            const text = document.getElementById('new-text-banner-content').value;
                                            const link = document.getElementById('new-text-banner-link').value;
                                            if (!text) return alert('Please enter text content');

                                            setIsBannerLoading(true);
                                            try {
                                                await uploadBannerApi({ text, link, type: 'text' });
                                                await fetchBanners();
                                                document.getElementById('new-text-banner-content').value = '';
                                                document.getElementById('new-text-banner-link').value = '';
                                            } catch (err) {
                                                alert('Failed to add text banner: ' + err.message);
                                            } finally {
                                                setIsBannerLoading(false);
                                            }
                                        }}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer transition-all shadow-lg text-sm uppercase"
                                    >
                                        ADD TEXT BANNER
                                    </button>
                                </div>
                            </div>
                            {banners.map((banner) => (
                                <div key={banner.id} className="relative group bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                                    <div className="aspect-video relative">
                                        {banner.type === 'video' ? (
                                            <video src={banner.url} className="w-full h-full object-cover" muted loop autoPlay />
                                        ) : banner.type === 'text' ? (
                                            <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-black text-center">
                                                <span className="text-sm font-bold text-white uppercase line-clamp-3">{banner.text}</span>
                                            </div>
                                        ) : (
                                            <img src={banner.url} alt="Banner" className="w-full h-full object-cover" />
                                        )}

                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => handleBannerUpdate(banner, { visible: !banner.visible })}
                                                className={`p-4 rounded-full ${banner.visible !== false ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                                                title={banner.visible !== false ? 'Hide Banner' : 'Show Banner'}
                                            >
                                                {banner.visible !== false ? <Eye size={24} /> : <EyeOff size={24} />}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Delete this banner from data storage?')) {
                                                        await deleteBannerApi(banner);
                                                        fetchBanners();
                                                    }
                                                }}
                                                className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full"
                                                title="Delete Banner"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                        {!banner.visible && (
                                            <div className="absolute top-2 right-2 px-3 py-1 bg-red-600/80 text-white text-xs font-bold rounded-lg uppercase">Hidden</div>
                                        )}
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-[10px] text-white/70 rounded-md uppercase font-bold tracking-widest">{banner.type}</div>
                                    </div>
                                    <div className="p-4 bg-white/5 space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Display Text</label>
                                            <input
                                                type="text"
                                                defaultValue={banner.text || ''}
                                                onBlur={(e) => handleBannerUpdate(banner, { text: e.target.value })}
                                                placeholder="Add banner text..."
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Action Link (Optional)</label>
                                            <input
                                                type="text"
                                                defaultValue={banner.link || ''}
                                                onBlur={(e) => handleBannerUpdate(banner, { link: e.target.value })}
                                                placeholder="https://example.com"
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-green-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Apps Management */}
                    <div className="xl:col-span-3 bg-white/5 backdrop-blur-2xl rounded-[50px] border border-white/10 overflow-hidden shadow-2xl mb-8">
                        <div className="p-12 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <h3 className="text-3xl font-black uppercase tracking-wider">Apps Management</h3>
                            <button onClick={() => { localStorage.removeItem('customApps'); localStorage.removeItem('hiddenApps'); window.location.reload(); }} className="px-10 py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20">RESET ALL APPS</button>
                        </div>
                        <div className="p-12">
                            {/* Add New Custom App */}
                            <div className="bg-white/5 rounded-3xl border border-dashed border-white/20 p-8 mb-8">
                                <h4 className="text-xl font-bold mb-6 text-white">Add New Custom App</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        id="app-name"
                                        placeholder="App Name"
                                        className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        id="app-icon"
                                        placeholder="App Icon (emoji or URL)"
                                        className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        id="app-url"
                                        placeholder="App URL (e.g., https://example.com or /path)"
                                        className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="color"
                                        id="app-color"
                                        defaultValue="#3b82f6"
                                        className="px-6 py-4 bg-white/10 border border-white/10 rounded-2xl h-14 cursor-pointer"
                                    />
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Custom Code (Optional - for iframe apps)</label>
                                    <textarea
                                        id="app-code"
                                        placeholder="Enter custom HTML/JavaScript code here..."
                                        className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                                        rows="4"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const name = document.getElementById('app-name').value;
                                        const icon = document.getElementById('app-icon').value;
                                        const url = document.getElementById('app-url').value;
                                        const color = document.getElementById('app-color').value;
                                        const code = document.getElementById('app-code').value;

                                        if (!name || !icon) {
                                            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Please fill at least Name and Icon fields' } }));
                                            return;
                                        }

                                        if (!url && !code) {
                                            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Please provide either a URL or custom code' } }));
                                            return;
                                        }

                                        const customApps = JSON.parse(localStorage.getItem('customApps') || '[]');
                                        customApps.push({
                                            id: 'custom-' + Date.now(),
                                            name,
                                            icon,
                                            url: url || null,
                                            code: code || null,
                                            color: `linear-gradient(135deg, ${color}, ${color}dd)`,
                                            isCustom: true,
                                            visible: true
                                        });
                                        localStorage.setItem('customApps', JSON.stringify(customApps));
                                        window.location.reload();
                                    }}
                                    className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl"
                                >
                                    ADD CUSTOM APP
                                </button>
                            </div>

                            {/* All Apps List */}
                            <h4 className="text-2xl font-bold mb-6 text-white">All Apps (Default + Custom)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {(() => {
                                    const defaultApps = [
                                        { id: 'calculator', icon: '🔢', name: 'Calculator', path: '/calculator', color: 'linear-gradient(135deg, #667eea, #764ba2)', isDefault: true },
                                        { id: 'calendar', icon: '📅', name: 'Calendar', path: '/calendar-app', color: 'linear-gradient(135deg, #ff9500, #ff6b00)', isDefault: true },
                                        { id: 'clock', icon: '⏰', name: 'Clock', path: '/clock-app', color: 'linear-gradient(135deg, #a2a2a2, #636363)', isDefault: true },
                                        { id: 'notes', icon: '📝', name: 'Notes', path: '/notes-app', color: 'linear-gradient(135deg, #ffcc00, #ffb300)', isDefault: true },
                                        { id: 'reminders', icon: '✅', name: 'Reminders', path: '/reminders-app', color: 'linear-gradient(135deg, #5fc9f8, #5ac8fa)', isDefault: true },
                                        { id: 'compass', icon: '🧭', name: 'Compass', path: '/compass-app', color: 'linear-gradient(135deg, #f093fb, #f5576c)', isDefault: true },
                                        { id: 'news', icon: '📰', name: 'News', path: '/news', color: 'linear-gradient(135deg, #ff4b2b, #ff416c)', isDefault: true },
                                        { id: 'youtube', icon: '📺', name: 'YouTube', path: '/youtube', color: 'linear-gradient(135deg, #ff0000, #cc0000)', isDefault: true },
                                        { id: 'live', icon: '📡', name: 'Live TV', path: '/live', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', isDefault: true },
                                        { id: 'learning', icon: '🎓', name: 'Learning', path: '/learning', color: 'linear-gradient(135deg, #10b981, #059669)', isDefault: true },
                                        { id: 'music', icon: '🎵', name: 'Music', path: '/music', color: 'linear-gradient(135deg, #ec4899, #db2777)', isDefault: true },
                                        { id: 'chat', icon: '🤖', name: 'AI Chat', path: '/ai-chat', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', isDefault: true },
                                    ];
                                    const customApps = JSON.parse(localStorage.getItem('customApps') || '[]');
                                    const hiddenApps = JSON.parse(localStorage.getItem('hiddenApps') || '[]');
                                    const allApps = [...defaultApps, ...customApps];

                                    return allApps.map((app) => {
                                        const isHidden = hiddenApps.includes(app.id);
                                        return (
                                            <div key={app.id} className={`relative group bg-white/5 rounded-3xl border border-white/10 p-6 shadow-2xl ${isHidden ? 'opacity-50' : ''}`}>
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4"
                                                        style={{ background: app.color || '#333' }}
                                                    >
                                                        {typeof app.icon === 'string' && app.icon.startsWith('http') ? (
                                                            <img src={app.icon} alt={app.name} className="w-full h-full object-cover rounded-2xl" />
                                                        ) : (
                                                            app.icon
                                                        )}
                                                    </div>
                                                    <h5 className="font-bold text-white text-center mb-2">{app.name}</h5>
                                                    <p className="text-xs text-gray-400 text-center truncate w-full mb-4">
                                                        {app.isDefault ? 'Default App' : 'Custom App'}
                                                    </p>

                                                    <div className="w-full space-y-2">
                                                        <button
                                                            onClick={() => {
                                                                const hidden = JSON.parse(localStorage.getItem('hiddenApps') || '[]');
                                                                if (isHidden) {
                                                                    const filtered = hidden.filter(id => id !== app.id);
                                                                    localStorage.setItem('hiddenApps', JSON.stringify(filtered));
                                                                } else {
                                                                    hidden.push(app.id);
                                                                    localStorage.setItem('hiddenApps', JSON.stringify(hidden));
                                                                }
                                                                window.location.reload();
                                                            }}
                                                            className={`w-full py-2 font-bold rounded-xl transition-all border ${isHidden
                                                                ? 'bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white border-green-500/20'
                                                                : 'bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-white border-yellow-500/20'
                                                                }`}
                                                        >
                                                            {isHidden ? 'Show' : 'Hide'}
                                                        </button>

                                                        {app.isCustom && (
                                                            <button
                                                                onClick={() => {
                                                                    const apps = JSON.parse(localStorage.getItem('customApps') || '[]');
                                                                    const filtered = apps.filter(a => a.id !== app.id);
                                                                    localStorage.setItem('customApps', JSON.stringify(filtered));
                                                                    window.location.reload();
                                                                }}
                                                                className="w-full py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-bold rounded-xl transition-all border border-red-500/20"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* 2. Room Management */}
                    <div className="xl:col-span-2 bg-white/5 backdrop-blur-2xl rounded-[50px] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-12 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-3xl font-black uppercase tracking-wider">Rooms Management</h3>
                                <div className="flex items-center gap-4 mt-4">
                                    <span className="text-sm font-black text-gray-400 uppercase">Display Limit:</span>
                                    <select value={displayLimit} onChange={(e) => setDisplayLimit(Number(e.target.value))} className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white font-bold outline-none focus:border-blue-500">
                                        {[10, 20, 50, 100].map(limit => <option key={limit} value={limit} className="bg-black">{limit} Rooms</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => { setEditingRoom(null); setRoomForm({ title: '', language: 'English', creator: '', category: 'General' }); setShowModal(true); }} className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg text-lg flex items-center gap-3">
                                <Plus size={24} />
                                CREATE ROOM
                            </button>
                        </div>
                        <div className="p-12 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm font-black uppercase tracking-[0.2em] border-b border-white/10">
                                        <th className="pb-8 px-6">Room Details</th>
                                        <th className="pb-8 px-6">Language</th>
                                        <th className="pb-8 px-6">Creator</th>
                                        <th className="pb-8 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {rooms.slice(0, displayLimit).map((room) => (
                                        <tr key={room.id} className="group hover:bg-white/[0.03] transition-colors">
                                            <td className="py-8 px-6">
                                                <p className="font-bold text-2xl mb-1">{room.title}</p>
                                                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{room.category || 'General'}</p>
                                            </td>
                                            <td className="py-8 px-6">
                                                <span className="px-6 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-black uppercase border border-blue-500/20">{room.language}</span>
                                            </td>
                                            <td className="py-8 px-6 text-gray-300 text-xl font-medium">{room.profile?.username || room.creator}</td>
                                            <td className="py-8 px-6 text-right space-x-4">
                                                <button onClick={() => handleEditRoom(room)} className="p-4 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-2xl transition-all border border-blue-500/20"><Edit2 size={24} /></button>
                                                <button onClick={() => handleDeleteRoom(room.id)} className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20"><Trash2 size={24} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. Reports & Activity */}
                    <div className="space-y-16">
                        <div className="bg-white/5 backdrop-blur-2xl rounded-[50px] border border-white/10 p-12 shadow-2xl flex flex-col">
                            <div className="flex items-center gap-4 mb-10">
                                <AlertCircle size={32} className="text-red-500" />
                                <h3 className="text-3xl font-black uppercase tracking-wider">Reported Content</h3>
                            </div>
                            <div className="space-y-8">
                                {reportedRooms.length === 0 ? (
                                    <div className="p-10 text-center bg-green-500/5 border border-green-500/10 rounded-3xl">
                                        <Check size={48} className="text-green-500 mx-auto mb-4" />
                                        <p className="font-black text-green-500 uppercase tracking-widest text-sm">System Secure: 0 Reports</p>
                                    </div>
                                ) : reportedRooms.map(report => (
                                    <div key={report.id} className="p-8 bg-white/5 rounded-[35px] border border-white/5 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xl font-black text-white">{report.title}</p>
                                                <p className="text-xs font-black text-red-400 uppercase tracking-widest mt-1">Reason: {report.reason}</p>
                                            </div>
                                            <span className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-[10px] font-black uppercase border border-red-500/20">High Priority</span>
                                        </div>
                                        <div className="flex gap-4 pt-4 border-t border-white/5">
                                            <button onClick={() => handleDeleteReportedRoom(report.id)} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs transition-all uppercase tracking-widest">Delete Room</button>
                                            <button onClick={() => handleDismissReport(report.id)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl text-xs transition-all uppercase tracking-widest border border-white/10">Dismiss</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-2xl rounded-[50px] border border-white/10 p-12 shadow-2xl flex-1">
                            <h3 className="text-3xl font-black uppercase tracking-wider mb-10">System Notifications</h3>
                            <div className="space-y-8 text-xl font-medium">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="w-3 h-3 mt-2.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse"></div>
                                        <div>
                                            <p className="font-black text-white text-base">New operator logged in</p>
                                            <p className="text-gray-500 text-xs uppercase tracking-widest font-black mt-1">ID: AFINANDDS | {new Date().toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Room Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[60px] p-16 shadow-[0_0_100px_rgba(59,130,246,0.2)]">
                        <button onClick={() => setShowModal(false)} className="absolute top-12 right-12 text-gray-400 hover:text-white transition-colors"><X size={32} /></button>
                        <h2 className="text-5xl font-black mb-12 tracking-tighter uppercase">{editingRoom ? 'Edit Room' : 'Create New Room'}</h2>
                        <form onSubmit={handleSaveRoom} className="space-y-10">
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-widest px-1">Room Title</label>
                                    <input type="text" value={roomForm.title} onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:border-blue-500 text-xl font-bold outline-none" placeholder="Enter title" required />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-widest px-1">Creator Username</label>
                                    <input type="text" value={roomForm.creator} onChange={(e) => setRoomForm({ ...roomForm, creator: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:border-blue-500 text-xl font-bold outline-none" placeholder="Operator ID" required />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-widest px-1">Primary Language</label>
                                    <select value={roomForm.language} onChange={(e) => setRoomForm({ ...roomForm, language: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:border-blue-500 text-xl font-bold outline-none appearance-none">
                                        {['English', 'Arabic', 'Spanish', 'French', 'Hindi', 'Chinese', 'Portuguese', 'German'].map(lang => <option key={lang} value={lang} className="bg-black">{lang}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-blue-400 uppercase tracking-widest px-1">Category</label>
                                    <select value={roomForm.category} onChange={(e) => setRoomForm({ ...roomForm, category: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:border-blue-500 text-xl font-bold outline-none appearance-none">
                                        {['General', 'Gaming', 'Music', 'Education', 'Technology', 'Social'].map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black rounded-3xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest mt-12">{editingRoom ? 'Save Changes' : 'Establish Room'}</button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .background-glows {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    z-index: 0;
                }

                .glow1, .glow2, .glow3, .glow4, .glow5 {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.15;
                    animation: float 20s infinite ease-in-out;
                }

                .glow1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, #3b82f6, transparent);
                    top: -200px;
                    left: -200px;
                    animation-delay: 0s;
                }

                .glow2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, #8b5cf6, transparent);
                    top: 50%;
                    right: -150px;
                    animation-delay: 5s;
                }

                .glow3 {
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, #06b6d4, transparent);
                    bottom: -250px;
                    left: 30%;
                    animation-delay: 10s;
                }

                .glow4 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, #ec4899, transparent);
                    top: 20%;
                    left: 50%;
                    animation-delay: 15s;
                }

                .glow5 {
                    width: 550px;
                    height: 550px;
                    background: radial-gradient(circle, #10b981, transparent);
                    bottom: 10%;
                    right: 20%;
                    animation-delay: 7s;
                }

                .streak {
                    position: absolute;
                    width: 2px;
                    height: 100px;
                    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent);
                    animation: streak 3s infinite linear;
                }

                .streak1 { left: 20%; animation-delay: 0s; }
                .streak2 { left: 50%; animation-delay: 1s; }
                .streak3 { left: 70%; animation-delay: 2s; }
                .streak4 { left: 85%; animation-delay: 1.5s; }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(50px, -50px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                }

                @keyframes streak {
                    0% { top: -100px; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Admin;
