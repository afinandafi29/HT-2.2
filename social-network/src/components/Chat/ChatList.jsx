import React, { useState, useEffect, useContext } from 'react';
import { getConversationsApi } from '../../api/chatApi';
import { LayoutContext } from '../Layout/Layout';

const ChatList = ({ onSelectChat, currentUser }) => {
    const [conversations, setConversations] = useState({ friends: [], requests: [], following: [], others: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'friends', 'following'
    const [searchQuery, setSearchQuery] = useState('');
    const { openProfile } = useContext(LayoutContext);

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const data = await getConversationsApi();
                setConversations(data);
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const getFilteredList = () => {
        let list = [];
        if (filter === 'all') {
            list = [...conversations.friends, ...conversations.requests, ...conversations.following, ...conversations.others];
        } else if (filter === 'friends') {
            list = conversations.friends;
        } else if (filter === 'following') {
            list = conversations.following;
        }

        if (searchQuery) {
            list = list.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Deduplicate by ID
        return Array.from(new Map(list.map(item => [item.id, item])).values());
    };

    if (isLoading) {
        return (
            <div className="p-10 text-center opacity-30">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Loading Network...</p>
            </div>
        );
    }

    const filteredList = getFilteredList();

    return (
        <div className="flex flex-col h-full bg-[#0f172a]">
            {/* Mockup filter section */}
            <div className="p-4 bg-[#1e293b]/50 border-b border-white/5 space-y-4">
                <div className="flex gap-4 text-[11px] font-black uppercase tracking-wider text-gray-500">
                    <label className={`flex items-center gap-1.5 cursor-pointer transition-colors ${filter === 'all' ? 'text-blue-400' : 'hover:text-gray-300'}`}>
                        <input type="radio" name="social-filter" checked={filter === 'all'} onChange={() => setFilter('all')} className="accent-blue-500" /> ALL
                    </label>
                    <label className={`flex items-center gap-1.5 cursor-pointer transition-colors ${filter === 'friends' ? 'text-blue-400' : 'hover:text-gray-300'}`}>
                        <input type="radio" name="social-filter" checked={filter === 'friends'} onChange={() => setFilter('friends')} className="accent-blue-500" /> FRIENDS
                    </label>
                    <label className={`flex items-center gap-1.5 cursor-pointer transition-colors ${filter === 'following' ? 'text-blue-400' : 'hover:text-gray-300'}`}>
                        <input type="radio" name="social-filter" checked={filter === 'following'} onChange={() => setFilter('following')} className="accent-blue-500" /> FOLLOWING
                    </label>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                    </div>
                    <button className="px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all font-black text-[10px] flex items-center gap-2">
                        <i className="fas fa-users text-xs"></i> <span>FOLLOWERS</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {filteredList.length > 0 ? (
                    <div className="space-y-1">
                        {filteredList.map((chat) => (
                            <div key={chat.id} className="user-item group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                                <div className="relative" onClick={(e) => {
                                    e.stopPropagation();
                                    openProfile(chat);
                                }}>
                                    <img
                                        src={chat.avatar_url || "/default-avatar.png"}
                                        alt={chat.username}
                                        className="w-12 h-12 rounded-full border border-white/10 group-hover:border-blue-500/50 transition-colors object-cover bg-gray-700"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                                </div>

                                <button
                                    onClick={() => onSelectChat(chat)}
                                    className="flex-1 text-left min-w-0"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <i className="far fa-star text-[10px] text-blue-500"></i>
                                        <h4 className="text-blue-100 font-bold text-sm truncate group-hover:text-white transition-colors uppercase tracking-tight">{chat.username}</h4>
                                    </div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                        {conversations.friends.some(f => f.id === chat.id) ? 'Friend' : 'Message Request'}
                                    </p>
                                </button>

                                <div className="flex gap-4 items-center pr-2">
                                    <i className="fas fa-phone-alt text-blue-500 opacity-30 group-hover:opacity-100 cursor-pointer transition-all hover:scale-110"></i>
                                    <i className="fas fa-heart-broken text-red-500 opacity-30 group-hover:opacity-100 cursor-pointer transition-all hover:scale-110"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center flex flex-col items-center gap-4 opacity-30">
                        <i className="fas fa-users-slash text-3xl"></i>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Users Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
