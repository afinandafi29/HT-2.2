import React, { useState, useEffect } from 'react';
import { getNotificationsApi, markAsReadApi } from '../../api/notificationApi';
import { acceptFriendRequestApi, rejectFriendRequestApi } from '../../api/friendApi';
import { useSocket } from '../../contexts/SocketContext';

const NotificationList = ({ onClose, compact = false, onNotificationClick }) => {
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on('new_notification', (notif) => {
                setNotifications(prev => [notif, ...prev]);
            });
        }

        return () => {
            if (socket) socket.off('new_notification');
        };
    }, [socket]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await getNotificationsApi();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (e, notif, action) => {
        e.stopPropagation(); // Prevent clicking the notification itself
        try {
            if (notif.type === 'friend_request' || notif.type === 'follow_request') {
                const requestId = notif.data?.requestId;
                if (!requestId) return;

                if (action === 'accept') {
                    await acceptFriendRequestApi(requestId);
                    alert("Follow request accepted! You are now mutually following if they followed you back.");
                } else {
                    await rejectFriendRequestApi(requestId);
                }
            }

            // Mark as read and remove from list or update status
            await markAsReadApi(notif.id);
            setNotifications(prev => prev.filter(n => n.id !== notif.id));
        } catch (error) {
            alert(error.message || "Action failed");
        }
    };

    const handleNotifClick = (notif) => {
        if (onNotificationClick) {
            onNotificationClick(notif);
        }

        // Logic to redirect to chat or profile
        if (notif.type === 'friend_accepted' || notif.type === 'follow_accepted' || notif.type === 'message_request' || notif.type === 'friend_request' || notif.type === 'follow_request') {
            const sender = notif.sender;
            if (sender) {
                // Trigger global chat open
                window.dispatchEvent(new CustomEvent('OPEN_AND_SELECT_CHAT', {
                    detail: {
                        userId: sender.id,
                        username: sender.username,
                        avatar_url: sender.avatar_url
                    }
                }));
            }
        }
    };

    const renderNotification = (notif) => {
        const sender = notif.sender || { username: 'Someone', avatar_url: '/default-avatar.png' };

        return (
            <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`p-3 border-b border-white/5 bg-[#1e293b]/30 hover:bg-white/5 transition-all cursor-pointer group ${!notif.is_read ? 'border-l-2 border-l-blue-500' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={sender.avatar_url || '/default-avatar.png'} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                        {!notif.is_read && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#1a222c]"></div>}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <i className="far fa-star text-[10px] text-blue-400"></i>
                            <span className="text-white text-xs font-bold truncate uppercase tracking-tight">{sender.username}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                            {(notif.type === 'friend_request' || notif.type === 'follow_request') && 'Sent you a follow request'}
                            {(notif.type === 'friend_accepted' || notif.type === 'follow_accepted') && 'Accepted your follow request'}
                            {notif.type === 'follow' && 'Started following you'}
                            {notif.type === 'message_request' && 'Sent you a message request'}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {(notif.type === 'friend_request' || notif.type === 'follow_request') ? (
                            <>
                                <button onClick={(e) => handleAction(e, notif, 'accept')} className="w-7 h-7 flex items-center justify-center bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                    <i className="fas fa-check text-[10px]"></i>
                                </button>
                                <button onClick={(e) => handleAction(e, notif, 'reject')} className="w-7 h-7 flex items-center justify-center bg-white/5 text-gray-500 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all">
                                    <i className="fas fa-times text-[10px]"></i>
                                </button>
                            </>
                        ) : (
                            <i className="fas fa-heart text-red-500/30 group-hover:text-red-500 transition-colors text-xs"></i>
                        )}
                    </div>
                </div>
                {notif.type === 'message_request' && notif.data?.content && (
                    <div className="mt-2 ml-13 p-2 bg-black/20 rounded-lg text-[10px] text-gray-400 italic border border-white/5 line-clamp-1">
                        "{notif.data.content}"
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a]">
            {!compact && (
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b]/50">
                    <h3 className="text-white font-black uppercase tracking-widest text-sm">Alerts</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="p-10 text-center opacity-30">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-3">
                        <i className="fas fa-bell-slash text-2xl opacity-10"></i>
                        <p className="text-[10px] uppercase font-black tracking-widest">Inbox Empty</p>
                    </div>
                ) : (
                    notifications.map(renderNotification)
                )}
            </div>
        </div>
    );
};

export default NotificationList;
