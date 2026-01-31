import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import NotificationList from '../Notifications/NotificationList';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const ChatInterface = ({ onClose }) => {
    const { currentUser } = useAuth();
    const socket = useSocket();
    const [activeChat, setActiveChat] = useState(null);
    const [activeTab, setActiveTab] = useState('chat'); // 'social' or 'chat'

    // Listen for global Open and Select Chat events
    useEffect(() => {
        const handleOpenAndSelectChat = (e) => {
            const { userId, username, avatar_url } = e.detail;
            if (userId) {
                setActiveChat({ id: userId, username, avatar_url });
                setActiveTab('chat');
            }
        };
        window.addEventListener('OPEN_AND_SELECT_CHAT', handleOpenAndSelectChat);
        return () => window.removeEventListener('OPEN_AND_SELECT_CHAT', handleOpenAndSelectChat);
    }, []);

    if (!currentUser) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#0f172a]">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-lock text-3xl text-blue-500"></i>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Secure Messages</h3>
                <p className="text-gray-400 mb-6">Please sign in to access your private conversations and social network.</p>
                <button onClick={() => window.location.href = '/in'} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all">Sign In</button>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-[#0f172a] overflow-hidden">
            {/* Custom Tabs Header - Matching Mockup */}
            <div className="flex bg-[#1e293b] border-b border-white/5 relative z-30">
                <button
                    onClick={() => setActiveTab('social')}
                    className={`flex-1 py-4 text-center transition-all relative ${activeTab === 'social' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <i className="fas fa-users text-xl"></i>
                    {activeTab === 'social' && <div className="absolute bottom-0 left-[20%] right-[20%] h-1 bg-blue-500 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-4 text-center transition-all relative ${activeTab === 'chat' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <i className="fas fa-comment-dots text-xl"></i>
                    {activeTab === 'chat' && <div className="absolute bottom-0 left-[20%] right-[20%] h-1 bg-blue-500 rounded-t-full"></div>}
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-4 text-gray-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden relative">
                {activeChat ? (
                    <div className="absolute inset-0 z-40 bg-[#0f172a]">
                        <ChatWindow
                            activeChat={activeChat}
                            currentUser={currentUser}
                            onBack={() => setActiveChat(null)}
                            socket={socket}
                        />
                    </div>
                ) : (
                    <>
                        {activeTab === 'social' ? (
                            <div className="flex-grow flex flex-col">
                                <div className="p-4 bg-[#1e293b]/50 border-b border-white/5">
                                    <div className="flex gap-4 mb-4 text-[11px] font-black uppercase tracking-wider text-gray-400">
                                        <label className="flex items-center gap-1.5 cursor-pointer text-blue-400">
                                            <input type="radio" name="social-filter" defaultChecked className="accent-blue-500" /> ALL
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-200">
                                            <input type="radio" name="social-filter" className="accent-blue-500" /> FRIENDS
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-200">
                                            <input type="radio" name="social-filter" className="accent-blue-500" /> FOLLOWING
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Search people..."
                                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                            />
                                            <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                                        </div>
                                        <button className="px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all">
                                            <i className="fas fa-users"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-grow overflow-y-auto custom-scrollbar">
                                    <NotificationList
                                        compact={true}
                                        onNotificationClick={(n) => {
                                            // Redirect logic could go here
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <ChatList
                                currentUser={currentUser}
                                onSelectChat={setActiveChat}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
