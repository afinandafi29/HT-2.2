import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message, isOwn, onDelete, canDeleteForEveryone }) => {
    const [showActions, setShowActions] = React.useState(false);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isOwn && (
                    <img
                        src={message.sender_avatar || '/default-avatar.png'}
                        alt={message.sender_name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                )}

                {/* Message Content */}
                <div className={`relative ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Sender Name (for received messages) */}
                    {!isOwn && (
                        <span className="text-xs text-gray-400 mb-1 px-3">
                            {message.sender_name}
                        </span>
                    )}

                    {/* Message Bubble */}
                    <div
                        className={`rounded-2xl px-4 py-2 ${isOwn
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-gray-800 text-white rounded-bl-sm'
                            }`}
                    >
                        <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>

                        {/* Timestamp */}
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                                {formatTime(message.created_at)}
                            </span>
                            {isOwn && message.status && (
                                <i className={`fas fa-check${message.status === 'read' ? '-double' : ''} text-xs ${message.status === 'read' ? 'text-blue-300' : 'text-blue-200'
                                    }`}></i>
                            )}
                        </div>
                    </div>

                    {/* Delete Actions */}
                    {showActions && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute ${isOwn ? 'right-full mr-2' : 'left-full ml-2'} top-0 bg-gray-900 rounded-lg shadow-lg border border-white/10 p-1 flex gap-1`}
                        >
                            <button
                                onClick={() => onDelete(message.id, 'me')}
                                className="px-3 py-1 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                                title="Delete for me"
                            >
                                <i className="fas fa-trash-alt mr-1"></i>
                                Delete for me
                            </button>
                            {canDeleteForEveryone && (
                                <button
                                    onClick={() => onDelete(message.id, 'everyone')}
                                    className="px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                    title="Delete for everyone"
                                >
                                    <i className="fas fa-trash mr-1"></i>
                                    Delete for everyone
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatBubble;
