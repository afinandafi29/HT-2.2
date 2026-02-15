import React, { useState, useEffect, useRef } from 'react';
import { sendMessageApi, getMessagesApi, deleteMessageApi } from '../../api/chatApi';
import { blockUserApi, getUserProfileApi } from '../../api/userApi';
import { unfriendUserApi, acceptFriendRequestApi, rejectFriendRequestApi } from '../../api/friendApi';
import { fetchAIReply, hasAIKey } from '../../api/aiApi';

function getDemoAIReply(userMessage) {
    const lower = (userMessage || '').toLowerCase().trim();
    if (/hi|hello|hey|hola|yo/.test(lower)) return "Hi! I'm your HAPPYY TALK AI assistant. How can I help you today?";
    if (/how are you|how r u|what'?s up|sup/.test(lower)) return "I'm doing great, thanks for asking! What's on your mind?";
    if (/help|what can you do/.test(lower)) return "I can chat with you here. Add VITE_OPENAI_API_KEY or VITE_GITHUB_AI_TOKEN to .env for full AI. Otherwise, just keep chatting!";
    if (/thanks|thank you|ty/.test(lower)) return "You're welcome! Anything else?";
    if (lower.length < 3) return "Got it! Tell me more—I'm listening.";
    return "That's interesting! Add VITE_OPENAI_API_KEY to .env for ChatGPT-powered replies. Until then, I'm here to chat!";
}

async function getAIReply(userMessage, conversationHistory = [], myId = 'me') {
    if (!hasAIKey()) return getDemoAIReply(userMessage);
    try {
        const history = conversationHistory.slice(-10).map(m => ({
            role: (m.sender_id === myId || m.sender_id === 'me') ? 'user' : 'assistant',
            content: m.content
        }));
        const messages = [
            { role: 'system', content: 'You are a friendly, helpful assistant on HAPPYY TALK. Keep replies conversational and concise (1-3 sentences).' },
            ...history,
            { role: 'user', content: userMessage }
        ];
        return await fetchAIReply(messages);
    } catch (err) {
        console.error('AI error:', err);
        return getDemoAIReply(userMessage);
    }
}

const ChatWindow = ({ activeChat, currentUser, onBack, socket }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [relationship, setRelationship] = useState(null); // { isFriend, friendStatus }
    const messagesEndRef = useRef(null);

    const colors = {
        bgDark: '#111b21',
        bgDarker: '#0b1419',
        bgLight: '#202c33',
        bgSent: '#005c4b',
        bgReceived: '#202c33',
        textPrimary: '#e9edef',
        textSecondary: '#8696a0',
        green: '#00a884',
        border: '#2a3942'
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessagesAndStatus = async () => {
            if (!activeChat) return;

            // Skip fetching for dummy/temp users
            if (activeChat.id?.toString().startsWith('dummy-') || activeChat.id?.toString().startsWith('temp-')) {
                setMessages([
                    { id: 'm1', sender_id: activeChat.id, receiver_id: 'me', content: 'Hey there! How is it going?', created_at: new Date().toISOString() },
                    { id: 'm2', sender_id: 'me', receiver_id: activeChat.id, content: 'Pretty good, just testing the new UI!', created_at: new Date().toISOString() }
                ]);
                setRelationship({ isFriend: true, friendStatus: null });
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
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        const isAI = activeChat.id?.toString().startsWith('ai-');
        const isDummy = activeChat.id?.toString().startsWith('dummy-') || activeChat.id?.toString().startsWith('temp-');

        if (isAI || isDummy) {
            const userMsg = {
                id: 'local-' + Date.now(),
                sender_id: currentUser?.id || 'me',
                receiver_id: activeChat.id,
                content: newMessage,
                created_at: new Date().toISOString()
            };
            setMessages((prev) => [...prev, userMsg]);
            const text = newMessage;
            setNewMessage('');
            setTimeout(scrollToBottom, 50);

            // AI reply (OpenAI / GitHub AI)
            (async () => {
                const myId = currentUser?.id || 'me';
                const historyWithUser = [...messages, userMsg];
                const responseText = await getAIReply(text, historyWithUser, myId);
                const responseMsg = {
                    id: 'ai-res-' + (Date.now() + 1),
                    sender_id: activeChat.id,
                    receiver_id: myId,
                    content: responseText,
                    created_at: new Date().toISOString()
                };
                setMessages((prev) => [...prev, responseMsg]);
                setTimeout(scrollToBottom, 50);
            })();
            return;
        }

        try {
            const sentMsg = await sendMessageApi(activeChat.id, newMessage);
            setMessages((prev) => [...prev, sentMsg]);
            setNewMessage('');
            setTimeout(scrollToBottom, 50);

            socket.emit('send_private_message', sentMsg);

        } catch (error) {
            console.error("Failed to send message:", error);
            alert(error.response?.data?.message || "Failed to send message.");
        }
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

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: colors.bgDarker }}>
            {/* Header */}
            <div className="flex items-center px-4 py-2 shadow-md relative z-20" style={{ backgroundColor: colors.bgLight }}>
                <button onClick={onBack} className="text-gray-400 hover:text-white mr-3">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="flex items-center flex-1 min-w-0 gap-3">
                    <img
                        src={activeChat.avatar_url || "/default-avatar.png"}
                        alt={activeChat.username}
                        className="w-10 h-10 rounded-full border border-white/5 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate uppercase tracking-tight" style={{ color: colors.textPrimary }}>{activeChat.displayName || (activeChat.username && activeChat.username.replace(/_\d+$/, '')) || activeChat.username}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.green }}>online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-gray-400 ml-2">
                    <i className="fas fa-video cursor-pointer hover:text-white transition-colors"></i>
                    <i className="fas fa-phone cursor-pointer hover:text-white transition-colors"></i>
                    <i className="fas fa-ellipsis-v cursor-pointer hover:text-white transition-colors" onClick={() => setShowMenu(!showMenu)}></i>
                </div>

                {showMenu && (
                    <div className="absolute right-4 top-14 w-40 rounded-xl shadow-2xl py-2 z-50 border border-white/5 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: colors.bgLight }}>
                        <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors" style={{ color: colors.textPrimary }}>View Profile</button>
                        <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors" style={{ color: colors.textPrimary }}>Block User</button>
                        <button className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors text-red-400">Clear Chat</button>
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar" style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(11, 20, 25, 0.95)' }}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${colors.green} ${colors.green} transparent transparent` }}></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: colors.textSecondary }}>End-to-end encrypted</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === (currentUser?.id || 'me');
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                                <div
                                    className={`relative group max-w-[85%] px-3 py-1.5 rounded-lg text-sm shadow-sm transition-all ${isMe
                                        ? 'rounded-tr-none'
                                        : 'rounded-tl-none'
                                        }`}
                                    style={{
                                        backgroundColor: isMe ? colors.bgSent : colors.bgReceived,
                                        color: colors.textPrimary
                                    }}
                                >
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                        <span className="text-[9px] uppercase font-bold">10:45 AM</span>
                                        {isMe && <i className="fas fa-check-double text-[10px]" style={{ color: '#53bdeb' }}></i>}
                                    </div>

                                    {isMe && (
                                        <button
                                            onClick={() => handleDelete(msg)}
                                            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-400 transition-all"
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
            <div className="p-2 border-t flex items-center gap-2" style={{ backgroundColor: colors.bgLight, borderColor: colors.border }}>
                <div className="flex items-center gap-4 px-2 text-gray-400">
                    <i className="far fa-smile text-xl cursor-pointer hover:text-white transition-colors"></i>
                    <i className="fas fa-plus text-lg cursor-pointer hover:text-white transition-colors"></i>
                </div>

                <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 border-none outline-none py-2.5 px-4 rounded-xl text-sm"
                        style={{ backgroundColor: colors.bgDarker, color: colors.textPrimary }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                        style={{ backgroundColor: colors.green, color: 'white' }}
                    >
                        <i className={`fas ${newMessage.trim() ? 'fa-paper-plane' : 'fa-microphone'} text-sm`}></i>
                    </button>
                </form>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(134, 150, 160, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ChatWindow;
