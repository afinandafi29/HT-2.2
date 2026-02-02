import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isFirefox, setIsFirefox] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // 1. Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);

        // 2. Detect Firefox
        const isFirefoxBrowser = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        setIsFirefox(isFirefoxBrowser);

        // 3. Handle Chrome/Edge/Brave Native Prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 4. Check Standalone Mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone ||
            document.referrer.includes('android-app://');

        if (isStandalone) {
            setShowInstallButton(false);
        } else {
            // Show button if iOS or Firefox (since they don't fire beforeinstallprompt)
            if (isIosDevice || isFirefoxBrowser) {
                setShowInstallButton(true);
            }
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Native Chrome/Edge/Brave Prompt
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setShowInstallButton(false);
            }
        } else {
            // Show Manual Instructions (iOS, Firefox, or unsupported)
            setShowInstructions(true);
        }
    };

    if (!showInstallButton) return null;

    return (
        <>
            <li>
                <button
                    onClick={handleInstallClick}
                    className="pwa-install-btn group"
                    style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px', borderRadius: '12px', transition: 'all 0.2s', background: 'rgba(56, 189, 248, 0.1)' }}
                >
                    <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <i className="fas fa-download text-[#38bdf8]"></i>
                    </div>
                    <span className="font-semibold text-white">Install App</span>
                </button>
            </li>

            {showInstructions && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setShowInstructions(false)}>
                    <div className="w-full max-w-sm rounded-[32px] bg-[#0f172a] p-8 text-center shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-[#38bdf8]/20 flex items-center justify-center">
                                <i className="fas fa-mobile-alt text-4xl text-[#38bdf8]"></i>
                            </div>
                        </div>
                        <h3 className="mb-3 text-2xl font-black text-white uppercase tracking-tight">Install HAPPYY TALK</h3>
                        <p className="mb-8 text-gray-400 font-medium text-sm">
                            {isIOS
                                ? "Install this web app on your iPhone for the best experience."
                                : isFirefox
                                    ? "Install this app from the Firefox menu."
                                    : "Install our app for a better experience."}
                        </p>

                        <div className="space-y-4 text-left">
                            {isIOS ? (
                                <>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]">1</span>
                                        <span className="text-gray-300 font-medium text-sm">Tap the <span className="text-white font-bold">Share</span> button</span>
                                    </div>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]">2</span>
                                        <span className="text-gray-300 font-medium text-sm">Tap <span className="text-white font-bold">Add to Home Screen</span></span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]"><i className="fas fa-ellipsis-v"></i></span>
                                        <span className="text-gray-300 font-medium text-sm">Open browser menu</span>
                                    </div>
                                    <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]"><i className="fas fa-download"></i></span>
                                        <span className="text-gray-300 font-medium text-sm">Tap <span className="text-white font-bold">{isFirefox ? 'Install' : 'Add to Home screen'}</span></span>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="mt-10 w-full rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] py-4 font-black uppercase tracking-widest text-white hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const Sidebar = ({
    isOpen,
    onClose,
    onToggleAnimation,
    animationStopped,
    currentPath,
}) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme, changeTheme, customColor, changeCustomColor, animatedTheme, changeAnimatedTheme } = useTheme();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showThemeDropdown, setShowThemeDropdown] = useState(false);

    const BACKGROUND_THEMES = [
        { id: 'none', name: 'None', icon: 'fa-ban' },
        { id: 'bubble', name: 'Bubble Background', icon: 'fa-circle' },
        { id: 'fireworks', name: 'Fireworks Background', icon: 'fa-star' },
        { id: 'gradient', name: 'Gradient Background', icon: 'fa-paint-brush' },
        { id: 'gravity-stars', name: 'Gravity Stars Background', icon: 'fa-meteor' },
        { id: 'hexagon', name: 'Hexagon Background', icon: 'fa-shapes' },
        { id: 'hole', name: 'Hole Background', icon: 'fa-circle-notch' },
        { id: 'stars', name: 'Stars Background', icon: 'fa-star' },
        { id: 'liquid-ether', name: 'Liquid Ether', icon: 'fa-water' },
        { id: 'prism', name: 'Prism', icon: 'fa-cube' },
        { id: 'dark-veil', name: 'Dark Veil', icon: 'fa-ghost' },
        { id: 'light-pillar', name: 'Light Pillar', icon: 'fa-lightbulb' },
        { id: 'silk', name: 'Silk', icon: 'fa-wind' },
        { id: 'floating-lines', name: 'Floating Lines', icon: 'fa-wave-square' },
        { id: 'light-rays', name: 'Light Rays', icon: 'fa-sun' },
        { id: 'pixel-blast', name: 'Pixel Blast', icon: 'fa-gamepad' },
        { id: 'color-bends', name: 'Color Bends', icon: 'fa-palette' },
        { id: 'aurora', name: 'Aurora', icon: 'fa-star' },
        { id: 'plasma', name: 'Plasma', icon: 'fa-fire' },
        { id: 'galaxy', name: 'Galaxy', icon: 'fa-space-shuttle' }
    ];

    const handleHomeClick = () => {
        navigate('/');
        if (onClose) onClose();
    };

    const handleProfileClick = () => {
        navigate('/profile');
        if (onClose) onClose();
    };

    const handleFeedClick = () => {
        navigate('/feed');
        if (onClose) onClose();
    };

    const handlePostClick = () => {
        navigate('/post');
        if (onClose) onClose();
    };

    const handlePrivacyClick = () => {
        navigate('/privacy');
        if (onClose) onClose();
    };

    const handleHelpClick = () => {
        navigate('/faq');
        if (onClose) onClose();
    };

    const handleComingSoonFeature = (featureName) => {
        setPopupMessage(`${featureName} feature coming soon!`);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
    };

    const handleThemeChange = (themeId) => {
        changeAnimatedTheme(themeId);
    };

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <button onClick={onClose} title="Close Menu" style={{ marginLeft: 'auto' }}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <p className="menu-label">Navigation</p>
                <nav className="sidebar-section">
                    <ul className="sidebar-list">
                        <li>
                            <button onClick={handleHomeClick} className={currentPath === '/' ? 'active' : ''}>
                                <i className="fas fa-home"></i> <span>Home</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={handleFeedClick} className={currentPath === '/feed' ? 'active' : ''}>
                                <i className="fas fa-rss"></i> <span>Feed</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={handlePostClick} className={currentPath === '/post' ? 'active' : ''}>
                                <i className="fas fa-edit"></i> <span>Post</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { navigate('/news'); if (onClose) onClose(); }} className={currentPath === '/news' ? 'active' : ''}>
                                <i className="fas fa-newspaper"></i> <span>News</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { navigate('/youtube'); if (onClose) onClose(); }} className={currentPath === '/youtube' ? 'active' : ''}>
                                <span>YouTube</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { navigate('/live'); if (onClose) onClose(); }} className={currentPath === '/live' ? 'active' : ''}>
                                <i className="fas fa-tv"></i> <span>Live TV</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => {
                                if (onClose) onClose();
                                window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL'));
                            }} className={currentPath === '/chat' ? 'active' : ''}>
                                <i className="fas fa-comment"></i> <span>Chat</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { navigate('/ai-chat'); if (onClose) onClose(); }} className={currentPath === '/ai-chat' ? 'active' : ''}>
                                <i className="fas fa-robot"></i> <span>AI Chat</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { navigate('/learning'); if (onClose) onClose(); }} className={currentPath === '/learning' ? 'active' : ''}>
                                <i className="fas fa-graduation-cap"></i> <span>Learning</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <p className="menu-label">Appearance</p>
                <nav className="sidebar-section">
                    <ul className="sidebar-list">
                        <li>
                            <button
                                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                                style={{ color: '#38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                            >
                                <span><i className="fas fa-sparkles"></i> <span>Background Theme</span></span>
                                <i className={`fas fa-chevron-${showThemeDropdown ? 'up' : 'down'}`} style={{ fontSize: '12px' }}></i>
                            </button>
                        </li>
                        {showThemeDropdown && (
                            <li style={{ paddingLeft: '0' }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    marginTop: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    {BACKGROUND_THEMES.map((bgTheme) => (
                                        <button
                                            key={bgTheme.id}
                                            onClick={() => handleThemeChange(bgTheme.id)}
                                            className={animatedTheme === bgTheme.id ? 'active' : ''}
                                            style={{
                                                width: '100%',
                                                padding: '10px 16px',
                                                marginBottom: '4px',
                                                fontSize: '14px',
                                                borderRadius: '8px',
                                                background: animatedTheme === bgTheme.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                                                border: animatedTheme === bgTheme.id ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent'
                                            }}
                                        >
                                            <i className={`fas ${bgTheme.icon}`} style={{ marginRight: '8px' }}></i>
                                            <span>{bgTheme.name}</span>
                                            {animatedTheme === bgTheme.id && (
                                                <i className="fas fa-check" style={{ float: 'right', color: '#38bdf8' }}></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </li>
                        )}
                        <li>
                            <button
                                className={theme === 'space' && !customColor ? 'active' : ''}
                                onClick={() => changeTheme('space')}
                            >
                                <i className="fas fa-rocket"></i> <span>Space Color</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className={theme === 'dark' && !customColor ? 'active' : ''}
                                onClick={() => changeTheme('dark')}
                            >
                                <i className="fas fa-moon"></i> <span>Dark Color</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className={theme === 'light' && !customColor ? 'active' : ''}
                                onClick={() => changeTheme('light')}
                            >
                                <i className="fas fa-sun"></i> <span>Light Color</span>
                            </button>
                        </li>
                        <li>
                            <button className={`relative ${customColor ? 'active' : ''}`} style={{ overflow: 'hidden' }}>
                                <input
                                    type="color"
                                    id="custom-color-input"
                                    className="absolute opacity-0 w-full h-full cursor-pointer left-0 top-0 z-10"
                                    onChange={(e) => changeCustomColor(e.target.value)}
                                    value={customColor || '#000000'}
                                    title="Pick any color"
                                />
                                <i className="fas fa-palette"></i>
                                <span>Custom Color</span>
                                {customColor && (
                                    <div
                                        className="absolute bottom-1 right-4 w-6 h-6 rounded-full border border-white/20"
                                        style={{ background: customColor }}
                                    ></div>
                                )}
                            </button>
                        </li>
                    </ul>
                </nav>

                <p className="menu-label">Account</p>
                <nav className="sidebar-section">
                    <ul className="sidebar-list">
                        <li>
                            <button onClick={handleHelpClick}>
                                <i className="fas fa-info-circle"></i> <span>Help & FAQ</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={handlePrivacyClick}>
                                <i className="fas fa-fingerprint"></i> <span>Privacy</span>
                            </button>
                        </li>
                        <PWAInstallButton />
                        <li>
                            <button onClick={handleLogout} className="logout-btn-new">
                                <i className="fas fa-power-off"></i> <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {showPopup && (
                <div className="coming-soon-popup">
                    <div className="coming-soon-content">
                        <i className="fas fa-rocket coming-soon-icon"></i>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
