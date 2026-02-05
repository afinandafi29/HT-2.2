import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import ChatPanel from './ChatPanel';
import Header from './Header';
import BottomNavbar from './BottomNavbar';
import Footer from './Footer';
import Navigation from '../Navigation';
import { useSocket } from '../../contexts/SocketContext';
import '../../styles/main.css';
import CreateRoomModal from '../CreateRoomModal';
import { languages } from '../../data';
import { getBannersApi } from '../../api/bannerApi';
import UserProfileModal from '../UserProfileModal';

import TabletWrapper from './TabletWrapper';
import AnimatedBackground from './AnimatedBackground';
import BannerCarousel from '../BannerCarousel';

export const LayoutContext = React.createContext({});

const Layout = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024 && window.location.pathname !== '/' && window.location.pathname !== '/jitsi' && window.location.pathname !== '/premium');
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { theme, changeTheme } = useTheme();
  const [animationStopped, setAnimationStopped] = useState(false);
  const [customColor, setCustomColor] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const [profileModalUser, setProfileModalUser] = useState(null);
  const [profileModalContext, setProfileModalContext] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const location = useLocation();
  const { currentUser } = useAuth();
  const pathname = location.pathname;
  const isHomePage = pathname === '/' || pathname === '/jitsi';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categoryVisible, setCategoryVisible] = useState(false);

  const [banners, setBanners] = useState([]);
  const [showBanner, setShowBanner] = useState(() => {
    return localStorage.getItem('showBanner') !== 'false';
  });

  const socket = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeNotification, setActiveNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Listen for Live Notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotif = (notif) => {
      setUnreadCount(prev => prev + 1);
      setActiveNotification(notif);
      setShowToast(true);

      // Auto-hide toast after 5s
      setTimeout(() => setShowToast(false), 5000);
    };

    socket.on('new_notification', handleNewNotif);
    return () => socket.off('new_notification', handleNewNotif);
  }, [socket]);

  const handleToastClick = () => {
    setShowToast(false);
    setUnreadCount(0); // Clear on interaction

    if (activeNotification) {
      if (activeNotification.type === 'friend_request' || activeNotification.type === 'message_request' || activeNotification.type === 'friend_accepted') {
        const sender = activeNotification.sender || { id: activeNotification.sender_id };
        window.dispatchEvent(new CustomEvent('OPEN_AND_SELECT_CHAT', {
          detail: {
            userId: sender.id,
            username: sender.username || 'System',
            avatar_url: sender.avatar_url
          }
        }));
        setChatPanelOpen(true);
      } else {
        setRightSidebarOpen(true);
      }
    }
  };

  // Sync activeCategory with pathname
  useEffect(() => {
    if (pathname === '/' || pathname === '/jitsi') {
      setActiveCategory('all');
      setSidebarOpen(false); // Close sidebar on home screen
    }
    else if (pathname === '/feed') setActiveCategory('feed');
    else if (pathname === '/post') setActiveCategory('post');
    else if (pathname === '/youtube') setActiveCategory('youtube');
    else if (pathname === '/chat') setActiveCategory('chat');
    else if (pathname === '/premium') setActiveCategory('premium');
    else if (pathname === '/omegle') setActiveCategory('omegle');
    else if (pathname === '/live') setActiveCategory('live');
  }, [pathname]);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getBannersApi();
      setBanners(data);
    };
    if (isHomePage) fetchBanners();
  }, [isHomePage]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [chatPanelOpen, setChatPanelOpen] = useState(false);

  // ... (existing code)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    if (!rightSidebarOpen) setChatPanelOpen(false); // Close chat if opening profile
  };
  const toggleChatPanel = () => {
    setChatPanelOpen(!chatPanelOpen);
    if (!chatPanelOpen) setRightSidebarOpen(false); // Close profile if opening chat
  };

  // Listen for global Open Chat events
  useEffect(() => {
    const handleOpenChat = () => {
      setChatPanelOpen(true);
      setRightSidebarOpen(false); // Ensure profile is closed
    };
    window.addEventListener('OPEN_CHAT_PANEL', handleOpenChat);

    const handleShowAlert = (e) => {
      setAlertModal({
        isOpen: true,
        title: e.detail.title || 'Notice',
        message: e.detail.message,
        onConfirm: e.detail.onConfirm || null
      });
    };
    const handleShowAuth = () => setShowLoginModal(true);

    window.addEventListener('SHOW_ALERT', handleShowAlert);
    window.addEventListener('SHOW_AUTH', handleShowAuth);

    return () => {
      window.removeEventListener('OPEN_CHAT_PANEL', handleOpenChat);
      window.removeEventListener('SHOW_ALERT', handleShowAlert);
      window.removeEventListener('SHOW_AUTH', handleShowAuth);
    };
  }, []);

  // ...



  const toggleAnimation = () => setAnimationStopped(!animationStopped);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const triggerRoomRefresh = () => setRefreshTrigger(prev => prev + 1);

  const handleCreateRoomClick = () => {
    setCreateModalOpen(true);
  };

  const layoutContextValue = {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    categoryVisible,
    setCategoryVisible,
    setCreateModalOpen,
    handleCreateRoomClick,
    windowWidth,
    sidebarOpen,
    refreshTrigger, // Export state
    triggerRoomRefresh, // Export function
    unreadCount,
    setUnreadCount,
    openProfile: (user, context = {}) => {
      setProfileModalUser(user);
      setProfileModalContext(context);
    }
  };

  const isYouTubePage = pathname === '/youtube';
  const isImmersivePage = ['/premium', '/1to1'].includes(pathname);

  // Immersive full-screen pages that should not have main layout padding or main sidebar
  const fullScreenApps = ['/feed', '/youtube', '/live', '/learning', '/ai-chat', '/news', '/apps', '/1to1', '/premium'];
  const isFullScreenApp = fullScreenApps.some(route => pathname.startsWith(route));

  // Routes that should be wrapped in a tablet frame
  const appRoutes = [
    '/music', '/learning-languages',
    '/basic-learning', '/english-quiz', '/spanish-quiz'
  ];

  // Check if current path or any parent path is an app route
  const isAppPage = appRoutes.some(route => pathname.startsWith(route));

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <div className="background-glows">
        {/* Glow divs remain same */}
        <div className="glow1"></div>
        <div className="glow2"></div>
        <div className="glow3"></div>
        <div className="glow4"></div>
        <div className="glow5"></div>
        <div className="streak streak1"></div>
        <div className="streak streak2"></div>
        <div className="streak streak3"></div>
        <div className="streak streak4"></div>
        <div className="streak streak5"></div>
      </div>
      <AnimatedBackground />
      <div
        className="layout-root-wrapper min-h-screen flex flex-col"
        data-animation-stopped={animationStopped ? 'true' : 'false'}
      >
        {(pathname !== '/feed' && pathname !== '/youtube') && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={toggleSidebar}
            onToggleAnimation={toggleAnimation}
            animationStopped={animationStopped}
            currentPath={pathname}
            user={currentUser}
          />
        )}

        <div
          className={`overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        ></div>

        <RightSidebar
          isOpen={rightSidebarOpen}
          onClose={toggleRightSidebar}
          onCreateRoomClick={handleCreateRoomClick}
        />

        <ChatPanel
          isOpen={chatPanelOpen}
          onClose={() => setChatPanelOpen(false)}
        />

        <div className={`page-content-container flex flex-col flex-grow ${(sidebarOpen && windowWidth > 768) ? 'shifted' : ''}`}>
          <div className="layout-header-sticky">
            {(pathname !== '/feed' && pathname !== '/youtube') ? (
              <>
                <Header
                  onMenuClick={toggleSidebar}
                  onProfileClick={toggleRightSidebar}
                  user={currentUser}
                />

                <div className="layout-persistent-nav">
                  <div className="w-full px-4 flex flex-col items-center">
                    {isHomePage && (
                      <div className="w-full flex flex-col items-center">
                        {/* Banner Section */}
                        {showBanner && banners.length > 0 && (
                          <div className="w-full max-w-7xl mt-8 mb-4 px-4">
                            <BannerCarousel onClose={() => {
                              setShowBanner(false);
                              localStorage.setItem('showBanner', 'false');
                            }} />
                          </div>
                        )}

                        <div className={`${(showBanner && banners.length > 0) ? 'pt-4' : 'pt-20'} w-full flex justify-center mb-4`}>
                          <div className="search-section relative w-full max-w-2xl px-2">
                            <input
                              id="search-input"
                              value={searchTerm}
                              onChange={handleSearchChange}
                              placeholder="Search rooms..."
                              type="text"
                              className="w-full py-2.5 pl-10 pr-4 rounded-full bg-transparent border border-blue-500/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                              style={{ color: 'var(--text-primary)' }}
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"></i>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="w-full pt-1">
                      <Navigation
                        onExpandClick={() => setCategoryVisible(!categoryVisible)}
                        onCreateRoomClick={handleCreateRoomClick}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        isExpanded={categoryVisible}
                        onThemeClick={() => {
                          const themes = ['space', 'dark', 'light'];
                          const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
                          changeTheme(themes[nextIndex]);
                        }}
                        onChatClick={() => setActiveCategory('chat')}
                        languages={languages}
                        onCategoryClick={(language) => {
                          setActiveCategory(language.toLowerCase());
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <main className={`main-content-area flex-grow overflow-x-hidden ${(!isFullScreenApp) ? 'p-4' : ''}`}>
            {isAppPage ? (
              <TabletWrapper title={pathname.substring(1).toUpperCase()}>
                <Outlet />
              </TabletWrapper>
            ) : (
              <Outlet />
            )}
          </main>
          {(pathname !== '/feed' && pathname !== '/youtube') && <Footer />}
        </div>

        {(pathname !== '/feed' && pathname !== '/youtube') && (
          <BottomNavbar
            activeButton={pathname}
            onCreateClick={handleCreateRoomClick}
          />
        )}
        {createModalOpen && (
          <CreateRoomModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onRoomCreated={() => {
              setCreateModalOpen(false);
              triggerRoomRefresh(); // Trigger refresh on creation
            }}
          />
        )}
        {profileModalUser && (
          <UserProfileModal
            isOpen={!!profileModalUser}
            onClose={() => setProfileModalUser(null)}
            user={profileModalUser}
            currentUser={currentUser}
            {...profileModalContext}
          />
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-[#1e293b] border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-blue-400 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
              <p className="text-gray-400 mb-6 text-sm">Join the community to start speaking.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setShowLoginModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border-none cursor-pointer">Cancel</button>
                <button onClick={() => window.location.href = '/in'} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 border-none cursor-pointer">Login</button>
              </div>
            </div>
          </div>
        )}

        {/* Generic Alert Modal */}
        {alertModal.isOpen && (
          <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-[#1e293b] border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">{alertModal.title}</h3>
              <p className="text-gray-400 mb-6 text-sm">{alertModal.message}</p>
              <div className="flex gap-3 justify-center">
                {alertModal.onConfirm ? (
                  <>
                    <button onClick={() => setAlertModal({ ...alertModal, isOpen: false })} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all border-none cursor-pointer">Cancel</button>
                    <button onClick={() => { alertModal.onConfirm(); setAlertModal({ ...alertModal, isOpen: false }); }} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg border-none cursor-pointer">Confirm</button>
                  </>
                ) : (
                  <button onClick={() => setAlertModal({ ...alertModal, isOpen: false })} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg border-none cursor-pointer">OK</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Notification Toast */}
        {showToast && activeNotification && (
          <div
            onClick={handleToastClick}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-sm bg-[#1e293b]/90 backdrop-blur-xl border border-blue-500/30 rounded-[24px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(37,99,235,0.2)] cursor-pointer animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={activeNotification.sender?.avatar_url || '/default-avatar.png'}
                  className="w-12 h-12 rounded-full border border-white/10"
                  alt=""
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#1e293b]">
                  <i className="fas fa-bell text-[8px] text-white"></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm uppercase tracking-tight truncate">
                  {activeNotification.sender?.username || 'New Alert'}
                </p>
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  {activeNotification.type === 'friend_request' && 'Sent you a friend request'}
                  {activeNotification.type === 'friend_accepted' && 'Accepted your friend request'}
                  {activeNotification.type === 'message_request' && 'Sent you a message request'}
                  {activeNotification.type === 'follow' && 'Started following you'}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowToast(false); }}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutContext.Provider >
  );
};

export default Layout;
