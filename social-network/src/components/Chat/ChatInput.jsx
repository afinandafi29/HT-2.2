import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSend, placeholder = "Type a message...", disabled = false }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-gray-900/50">
            <div className="flex items-end gap-2">
                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={1}
                        className="w-full bg-gray-800 text-white rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            minHeight: '48px',
                            maxHeight: '120px',
                            overflowY: message.length > 100 ? 'auto' : 'hidden'
                        }}
                    />

                    {/* Emoji Button (optional) */}
                    <button
                        type="button"
                        className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-300 transition-colors"
                        title="Add emoji"
                    >
                        <i className="far fa-smile text-xl"></i>
                    </button>
                </div>

                {/* Send Button */}
                <motion.button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${message.trim() && !disabled
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <i className="fas fa-paper-plane"></i>
                </motion.button>
            </div>
        </form>
    );
};

export default ChatInput;
