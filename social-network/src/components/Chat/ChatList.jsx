import React, { useState, useEffect, useContext } from 'react';
import { getConversationsApi } from '../../api/chatApi';
import { LayoutContext } from '../Layout/Layout';

const ChatList = ({ onSelectChat, currentUser }) => {
    const [conversations, setConversations] = useState({ friends: [], requests: [], following: [], others: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { openProfile } = useContext(LayoutContext);

    const colors = {
        bgDark: '#111b21',
        bgDarker: '#0b1419',
        bgLight: '#202c33',
        bgHover: '#2a3942',
        textPrimary: '#e9edef',
        textSecondary: '#8696a0',
        green: '#00a884',
        border: '#2a3942'
    };

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const data = await getConversationsApi();

                // List of random names for AI
                const randomNameList = [
                    "Liam", "Olivia", "Noah", "Emma", "Oliver", "Charlotte", "James", "Amelia",
                    "Elijah", "Sophia", "William", "Harper", "Henry", "Ava", "Lucas", "Isabella",
                    "Benjamin", "Mia", "Theodore", "Evelyn", "Mateo", "Gianna", "Levi", "Luna",
                    "Sebastian", "Ella", "Daniel", "Elizabeth", "Jack", "Camila", "Alexander", "Sofia",
                    "Jackson", "Aria", "Michael", "Scarlett", "Mason", "Victoria", "Sebastian", "Madison"
                ];

                // Generate 100 AI users
                const aiUsers = Array.from({ length: 100 }, (_, i) => {
                    const name = randomNameList[i % randomNameList.length];
                    const randomId = Math.floor(Math.random() * 9999);
                    return {
                        id: `ai-${i}`,
                        username: `${name}_${randomId}`,
                        avatar_url: `https://i.pravatar.cc/150?u=ai-${i}`,
                        last_message: 'Hi! I am here to help you. Feel free to chat with me.',
                        isAI: true
                    };
                });

                setConversations({
                    ...data,
                    friends: [...(data.friends || []), ...aiUsers]
                });
            } catch (error) {
                console.error("Failed to load conversations:", error);
                // Fallback with 100 AI users
                const randomNameListFallback = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Charlotte", "James", "Amelia"];
                const aiUsers = Array.from({ length: 100 }, (_, i) => {
                    const name = randomNameListFallback[i % randomNameListFallback.length];
                    return {
                        id: `ai-${i}`,
                        username: `${name}_${i}`,
                        avatar_url: `https://i.pravatar.cc/150?u=ai-${i}`,
                        last_message: 'Hi! Feel free to chat with me.',
                        isAI: true
                    };
                });
                setConversations({
                    friends: aiUsers,
                    requests: [],
                    following: [],
                    others: []
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const getFilteredList = () => {
        let list = [...conversations.friends, ...conversations.requests, ...conversations.following, ...conversations.others];
        if (searchQuery) {
            list = list.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return Array.from(new Map(list.map(item => [item.id, item])).values());
    };

    if (isLoading) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center gap-3 opacity-50">
                <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${colors.green} ${colors.green} transparent transparent` }}></div>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.green }}>Syncing Chats...</p>
            </div>
        );
    }

    const filteredList = getFilteredList();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Search Bar */}
            <div className="p-2 border-b" style={{ backgroundColor: colors.bgDarker, borderColor: colors.border }}>
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-none rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none"
                        style={{ backgroundColor: colors.bgLight, color: colors.textPrimary }}
                    />
                    <i className="fas fa-search absolute left-4 text-xs" style={{ color: colors.textSecondary }}></i>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredList.length > 0 ? (
                    <div className="flex flex-col">
                        {filteredList.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat(chat)}
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b"
                                style={{ borderColor: `${colors.border}22` }}
                            >
                                <div className="relative flex-shrink-0" onClick={(e) => {
                                    e.stopPropagation();
                                    openProfile(chat);
                                }}>
                                    <img
                                        src={chat.avatar_url || "/default-avatar.png"}
                                        alt={chat.username}
                                        className="w-12 h-12 rounded-full object-cover"
                                        style={{ backgroundColor: colors.bgLight }}
                                    />
                                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 rounded-full shadow-lg" style={{ borderColor: colors.bgDark }}></div>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="font-medium text-sm truncate" style={{ color: colors.textPrimary }}>{chat.username}</h4>
                                        <span className="text-[10px]" style={{ color: colors.textSecondary }}>10:45 AM</span>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                                            {chat.last_message || "Start a private conversation..."}
                                        </p>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i className="fas fa-chevron-down text-[10px]" style={{ color: colors.textSecondary }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center flex flex-col items-center gap-4 opacity-40">
                        <i className="fas fa-comment-slash text-3xl"></i>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Conversations</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(134, 150, 160, 0.1); border-radius: 10px; }
                div[onClick]:hover { background-color: ${colors.bgHover} !important; }
            `}</style>
        </div>
    );
};

export default ChatList;
