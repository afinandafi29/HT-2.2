import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MessageCircle, Mail, Music, Newspaper, Tv, Youtube,
  BookOpen, Settings, LayoutGrid, Heart, Camera
} from 'lucide-react';

const Apps = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [customApps, setCustomApps] = useState(() => {
    const saved = localStorage.getItem('customApps');
    return saved ? JSON.parse(saved) : [];
  });

  const defaultApps = [
    { id: 'calculator', icon: '🔢', name: 'Calculator', path: '/calculator', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { id: 'calendar', icon: '📅', name: 'Calendar', path: '/calendar-app', color: 'linear-gradient(135deg, #ff9500, #ff6b00)' },
    { id: 'clock', icon: '⏰', name: 'Clock', path: '/clock-app', color: 'linear-gradient(135deg, #a2a2a2, #636363)' },
    { id: 'notes', icon: '📝', name: 'Notes', path: '/notes-app', color: 'linear-gradient(135deg, #ffcc00, #ffb300)' },
    { id: 'reminders', icon: '✅', name: 'Reminders', path: '/reminders-app', color: 'linear-gradient(135deg, #5fc9f8, #5ac8fa)' },
    { id: 'compass', icon: '🧭', name: 'Compass', path: '/compass-app', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { id: 'news', icon: '📰', name: 'News', path: '/news', color: 'linear-gradient(135deg, #ff4b2b, #ff416c)', isLive: true },
    { id: 'youtube', icon: '📺', name: 'YouTube', path: '/youtube', color: 'linear-gradient(135deg, #ff0000, #cc0000)' },
    { id: 'live', icon: '📡', name: 'Live TV', path: '/live', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', isLive: true },
    { id: 'learning', icon: '🎓', name: 'Learning', path: '/learning', color: 'linear-gradient(135deg, #10b981, #059669)' },
    { id: 'basic-learn', icon: '📖', name: 'Basic Learning', path: '/basic-learning', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { id: 'music', icon: '🎵', name: 'Music', path: '/music', color: 'linear-gradient(135deg, #ec4899, #db2777)', isLive: true },
    { id: 'chat', icon: '🤖', name: 'AI Chat', path: '/ai-chat', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { id: '1to1', icon: '📞', name: '1-to-1 Call', path: '/1to1', color: 'linear-gradient(135deg, #10b981, #3b82f6)' },
    { id: 'premium', icon: '👑', name: 'Premium', path: '/premium', color: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    { id: 'photos', icon: '🖼️', name: 'Photos', color: 'linear-gradient(45deg, #f093fb, #6fa3ef)' },
    { id: 'messages', icon: '💬', name: 'Messages', color: 'linear-gradient(135deg, #00c6ff, #0072ff)', badge: 3 },
    { id: 'mail', icon: '✉️', name: 'Mail', color: 'linear-gradient(135deg, #2193b0, #6dd5ed)', badge: 12 },
    { id: 'health', icon: '❤️', name: 'Health', color: 'linear-gradient(45deg, #ff6b6b, #ff8e53)' },
    { id: 'maps', icon: '🗺️', name: 'Maps', color: 'linear-gradient(135deg, #348f50, #56b4d3)' },
    { id: 'files', icon: '📁', name: 'Files', color: 'linear-gradient(135deg, #5856d6, #5e5ce6)' },
    { id: 'settings', icon: '⚙️', name: 'Settings', color: 'linear-gradient(135deg, #8e8e93, #636366)' },
  ];

  const apps = [...defaultApps, ...customApps].filter(app => {
    const hiddenApps = JSON.parse(localStorage.getItem('hiddenApps') || '[]');
    return !hiddenApps.includes(app.id);
  });

  const handleAppClick = (app) => {
    if (app.url) {
      // External URL for custom apps
      window.open(app.url, '_blank');
    } else if (app.path) {
      // Internal path for default apps
      navigate(app.path);
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="ios-home-container">
      {/* Background Wallpaper */}
      <div className="ios-wallpaper"></div>

      <div className="ios-content-grid">
        {/* Top Widgets Row */}
        <div className="ios-widgets-row">
          {/* Clock Widget */}
          <div className="ios-widget-glass clock-widget">
            <div className="date-header">{formatDate(time)}</div>
            <div className="big-time">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="calendar-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        {/* Main Apps Grid */}
        <div className="ios-apps-container">
          {apps.map((app) => (
            <div
              key={app.id}
              className={`ios-app-wrapper ${app.isLive ? 'live-tile' : ''}`}
              onClick={() => handleAppClick(app)}
            >
              <div className="ios-app-icon" style={{ background: app.color }}>
                {app.icon}
                {app.badge && <div className="app-badge">{app.badge}</div>}
                {app.isLive && (
                  <div className="live-indicator">
                    <div className="live-dot"></div>
                    <span>LIVE</span>
                  </div>
                )}
              </div>
              <span className="ios-app-name">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="ios-dock-wrapper">
        <div className="ios-dock">
          <div className="dock-item" onClick={() => navigate('/learning')}><div className="dock-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>🎓</div></div>
          <div className="dock-item" onClick={() => navigate('/news')}><div className="dock-icon" style={{ background: 'linear-gradient(135deg, #ff4b2b, #ff416c)' }}>📰</div></div>
          <div className="dock-item" onClick={() => navigate('/youtube')}><div className="dock-icon" style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)' }}>📺</div></div>
          <div className="dock-item" onClick={() => navigate('/music')}><div className="dock-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>🎵</div></div>
          <div className="dock-item" onClick={() => navigate('/ai-chat')}><div className="dock-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>🤖</div></div>
        </div>
      </div>

      <style>{`
                .ios-home-container {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    padding: 40px;
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
                }

                .ios-wallpaper {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(160deg, #1a1c2c 0%, #4a1942 50%, #0c1445 100%);
                    z-index: -1;
                }

                .ios-content-grid {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 60px;
                    z-index: 10;
                    overflow-y: auto;
                    padding-bottom: 120px;
                }

                .ios-widgets-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                }

                .ios-widget-glass {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 42px;
                    padding: 30px;
                    color: white;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: transform 0.3s ease;
                }

                .ios-widget-glass:hover {
                    transform: scale(1.02);
                }

                .clock-widget .date-header {
                    font-size: 16px;
                    font-weight: 600;
                    color: #ff3b30;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .clock-widget .big-time {
                    font-size: 72px;
                    font-weight: 200;
                    line-height: 1;
                }

                .calendar-dots {
                    display: flex;
                    gap: 8px;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                }

                .dot.active { background: #fff; }

                .weather-widget {
                    background: linear-gradient(135deg, rgba(41, 121, 255, 0.2), rgba(0, 229, 255, 0.2));
                }

                .weather-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .city { font-size: 24px; font-weight: 600; }
                .temp { font-size: 56px; font-weight: 200; }

                .weather-bottom {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .condition { font-weight: 500; font-size: 16px; }
                .hi-lo { font-size: 14px; opacity: 0.7; }

                .music-widget .music-content {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }

                .album-art {
                    width: 70px;
                    height: 70px;
                    border-radius: 12px;
                    background: linear-gradient(45deg, #5c258d, #4389a2);
                }

                .track-title { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
                .track-artist { font-size: 14px; opacity: 0.7; }


                .music-controls {
                    display: flex;
                    gap: 30px;
                    justify-content: center;
                    font-size: 20px;
                    opacity: 0.9;
                }

                .ios-apps-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: 40px 30px;
                    justify-items: center;
                }

                .ios-app-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    width: 100px;
                }

                .ios-app-icon {
                    width: 90px;
                    height: 90px;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 42px;
                    position: relative;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.4);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .ios-app-wrapper:hover .ios-app-icon {
                    transform: scale(1.1);
                }

                .app-badge {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: #ff3b30;
                    color: white;
                    min-width: 28px;
                    height: 28px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 700;
                    border: 3px solid #1a1a1a;
                }

                .ios-app-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: white;
                    text-align: center;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }

                .live-tile .ios-app-icon {
                    animation: subtlePulse 4s infinite ease-in-out;
                }

                @keyframes subtlePulse {
                    0% { box-shadow: 0 15px 30px rgba(0,0,0,0.4); }
                    50% { box-shadow: 0 15px 45px rgba(255,255,255,0.1); }
                    100% { box-shadow: 0 15px 30px rgba(0,0,0,0.4); }
                }

                .live-indicator {
                    position: absolute;
                    bottom: 8px;
                    background: rgba(0,0,0,0.5);
                    padding: 2px 8px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                }

                .live-dot {
                    width: 6px;
                    height: 6px;
                    background: #ff3b30;
                    border-radius: 50%;
                    animation: flicker 1s infinite;
                }

                @keyframes flicker {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }

                .ios-dock-wrapper {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 100;
                }

                .ios-dock {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-radius: 42px;
                    padding: 15px 30px;
                    display: flex;
                    gap: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                }

                .dock-icon {
                    width: 75px;
                    height: 75px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 34px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                }

                .dock-item:hover .dock-icon {
                    transform: translateY(-20px) scale(1.2);
                }

                .pulse {
                    animation: musicPulse 2s infinite ease-in-out;
                }

                @keyframes musicPulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }

                @media (max-width: 1000px) {
                    .ios-widgets-row { grid-template-columns: 1fr; }
                    .ios-apps-container { grid-template-columns: repeat(4, 1fr); }
                }
            `}</style>
    </div>
  );
};

export default Apps;
