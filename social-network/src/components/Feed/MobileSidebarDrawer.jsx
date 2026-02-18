import React from 'react';
import { X, LayoutGrid, Search, Globe, Tv, Mail, Plus, Sparkles, CircleUser } from 'lucide-react';
import { ShortsIcon } from '../ShortsSection';

const MobileSidebarDrawer = ({ isOpen, onClose, activeView, setActiveView, onOpenProfile, toggleTheme, isDarkMode, navigate, setIsCreationModalOpen }) => {
    return (
        <>
            <div className={`mobile-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`mobile-sidebar-drawer ${isOpen ? 'open' : ''}`}>
                <div className="mobile-sidebar-header">
                    <span className="mobile-sidebar-logo">HAPPYY TALK.</span>
                    <button className="mobile-sidebar-close" onClick={onClose}>
                        <X size={28} />
                    </button>
                </div>

                <div className="mobile-sidebar-menu">
                    <div className={`mobile-menu-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => { setActiveView('home'); onClose(); }}>
                        <LayoutGrid size={24} />
                        <span>Home</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'search' ? 'active' : ''}`} onClick={() => { setActiveView('search'); onClose(); }}>
                        <Search size={24} />
                        <span>Search</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'explore' ? 'active' : ''}`} onClick={() => { setActiveView('explore'); onClose(); }}>
                        <Globe size={24} />
                        <span>Explore</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'shorts' ? 'active' : ''}`} onClick={() => { setActiveView('shorts'); onClose(); }}>
                        <ShortsIcon />
                        <span>Shorts</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'youtube' ? 'active' : ''}`} onClick={() => { setActiveView('youtube'); onClose(); }}>
                        <Tv size={24} color="#ff0000" />
                        <span>YouTube</span>
                    </div>
                    <div className={`mobile-menu-item ${activeView === 'live' ? 'active' : ''}`} onClick={() => { setActiveView('live'); onClose(); }}>
                        <Tv size={24} color="#3b82f6" />
                        <span>Live TV</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL')); onClose(); }}>
                        <Mail size={24} />
                        <span>Messages</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { setIsCreationModalOpen(true); onClose(); }}>
                        <Plus size={24} />
                        <span>Create Post</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { toggleTheme(); onClose(); }}>
                        <Sparkles size={24} />
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { onOpenProfile(null, true); onClose(); }}>
                        <CircleUser size={24} />
                        <span>Profile</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileSidebarDrawer;
