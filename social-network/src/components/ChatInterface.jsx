// Chat Interface Component
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './ChatInterface.css';

const API_BASE = 'http://localhost:5001/api';
const SOCKET_URL = 'http://localhost:5001';

let socket = null;

const ChatInterface = ({ currentUser, isOpen, onClose }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [inbox, setInbox] = useState([]);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (isOpen && currentUser) {
            initializeSocket();
            loadFriends();
            loadInbox();
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [isOpen, currentUser]);

    useEffect(() => {
        // Listen for custom event to open chat with specific user
        const handleOpenChat = (event) => {
            const { user } = event.detail;
            handleSelectFriend(user);
        };

        window.addEventListener('openChat', handleOpenChat);
        return () => window.removeEventListener('openChat', handleOpenChat);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeSocket = () => {
        if (!socket) {
            socket = io(SOCKET_URL);

            socket.on('connect', () => {
                console.log('Chat socket connected');
                socket.emit('join_user', currentUser.id);
            });

            socket.on('online_users', (users) => {
                setOnlineUsers(users);
            });

            socket.on('receive_private_message', (message) => {
                if (selectedFriend &&
                    (message.sender_id === selectedFriend.id || message.receiver_id === selectedFriend.id)) {
                    setMessages(prev => [...prev, message]);

                    // Mark as read if chat is open
                    if (message.receiver_id === currentUser.id) {
                        markAsRead(message.id);
                    }
                }

                // Update inbox
                loadInbox();
            });

            socket.on('message_deleted', (messageId) => {
                setMessages(prev => prev.filter(m => m.id !== messageId));
            });

            socket.on('partner_typing', ({ userId }) => {
                if (selectedFriend && userId === selectedFriend.id) {
                    setIsTyping(true);
                }
            });

            socket.on('partner_stopped_typing', ({ userId }) => {
                if (selectedFriend && userId === selectedFriend.id) {
                    setIsTyping(false);
                }
            });

            socket.on('message_read_receipt', ({ messageId }) => {
                setMessages(prev => prev.map(m =>
                    m.id === messageId ? { ...m, read: true } : m
                ));
            });

            socket.on('friendship_created', ({ friendId }) => {
                loadFriends();
            });
        }
    };

    const loadFriends = async () => {
        try {
            const res = await axios.get(`${API_BASE}/social/friends`, {
                params: { userId: currentUser.id }
            });
            setFriends(res.data.data || []);
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    };

    const loadInbox = async () => {
        try {
            const res = await axios.get(`${API_BASE}/messages/inbox/all`, {
                params: { userId: currentUser.id }
            });
            setInbox(res.data.data || []);
        } catch (error) {
            console.error('Error loading inbox:', error);
        }
    };

    const handleSelectFriend = async (friend) => {
        setSelectedFriend(friend);
        setMessages([]);

        try {
            const res = await axios.get(`${API_BASE}/messages/${friend.id}`, {
                params: { currentUserId: currentUser.id }
            });
            setMessages(res.data.data || []);

            // Mark all unread messages as read
            const unreadMessages = res.data.data.filter(m =>
                m.receiver_id === currentUser.id && !m.read
            );
            for (const msg of unreadMessages) {
                await markAsRead(msg.id);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend) return;

        try {
            const res = await axios.post(`${API_BASE}/messages/${selectedFriend.id}`, {
                senderId: currentUser.id,
                content: newMessage
            });

            const message = res.data.data;
            setMessages(prev => [...prev, message]);
            setNewMessage('');

            // Emit socket event
            if (socket) {
                socket.emit('send_private_message', message);
                socket.emit('typing_stop', {
                    userId: currentUser.id,
                    partnerId: selectedFriend.id
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.error || 'Failed to send message');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Delete this message?')) return;

        try {
            await axios.delete(`${API_BASE}/messages/${messageId}`, {
                data: { userId: currentUser.id }
            });

            setMessages(prev => prev.filter(m => m.id !== messageId));

            if (socket) {
                socket.emit('message_deleted', {
                    messageId,
                    receiver_id: selectedFriend.id
                });
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await axios.put(`${API_BASE}/messages/${messageId}/read`, {
                userId: currentUser.id
            });

            if (socket) {
                const message = messages.find(m => m.id === messageId);
                if (message) {
                    socket.emit('message_read', {
                        messageId,
                        senderId: message.sender_id
                    });
                }
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket || !selectedFriend) return;

        // Emit typing start
        socket.emit('typing_start', {
            userId: currentUser.id,
            partnerId: selectedFriend.id
        });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to emit typing stop
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing_stop', {
                userId: currentUser.id,
                partnerId: selectedFriend.id
            });
        }, 1000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    const getUnreadCount = (friendId) => {
        const conversation = inbox.find(c => c.partnerId === friendId);
        return conversation?.unreadCount || 0;
    };

    if (!isOpen) return null;

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h2>💬 Messages</h2>
                <button className="chat-close" onClick={onClose}>×</button>
            </div>

            <div className="chat-container">
                {/* Friends List */}
                <div className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <h3>Friends ({friends.length})</h3>
                    </div>
                    <div className="friends-list">
                        {friends.length === 0 ? (
                            <div className="no-friends">
                                <p>No friends yet!</p>
                                <p className="hint">Follow users to become friends</p>
                            </div>
                        ) : (
                            friends.map(friend => (
                                <div
                                    key={friend.id}
                                    className={`friend-item ${selectedFriend?.id === friend.id ? 'active' : ''}`}
                                    onClick={() => handleSelectFriend(friend)}
                                >
                                    <div className="friend-avatar-wrapper">
                                        <img
                                            src={friend.avatar || '/default-avatar.png'}
                                            alt={friend.username}
                                            className="friend-avatar"
                                        />
                                        {isUserOnline(friend.id) && (
                                            <span className="online-indicator"></span>
                                        )}
                                    </div>
                                    <div className="friend-info">
                                        <div className="friend-name">{friend.username}</div>
                                        {getUnreadCount(friend.id) > 0 && (
                                            <span className="unread-badge">
                                                {getUnreadCount(friend.id)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-main">
                    {selectedFriend ? (
                        <>
                            <div className="chat-conversation-header">
                                <img
                                    src={selectedFriend.avatar || '/default-avatar.png'}
                                    alt={selectedFriend.username}
                                    className="conversation-avatar"
                                />
                                <div>
                                    <h3>{selectedFriend.username}</h3>
                                    {isUserOnline(selectedFriend.id) && (
                                        <span className="status-online">Online</span>
                                    )}
                                </div>
                            </div>

                            <div className="messages-container">
                                {messages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            {message.content}
                                            {message.sender_id === currentUser.id && (
                                                <button
                                                    className="message-delete"
                                                    onClick={() => handleDeleteMessage(message.id)}
                                                    title="Delete message"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        <div className="message-meta">
                                            {new Date(message.created_at).toLocaleTimeString()}
                                            {message.sender_id === currentUser.id && (
                                                <span className="read-receipt">
                                                    {message.read ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="message-input-form" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    placeholder="Type a message..."
                                    className="message-input"
                                />
                                <button type="submit" className="send-button">
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-conversation">
                            <p>Select a friend to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
