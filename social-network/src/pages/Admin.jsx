import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Settings, Trash2, Plus, Edit2, AlertCircle, Check, X, Eye, EyeOff } from 'lucide-react';
import { initialRooms } from '../data';
import { getBannersApi, uploadBannerApi, deleteBannerApi, updateBannerApi } from '../api/bannerApi';

const Admin = () => {
    // 1. Hooks
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
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showSidebar, setShowSidebar] = useState(true);
    const [apps, setApps] = useState(() => {
        const saved = localStorage.getItem('adminApps');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'HAPPYY TALK Mobile', version: '2.4.0', status: 'Active', category: 'Social', link: 'https://happytalk.app/download' },
            { id: 2, name: 'HappyChat Web', version: '1.2.0', status: 'Active', category: 'Messaging', link: 'https://chat.happytalk.app' }
        ];
    });
    const [apiKeys, setApiKeys] = useState(() => {
        const saved = localStorage.getItem('adminApiKeys');
        return saved ? JSON.parse(saved) : {
            youtube: 'AIzaSyDtLX6171RySOtqd-U2Pgcjy_9o2rWDNrc',
            news: '0fc88aab4cf5487dab215fb4563ab635',
            newsData: 'pub_default_key',
            imageApi: 'default_key'
        };
    });
    const [showAppModal, setShowAppModal] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [appForm, setAppForm] = useState({ name: '', version: '', category: 'Social', status: 'Active', link: '' });

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
        const data = await getBannersApi();
        setBanners(data);
    };

    const handleBannerUpdate = async (banner, updates) => {
        const updatedBanner = { ...banner, ...updates };
        setBanners(banners.map(b => b.id === banner.id ? updatedBanner : b));
        await updateBannerApi(updatedBanner);
        fetchBanners();
    };

    useEffect(() => {
        localStorage.setItem('adminRooms', JSON.stringify(rooms));
    }, [rooms]);

    useEffect(() => {
        localStorage.setItem('reportedRooms', JSON.stringify(reportedRooms));
    }, [reportedRooms]);

    useEffect(() => {
        localStorage.setItem('adminApps', JSON.stringify(apps));
    }, [apps]);

    useEffect(() => {
        localStorage.setItem('adminApiKeys', JSON.stringify(apiKeys));
    }, [apiKeys]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'AFINANDDS' && password === 'Afinandds@29052002') {
            setIsAuthenticated(true);
            localStorage.setItem('isAdmin', 'true');
            setError('');
            fetchBanners();
        } else {
            setError('Insecure Credentials. Access Restricted.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    // 3. Room Management Logic
    const handleDeleteRoom = (roomId) => setRooms(rooms.filter(r => r.id !== roomId));
    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setRoomForm({ title: room.title, language: room.language, creator: room.profile?.username || room.creator || '', category: room.category || 'General' });
        setShowModal(true);
    };

    const handleSaveRoom = (e) => {
        e.preventDefault();
        if (editingRoom) {
            setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, title: roomForm.title, language: roomForm.language, category: roomForm.category, profile: { ...r.profile, username: roomForm.creator } } : r));
        } else {
            setRooms([{ id: Date.now(), title: roomForm.title, language: roomForm.language, category: roomForm.category, profile: { username: roomForm.creator, avatar: '/profiles/Admin.webp' }, participantCount: 0 }, ...rooms]);
        }
        setShowModal(false);
        setEditingRoom(null);
    };

    const handleDismissReport = (id) => setReportedRooms(reportedRooms.filter(r => r.id !== id));
    const handleDeleteReportedRoom = (id) => {
        setRooms(rooms.filter(r => r.id !== id));
        setReportedRooms(reportedRooms.filter(r => r.id !== id));
    };

    // 4. App Management Logic
    const handleDeleteApp = (id) => setApps(apps.filter(a => a.id !== id));
    const handleEditApp = (app) => {
        setEditingApp(app);
        setAppForm({ ...app });
        setShowAppModal(true);
    };
    const handleSaveApp = (e) => {
        e.preventDefault();
        if (editingApp) {
            setApps(apps.map(a => a.id === editingApp.id ? { ...appForm } : a));
        } else {
            setApps([{ ...appForm, id: Date.now() }, ...apps]);
        }
        setShowAppModal(false);
        setEditingApp(null);
    };

    const handleApiKeyUpdate = (key, value) => {
        setApiKeys(prev => ({ ...prev, [key]: value }));
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="h-screen bg-[#0a0b14] flex flex-col md:flex-row items-center justify-center overflow-hidden p-6">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative z-10 w-full max-w-[500px] bg-white/5 border border-white/10 backdrop-blur-3xl p-12 rounded-[48px] shadow-2xl">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30">
                            <ShieldCheck size={48} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>ADMIN PANEL</h1>
                        <p className="text-gray-400 font-medium">Please sign in to your workspace</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Operator ID</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white text-xl font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none" placeholder="Username" required />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Security Key</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white text-xl font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none" placeholder="••••••••" required />
                        </div>
                        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-center font-bold">{error}</div>}
                        <button type="submit" className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-black rounded-3xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">Initial Session</button>
                    </form>
                </div>
            </div>
        );
    }

    const NavItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-lg mb-2 ${activeTab === id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <Icon size={24} className={activeTab === id ? 'text-white' : 'text-gray-500'} />
            {showSidebar && <span>{label}</span>}
        </button>
    );

    return (
        <div className="h-screen bg-[#0a0b14] text-white flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`${showSidebar ? 'w-80' : 'w-24'} bg-[#0f111a] border-r border-white/5 p-6 flex flex-col transition-all duration-300 z-50`}>
                <div className="flex items-center gap-4 mb-16 px-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    {showSidebar && <h1 className="text-2xl font-black tracking-tighter" style={{ fontFamily: "'Orbitron', sans-serif" }}>ADMINIFY</h1>}
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem id="dashboard" icon={ShieldCheck} label="Dashboard" />
                    <NavItem id="banners" icon={Eye} label="Banners" />
                    <NavItem id="rooms" icon={Settings} label="Rooms" />
                    <NavItem id="posts" icon={Plus} label="Posts" />
                    <NavItem id="users" icon={LogOut} label="Users" />
                    <NavItem id="apps" icon={Plus} label="Apps" />
                    <NavItem id="settings" icon={Settings} label="API Master" />
                    <NavItem id="reports" icon={AlertCircle} label="Reports" />
                </nav>

                <div className="mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold">
                        <LogOut size={24} />
                        {showSidebar && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0a0b14] overflow-hidden relative">
                {/* Header */}
                <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-white/[0.02] backdrop-blur-3xl sticky top-0 z-40">
                    <h2 className="text-3xl font-black uppercase tracking-widest text-white">{activeTab} 👋</h2>
                    <div className="flex items-center gap-8">
                        <div className="relative hidden md:block">
                            <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 p-3 pl-12 rounded-2xl w-64 text-sm focus:border-blue-600 transition-all" />
                            <ShieldCheck size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-black text-white uppercase">Afinandds</p>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Admin</p>
                            </div>
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                                <img src="/profiles/Admin.webp" className="w-full h-full object-cover" alt="" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Area */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500"><ShieldCheck size={32} /></div>
                                        <span className="text-green-500 text-sm font-bold">+12% ↑</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total Revenue</h3>
                                    <p className="text-4xl font-black text-white">$54,249</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-green-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-500"><LogOut size={32} /></div>
                                        <span className="text-green-500 text-sm font-bold">+8% ↑</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">New Users</h3>
                                    <p className="text-4xl font-black text-white">1,280</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-yellow-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 bg-yellow-600/20 rounded-2xl flex items-center justify-center text-yellow-500"><Settings size={32} /></div>
                                        <span className="text-red-500 text-sm font-bold">-2% ↓</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Pending Orders</h3>
                                    <p className="text-4xl font-black text-white">76</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-red-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500"><AlertCircle size={32} /></div>
                                        <span className="text-red-500 text-sm font-bold">+5 Now</span>
                                    </div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Support Tickets</h3>
                                    <p className="text-4xl font-black text-white">15</p>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="bg-white/5 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-2xl font-black uppercase">Recent Operations</h3>
                                    <button className="text-blue-500 font-bold hover:underline">View All</button>
                                </div>
                                <div className="p-10 overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-500 text-xs font-black uppercase tracking-widest border-b border-white/5">
                                                <th className="pb-6 px-4">Entity</th>
                                                <th className="pb-6 px-4">Action</th>
                                                <th className="pb-6 px-4">Timestamp</th>
                                                <th className="pb-6 px-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[1, 2, 3, 4].map(i => (
                                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-6 px-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                                                            <div className="font-bold text-white">Operation Matrix {i}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-4 text-gray-400 text-sm">System configuration update</td>
                                                    <td className="py-6 px-4 text-gray-400 text-sm">Oct 24, 2023 | 2:00 PM</td>
                                                    <td className="py-6 px-4 text-right">
                                                        <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase border border-green-500/20">Success</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'banners' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1">Banner Management</h3>
                                    <p className="text-gray-500 text-sm font-medium">Configure promotional content for the mobile feed</p>
                                </div>
                                <button onClick={async () => { if (window.confirm('Clear all?')) { for (const b of banners) await deleteBannerApi(b); fetchBanners(); } }} className="px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black rounded-2xl transition-all border border-red-500/20">CLEAR ALL STORAGE</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                <div className="bg-white/5 rounded-[40px] border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center hover:border-blue-600 transition-all cursor-pointer group" onClick={() => document.getElementById('b-up').click()}>
                                    <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Plus size={40} className="text-blue-500" />
                                    </div>
                                    <h4 className="text-xl font-black mb-2">UPLOAD MEDIA</h4>
                                    <p className="text-gray-400 text-sm">Drag or click to select files</p>
                                    <input type="file" id="b-up" className="hidden" multiple accept="image/*,video/mp4" onChange={async (e) => { setIsBannerLoading(true); try { for (const f of e.target.files) await uploadBannerApi(f); await fetchBanners(); } catch (err) { alert(err.message); } finally { setIsBannerLoading(false); } }} />
                                </div>

                                <div className="bg-white/5 rounded-[40px] border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center hover:border-blue-600 transition-all cursor-pointer group" onClick={async () => { const text = window.prompt('Enter banner text:'); if (text) { await uploadBannerApi({ type: 'text', text }); await fetchBanners(); } }}>
                                    <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Plus size={40} className="text-blue-500" />
                                    </div>
                                    <h4 className="text-xl font-black mb-2">CREATE TEXT</h4>
                                    <p className="text-gray-400 text-sm">Post text notification</p>
                                </div>

                                {banners.map(banner => (
                                    <div key={banner.id} className="relative group bg-white/5 rounded-[40px] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                                        <div className="aspect-video relative overflow-hidden bg-black">
                                            {banner.type === 'video' ? <video src={banner.url} className="w-full h-full object-cover" autoPlay muted loop /> : banner.type === 'text' ? <div className="w-full h-full flex items-center justify-center p-8 text-center font-bold text-lg leading-tight">{banner.text}</div> : <img src={banner.url} className="w-full h-full object-cover" alt="" />}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                                <button onClick={() => handleBannerUpdate(banner, { visible: !banner.visible })} className="w-14 h-14 bg-white/10 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all border border-white/10 text-white shadow-xl">{banner.visible !== false ? <Eye size={24} /> : <EyeOff size={24} />}</button>
                                                <button onClick={async () => { if (window.confirm('Delete?')) { await deleteBannerApi(banner); fetchBanners(); } }} className="w-14 h-14 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center transition-all border border-white/10 text-white shadow-xl"><Trash2 size={24} /></button>
                                            </div>
                                            {!banner.visible && <div className="absolute top-6 right-6 px-4 py-2 bg-red-600/80 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest">Hidden</div>}
                                            <div className="absolute bottom-6 left-6 px-3 py-1 bg-black/50 text-[10px] uppercase font-black tracking-tighter backdrop-blur-sm rounded-lg">{banner.type}</div>
                                        </div>
                                        <div className="p-8 bg-black/20 space-y-4">
                                            <input type="text" defaultValue={banner.text || ''} onBlur={(e) => handleBannerUpdate(banner, { text: e.target.value })} className="w-full bg-transparent border-none text-white font-bold p-0 focus:outline-none placeholder:text-gray-600" placeholder="Set banner description..." />
                                            <input type="text" defaultValue={banner.link || ''} onBlur={(e) => handleBannerUpdate(banner, { link: e.target.value })} className="w-full bg-transparent border-none text-blue-500 text-xs font-bold p-0 focus:outline-none placeholder:text-gray-700" placeholder="https://action-link.com" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'rooms' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1">Global Rooms</h3>
                                    <p className="text-gray-500 text-sm font-medium">Manage active chat instances and moderation</p>
                                </div>
                                <button onClick={() => { setEditingRoom(null); setShowModal(true); }} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"><Plus size={24} /> ESTABLISH ROOM</button>
                            </div>

                            <div className="bg-white/5 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                                <div className="p-10 border-b border-white/5 flex gap-10">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Rows:</span>
                                        <select value={displayLimit} onChange={(e) => setDisplayLimit(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold outline-none"><option value="10" className="bg-slate-900">10 Rows</option><option value="50" className="bg-slate-900">50 Rows</option></select>
                                    </div>
                                </div>
                                <div className="p-10 overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-500 text-xs font-black uppercase tracking-widest border-b border-white/5">
                                                <th className="pb-6 px-4">Subject</th>
                                                <th className="pb-6 px-4">Locality</th>
                                                <th className="pb-6 px-4">Operator</th>
                                                <th className="pb-6 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {rooms.slice(0, displayLimit).map(room => (
                                                <tr key={room.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-8 px-4">
                                                        <div className="font-black text-xl text-white mb-1">{room.title}</div>
                                                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{room.category}</div>
                                                    </td>
                                                    <td className="py-8 px-4"><span className="px-4 py-2 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase border border-blue-500/20">{room.language}</span></td>
                                                    <td className="py-8 px-4 text-gray-400 font-bold">{room.profile?.username || room.creator}</td>
                                                    <td className="py-8 px-4 text-right">
                                                        <button onClick={() => handleEditRoom(room)} className="p-3 text-blue-500 hover:text-white transition-colors"><Edit2 size={24} /></button>
                                                        <button onClick={() => handleDeleteRoom(room.id)} className="p-3 text-red-500 hover:text-white transition-colors"><Trash2 size={24} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Posts placeholder - can integrate news/feed moderation here */}
                    {activeTab === 'posts' && (
                        <div className="h-full flex items-center justify-center animate-in fade-in duration-500">
                            <div className="text-center max-w-lg">
                                <div className="w-24 h-24 bg-blue-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-8"><Plus size={48} className="text-blue-500" /></div>
                                <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Content Feed Active</h3>
                                <p className="text-gray-400 text-xl font-medium mb-12">Dynamic moderation system is online. Syncing with global database...</p>
                                <div className="grid grid-cols-2 gap-8 text-left">
                                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                                        <p className="text-4xl font-black text-white mb-2">1.2K</p>
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Active Posts</p>
                                    </div>
                                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5">
                                        <p className="text-4xl font-black text-red-500 mb-2">8</p>
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Flagged Content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Apps Management */}
                    {activeTab === 'apps' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-black uppercase mb-1">Application Hub</h3>
                                    <p className="text-gray-500 text-sm font-medium">Manage ecosystem applications and external links</p>
                                </div>
                                <button onClick={() => { setEditingApp(null); setAppForm({ name: '', version: '', category: 'Social', status: 'Active', link: '' }); setShowAppModal(true); }} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3"><Plus size={24} /> REGISTER APP</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {apps.map(app => (
                                    <div key={app.id} className="bg-white/5 rounded-[40px] border border-white/5 p-8 flex items-center gap-6 group hover:bg-white/[0.08] transition-all">
                                        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500"><ShieldCheck size={40} /></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xl font-black truncate">{app.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{app.category}</span>
                                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">v{app.version}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditApp(app)} className="p-4 bg-white/5 hover:bg-blue-600/20 rounded-2xl transition-all"><Edit2 size={20} className="text-blue-500" /></button>
                                            <button onClick={() => handleDeleteApp(app.id)} className="p-4 bg-white/5 hover:bg-red-600/20 rounded-2xl transition-all"><Trash2 size={20} className="text-red-500" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* API Settings */}
                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">API Master Control</h3>
                                <p className="text-gray-400 font-medium">Configure global service keys and external data integrations</p>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white/5 p-10 rounded-[48px] border border-white/5 space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-blue-500 uppercase tracking-widest ml-1">YouTube Data API (V3)</label>
                                        <input type="text" value={apiKeys.youtube} onChange={(e) => handleApiKeyUpdate('youtube', e.target.value)} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none focus:border-blue-600 transition-all font-mono" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-blue-500 uppercase tracking-widest ml-1">WorldNewsAPI / GNews Key</label>
                                        <input type="text" value={apiKeys.news} onChange={(e) => handleApiKeyUpdate('news', e.target.value)} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none focus:border-blue-600 transition-all font-mono" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-blue-500 uppercase tracking-widest ml-1">NewsData.io Public Key</label>
                                        <input type="text" value={apiKeys.newsData} onChange={(e) => handleApiKeyUpdate('newsData', e.target.value)} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none focus:border-blue-600 transition-all font-mono" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-blue-500 uppercase tracking-widest ml-1">Image Cloud Service Key</label>
                                        <input type="text" value={apiKeys.imageApi} onChange={(e) => handleApiKeyUpdate('imageApi', e.target.value)} className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none focus:border-blue-600 transition-all font-mono" />
                                    </div>
                                </div>
                                <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[32px] flex items-center gap-6">
                                    <AlertCircle className="text-blue-500" size={32} />
                                    <p className="text-blue-100 text-sm font-medium">Changes to core API keys require a system restart for all active mobile sessions to sync the new configuration.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs ... */}
                    {['users', 'reports'].includes(activeTab) && (
                        <div className="h-full flex items-center justify-center animate-in fade-in duration-500">
                            <div className="text-center max-w-lg">
                                <div className="w-24 h-24 bg-blue-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-8"><ShieldCheck size={48} className="text-blue-500" /></div>
                                <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">{activeTab} Module Active</h3>
                                <p className="text-gray-400 text-xl font-medium">This module is connected to the master API controller. Data stream is stable.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Room Modal Stylized */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-3xl animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-2xl bg-[#0f111a] border border-white/10 rounded-[64px] p-16 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden">
                        <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-20"><X size={32} /></button>
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[80px] rounded-full"></div>
                        <h2 className="text-4xl font-black mb-12 tracking-tight uppercase relative z-10">{editingRoom ? 'Modify Access' : 'Create Room'}</h2>
                        <form onSubmit={handleSaveRoom} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Room Title</label>
                                <input type="text" value={roomForm.title} onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-xl outline-none focus:border-blue-600 transition-all" placeholder="Matrix Alpha" required />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Locality</label>
                                    <select value={roomForm.language} onChange={(e) => setRoomForm({ ...roomForm, language: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none appearance-none">
                                        <option value="English" className="bg-[#0f111a]">Global-English</option>
                                        <option value="Spanish" className="bg-[#0f111a]">ES-Spanish</option>
                                        <option value="Arabic" className="bg-[#0f111a]">AR-Arabic</option>
                                        <option value="Hindi" className="bg-[#0f111a]">HI-Hindi</option>
                                        <option value="French" className="bg-[#0f111a]">FR-French</option>
                                        <option value="Chinese" className="bg-[#0f111a]">ZH-Chinese</option>
                                        <option value="Portuguese" className="bg-[#0f111a]">PT-Portuguese</option>
                                        <option value="German" className="bg-[#0f111a]">DE-German</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Category</label>
                                    <select value={roomForm.category} onChange={(e) => setRoomForm({ ...roomForm, category: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none appearance-none">
                                        <option value="General" className="bg-[#0f111a]">General</option>
                                        <option value="Gaming" className="bg-[#0f111a]">Gaming</option>
                                        <option value="Music" className="bg-[#0f111a]">Music</option>
                                        <option value="Education" className="bg-[#0f111a]">Education</option>
                                        <option value="Technology" className="bg-[#0f111a]">Technology</option>
                                        <option value="Social" className="bg-[#0f111a]">Social</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-7 bg-blue-600 hover:bg-blue-500 text-white text-xl font-black rounded-[32px] shadow-2xl shadow-blue-600/20 transition-all uppercase tracking-widest active:scale-95">{editingRoom ? 'Update Matrix' : 'Establish Link'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* App Modal Stylized */}
            {showAppModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-3xl animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowAppModal(false)} />
                    <div className="relative w-full max-w-2xl bg-[#0f111a] border border-white/10 rounded-[64px] p-16 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden">
                        <button onClick={() => setShowAppModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-20"><X size={32} /></button>
                        <h2 className="text-4xl font-black mb-12 tracking-tight uppercase relative z-10">{editingApp ? 'Modify App' : 'Register App'}</h2>
                        <form onSubmit={handleSaveApp} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">App Name</label>
                                <input type="text" value={appForm.name} onChange={(e) => setAppForm({ ...appForm, name: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-xl outline-none focus:border-blue-600 transition-all" placeholder="HAPPYY TALK Lite" required />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Version</label>
                                    <input type="text" value={appForm.version} onChange={(e) => setAppForm({ ...appForm, version: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none focus:border-blue-600 transition-all" placeholder="1.0.0" />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Category</label>
                                    <select value={appForm.category} onChange={(e) => setAppForm({ ...appForm, category: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none appearance-none">
                                        {['Social', 'Messaging', 'Utility', 'Gaming'].map(cat => <option key={cat} value={cat} className="bg-[#0f111a]">{cat}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Download Link</label>
                                <input type="text" value={appForm.link} onChange={(e) => setAppForm({ ...appForm, link: e.target.value })} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white font-bold text-lg outline-none focus:border-blue-600 transition-all" placeholder="https://..." />
                            </div>
                            <button type="submit" className="w-full py-7 bg-blue-600 hover:bg-blue-500 text-white text-xl font-black rounded-[32px] shadow-2xl shadow-blue-600/20 transition-all uppercase tracking-widest active:scale-95">{editingApp ? 'Update App' : 'Confirm Registration'}</button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
                
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(50px, -50px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                }
            `}</style>
        </div>
    );
};

export default Admin;
