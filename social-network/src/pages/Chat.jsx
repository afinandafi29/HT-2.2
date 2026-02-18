import React, { useState, useEffect } from 'react';
import '../styles/chat.css';

const Chat = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const ROCKET_CHAT_URL = import.meta.env.VITE_ROCKET_CHAT_URL || 'http://localhost:3000';

    useEffect(() => {
        // Check if Rocket.Chat is accessible
        const checkRocketChat = async () => {
            try {
                const response = await fetch(ROCKET_CHAT_URL, {
                    method: 'HEAD',
                    mode: 'no-cors' // This will succeed if server is up
                });
                setIsConnected(true);
                setIsLoading(false);
            } catch (err) {
                setError('Rocket.Chat is not running. Please start it first.');
                setIsLoading(false);
            }
        };

        // Initial check
        checkRocketChat();

        // Retry every 5 seconds if not connected
        const interval = setInterval(() => {
            if (!isConnected) {
                checkRocketChat();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isConnected, ROCKET_CHAT_URL]);

    if (isLoading) {
        return (
            <div className="chat-page-container">
                <div className="chat-status-message">
                    <div className="chat-loader"></div>
                    <h2>Connecting to HAPPYY TALK Chat...</h2>
                    <p>Please wait while we connect to Rocket.Chat</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-page-container">
                <div className="chat-status-message error">
                    <div className="chat-error-icon">⚠️</div>
                    <h2>Chat Server Not Running</h2>
                    <p>{error}</p>
                    <div className="chat-help-box">
                        <h3>Quick Start:</h3>
                        <code>cd Rocket.Chat && docker-compose up -d</code>
                        <p className="mt-2">Or use the all-in-one script:</p>
                        <code>./start-with-chat.sh</code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="chat-retry-button"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page-container">
            <div className="chat-iframe-wrapper">
                <iframe
                    src={ROCKET_CHAT_URL}
                    title="HAPPYY TALK Chat"
                    className="chat-iframe"
                    allow="camera;microphone;fullscreen;display-capture;clipboard-read;clipboard-write"
                />
            </div>
        </div>
    );
};

export default Chat;
