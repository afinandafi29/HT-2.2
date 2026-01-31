import React, { useEffect } from 'react';
import ChatInterface from '../Chat/ChatInterface';

const ChatPanel = ({ isOpen, onClose }) => {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <>
            <aside className={`right-sidebar ${isOpen ? 'active' : ''}`} style={{ zIndex: 3000 }}>
                <div className="h-full w-full bg-[#0f172a] flex flex-col">
                    {/* Chat Interface component handles its own layout, we just provide the container */}
                    {isOpen && <ChatInterface onClose={onClose} />}
                </div>
            </aside>
            {isOpen && (
                <div
                    className="right-sidebar-overlay"
                    onClick={onClose}
                    style={{ zIndex: 2999 }}
                ></div>
            )}
        </>
    );
};

export default ChatPanel;
