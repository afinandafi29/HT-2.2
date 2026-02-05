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

    // WhatsApp-inspired design constants
    const colors = {
        bgDark: '#111b21',
        bgDarker: '#0b1419',
        bgLight: '#202c33',
        textPrimary: '#e9edef',
        textSecondary: '#8696a0',
        green: '#00a884',
        border: '#2a3942'
    };

    return (
        <div className="h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: colors.bgDarker }}>
            {/* Header / Tabs */}
            <div className="flex border-b relative z-30" style={{ backgroundColor: colors.bgLight, borderColor: colors.border }}>
                <div className="flex items-center px-4 py-2 flex-grow overflow-hidden">
                    <h3 className="text-lg font-bold truncate" style={{ color: colors.textPrimary }}>
                        {activeTab === 'chat' ? 'Chats' : 'Notifications'}
                    </h3>
                </div>
                <div className="flex items-center pr-2">
                    <button
                        onClick={() => setActiveTab('social')}
                        className={`p-3 transition-all relative ${activeTab === 'social' ? 'text-green-500' : 'text-gray-400 hover:text-gray-300'}`}
                        style={{ color: activeTab === 'social' ? colors.green : undefined }}
                    >
                        <i className="fas fa-bell text-lg"></i>
                        {activeTab === 'social' && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.green }}></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`p-3 transition-all relative ${activeTab === 'chat' ? 'text-green-500' : 'text-gray-400 hover:text-gray-300'}`}
                        style={{ color: activeTab === 'chat' ? colors.green : undefined }}
                    >
                        <i className="fas fa-comment-dots text-lg"></i>
                        {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: colors.green }}></div>}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden relative">
                {activeChat ? (
                    <div className="absolute inset-0 z-40" style={{ backgroundColor: colors.bgDarker }}>
                        <ChatWindow
                            activeChat={activeChat}
                            currentUser={currentUser}
                            onBack={() => setActiveChat(null)}
                            socket={socket}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col h-full">

                        <div className="flex-grow flex flex-col overflow-hidden">
                            {activeTab === 'social' ? (
                                <div className="flex-grow overflow-y-auto custom-scrollbar">
                                    <div className="p-4 text-[10px] font-black uppercase tracking-widest opacity-40 border-b" style={{ color: colors.textSecondary, borderColor: colors.border }}>
                                        Recent Activity
                                    </div>
                                    <NotificationList
                                        compact={true}
                                        onNotificationClick={(n) => { }}
                                    />
                                </div>
                            ) : (
                                <ChatList
                                    currentUser={currentUser}
                                    onSelectChat={setActiveChat}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(134, 150, 160, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ChatInterface;
