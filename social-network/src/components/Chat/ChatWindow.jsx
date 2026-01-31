import React, { useState, useEffect, useRef } from 'react';
import { sendMessageApi, getMessagesApi, deleteMessageApi } from '../../api/chatApi';
import { blockUserApi, getUserProfileApi } from '../../api/userApi';
import { unfriendUserApi, acceptFriendRequestApi, rejectFriendRequestApi } from '../../api/friendApi';

const ChatWindow = ({ activeChat, currentUser, onBack, socket }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [relationship, setRelationship] = useState(null); // { isFriend, friendStatus }
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessagesAndStatus = async () => {
            if (!activeChat) return;

            // Skip fetching for dummy/temp users
            if (activeChat.id?.toString().startsWith('dummy-') || activeChat.id?.toString().startsWith('temp-')) {
                setMessages([]);
                setRelationship({ isFriend: false, friendStatus: null });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch status
                const profile = await getUserProfileApi(activeChat.id);
                setRelationship({
                    isFriend: profile.is_friend,
                    friendStatus: profile.friend_request_status,
                    chatPrivacy: profile.chat_privacy
                });

                const data = await getMessagesApi(activeChat.id);
                setMessages(data);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to load chat data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessagesAndStatus();
    }, [activeChat]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            if (message.sender_id === activeChat.id || message.receiver_id === activeChat.id) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }
        };

        const handleMessageDeleted = (messageId) => {
            setMessages((prev) => prev.filter(m => m.id !== messageId));
        };

        socket.on('receive_private_message', handleReceiveMessage);
        socket.on('message_deleted', handleMessageDeleted);

        return () => {
            socket.off('receive_private_message', handleReceiveMessage);
            socket.off('message_deleted', handleMessageDeleted);
        };
    }, [socket, activeChat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const isDummy = activeChat.id?.toString().startsWith('dummy-') || activeChat.id?.toString().startsWith('temp-');

        if (isDummy) {
            const dummyMsg = {
                id: 'dummy-msg-' + Date.now(),
                sender_id: currentUser.id,
                receiver_id: activeChat.id,
                content: newMessage,
                created_at: new Date().toISOString()
            };
            setMessages((prev) => [...prev, dummyMsg]);
            setNewMessage('');
            scrollToBottom();

            // Simulate response
            setTimeout(() => {
                const responseMsg = {
                    id: 'dummy-res-' + (Date.now() + 1),
                    sender_id: activeChat.id,
                    receiver_id: currentUser.id,
                    content: "Thanks for the message! Let's talk more soon.",
                    created_at: new Date().toISOString()
                };
                setMessages((prev) => [...prev, responseMsg]);
                scrollToBottom();
            }, 1500);
            return;
        }

        try {
            const sentMsg = await sendMessageApi(activeChat.id, newMessage);
            setMessages((prev) => [...prev, sentMsg]);
            setNewMessage('');
            scrollToBottom();

            socket.emit('send_private_message', sentMsg);

        } catch (error) {
            console.error("Failed to send message:", error);
            alert(error.response?.data?.message || "Failed to send message.");
        }
    };

    const handleAccept = async () => {
        const requestId = relationship?.friendStatus?.requestId || relationship?.friendStatus?.id;
        if (!requestId) {
            alert("No request found. Please accept via Notifications.");
            return;
        }
        try {
            await acceptFriendRequestApi(requestId);
            setRelationship(prev => ({ ...prev, isFriend: true, friendStatus: null }));
            alert("Friend request accepted!");
        } catch (err) { alert(err.message); }
    };

    const handleReject = async () => {
        const requestId = relationship?.friendStatus?.requestId || relationship?.friendStatus?.id;
        if (!requestId) return;
        try {
            await rejectFriendRequestApi(requestId);
            setRelationship(prev => ({ ...prev, friendStatus: null }));
            onBack();
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (msg) => {
        const choice = window.confirm("Delete this message for everyone?")
            ? 'everyone'
            : (window.confirm("Delete for me?") ? 'me' : null);

        if (!choice) return;

        try {
            await deleteMessageApi(msg.id, choice === 'everyone');
            setMessages(prev => prev.filter(m => m.id !== msg.id));

            if (choice === 'everyone' && socket) {
                socket.emit('message_deleted', { messageId: msg.id, receiver_id: activeChat.id });
            }
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    const handleBlock = async () => {
        if (!window.confirm("Block this user?")) return;

        if (activeChat.id?.toString().startsWith('dummy-') || activeChat.id?.toString().startsWith('temp-')) {
            alert("User blocked (Simulated)");
            onBack();
            return;
        }

        try {
            await blockUserApi(activeChat.id);
            alert("User blocked");
            onBack();
        } catch (err) { alert(err.message); }
    };

    const handleUnfriend = async () => {
        if (!window.confirm("Unfriend this user?")) return;

        if (activeChat.id?.toString().startsWith('dummy-') || activeChat.id?.toString().startsWith('temp-')) {
            alert("Unfriended (Simulated)");
            onBack();
            return;
        }

        try {
            await unfriendUserApi(activeChat.id);
            alert("Unfriended");
            onBack();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a]">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#1e293b]/50 backdrop-blur-md relative z-20">
                <button onClick={onBack} className="text-gray-400 hover:text-white mr-2">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <img
                    src={activeChat.avatar_url || "/default-avatar.png"}
                    alt={activeChat.username}
                    className="w-10 h-10 rounded-full border border-white/10"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <i className="far fa-star text-[10px] text-blue-400"></i>
                        <h3 className="text-white font-bold text-sm tracking-wide truncate uppercase">{activeChat.username}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Active</span>
                    </div>
                </div>

                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-white p-2">
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                            <button onClick={handleUnfriend} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                <i className="fas fa-user-minus text-xs opacity-50"></i> Unfriend
                            </button>
                            <button onClick={handleBlock} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                <i className="fas fa-ban text-xs opacity-50"></i> Block User
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Banner */}
            {relationship?.friendStatus?.status === 'pending' && !relationship.friendStatus.is_sender && (
                <div className="p-4 bg-blue-600/10 border-b border-blue-500/20 flex flex-col items-center gap-3 text-center">
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest">Incoming Friend Request</p>
                    <div className="flex gap-2 w-full max-w-[200px]">
                        <button onClick={handleAccept} className="flex-1 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">Accept</button>
                        <button onClick={handleReject} className="flex-1 py-1.5 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 border border-white/5 transition-all">Ignore</button>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Syncing Messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-10">
                        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl">
                            <i className="fas fa-comment-alt"></i>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-tight">Zero Messages</p>
                            <p className="text-gray-500 text-[10px] mt-1 font-bold uppercase tracking-widest opacity-50">Private and Encrypted</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUser.id;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`relative group/msg max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed transition-all shadow-sm ${isMe
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-[#1e293b] text-gray-200 rounded-bl-none border border-white/5'
                                        }`}
                                >
                                    {msg.content}
                                    {isMe && (
                                        <button
                                            onClick={() => handleDelete(msg)}
                                            className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 p-2 text-gray-600 hover:text-red-400 transition-all"
                                        >
                                            <i className="fas fa-trash text-[10px]"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#1e293b]/20">
                {!relationship?.isFriend && relationship?.chatPrivacy === 'friends_only' ? (
                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-center">
                        <p className="text-red-400 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                            <i className="fas fa-circle-notch fa-spin mr-2"></i> Private Inbox
                        </p>
                        <p className="text-gray-500 text-[10px] mt-1 italic">This user only accepts messages from friends.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#0f172a] rounded-2xl p-1.5 pl-4 border border-white/5 focus-within:border-blue-500/30 transition-all shadow-inner">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={relationship?.isFriend ? "Say something..." : "Send a message request..."}
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-600 h-10"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all disabled:opacity-20 shadow-lg shadow-blue-500/20"
                        >
                            <i className="fas fa-paper-plane text-[10px]"></i>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
