import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAIReply, hasAIKey } from '../api/aiApi';
import './AIChat.css';

const AIChat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [theme, setTheme] = useState('dark_mode');
    const [isMuted, setIsMuted] = useState(true);
    const chatContainerRef = useRef(null);

    const getDemoAIReply = (userMessage) => {
        const lower = (userMessage || '').toLowerCase().trim();
        if (/hi|hello|hey|hola|yo/.test(lower)) return "Hi! I'm Happytalk AI. How can I help you today?";
        if (/how are you|how r u|what'?s up|sup/.test(lower)) return "I'm doing great, thanks! What would you like to know?";
        if (/help|what can you do/.test(lower)) return "I can answer questions and chat. Add VITE_OPENAI_API_KEY to .env for ChatGPT. Otherwise, keep chatting!";
        if (/thanks|thank you|ty/.test(lower)) return "You're welcome! Anything else?";
        if (lower.length < 3) return "Got it! Tell me more.";
        return "That's interesting! Add VITE_OPENAI_API_KEY to .env for full AI. Until then, ask me anything!";
    };

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem("themeColor");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        document.body.className = theme === 'light_mode' ? 'light_mode' : '';
    }, [theme]);


    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
        }
    };

    const speak = (text) => {
        if (isMuted || !text) return;

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        // Select a voice if possible (prefer female)
        const voices = window.speechSynthesis.getVoices();

        // Priority list for female voices across different OS
        const preferredVoice = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('google us english') ||
                v.name.toLowerCase().includes('samantha') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('victoria') ||
                v.name.toLowerCase().includes('female'))
        );

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const typeText = (text, messageId) => {
        let index = 0;
        const words = text.split(' ');

        // Start speaking the full text immediately when typing starts
        speak(text);

        const interval = setInterval(() => {
            if (index < words.length) {
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, text: msg.text + (index === 0 ? '' : ' ') + words[index], loading: false }
                        : msg
                ));
                index++;
                scrollToBottom();
            } else {
                clearInterval(interval);
                setIsGenerating(false);
            }
        }, 30);
    };

    const handleSend = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const text = textOverride || input.trim();
        if (!text || isGenerating) return;

        const userMsg = { id: Date.now(), role: 'outgoing', text: text };
        // Create bot message holder immediately
        const botMsgId = Date.now() + 1;
        const botMsg = { id: botMsgId, role: 'incoming', text: '', loading: true };

        setMessages(prev => [...prev, userMsg, botMsg]);
        setInput('');
        setIsGenerating(true);
        scrollToBottom();

        if (!hasAIKey()) {
            const demoReply = getDemoAIReply(text);
            typeText(demoReply, botMsgId);
            return;
        }

        try {
            const contextMessages = messages
                .filter(m => !m.loading)
                .map(m => ({
                    role: m.role === 'outgoing' ? 'user' : 'assistant',
                    content: m.text
                }));
            contextMessages.push({ role: 'user', content: text });

            const apiMessages = [
                { role: 'system', content: 'You are Happytalk AI, a helpful and friendly assistant. Answer all queries to the best of your ability.' },
                ...contextMessages
            ];

            const fullText = await fetchAIReply(apiMessages);
            typeText(fullText, botMsgId);
        } catch (error) {
            console.error("AI Error:", error);
            const fallbackReply = getDemoAIReply(text);
            typeText(fallbackReply, botMsgId);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light_mode' ? 'dark_mode' : 'light_mode';
        setTheme(newTheme);
        localStorage.setItem("themeColor", newTheme);
    };

    const toggleMute = () => {
        // If we are muting, cancel any current speech
        if (!isMuted) {
            window.speechSynthesis.cancel();
        }
        setIsMuted(!isMuted);
    };

    const copyToClipboard = (text, btnId) => {
        navigator.clipboard.writeText(text);
        // Could add temporary success state here if we tracked individual button states
    };

    return (
        <div className={`ai-chat-wrapper ${theme}`}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="icon material-symbols-rounded"
                style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    zIndex: 1000,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--secondary-color)',
                    border: 'none',
                    color: 'var(--text-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
            >
                arrow_back
            </button>

            {/* Header */}
            {messages.length === 0 && (
                <header className="ai-header">
                    <h1 className="title">Happytalk AI</h1>
                    <p className="subtitle">How can I help you today?</p>
                    <ul className="suggestion-list">
                        <li className="suggestion" onClick={() => handleSend(null, "Help me plan a game night with my 5 best friends for under $100.")}>
                            <h4 className="text">Help me plan a game night with my 5 best friends for under $100.</h4>
                            <span className="icon material-symbols-rounded">draw</span>
                        </li>
                        <li className="suggestion" onClick={() => handleSend(null, "What are the best tips to improve my public speaking skills?")}>
                            <h4 className="text">What are the best tips to improve my public speaking skills?</h4>
                            <span className="icon material-symbols-rounded">lightbulb</span>
                        </li>
                        <li className="suggestion" onClick={() => handleSend(null, "Can you help me find the latest news on web development?")}>
                            <h4 className="text">Can you help me find the latest news on web development?</h4>
                            <span className="icon material-symbols-rounded">explore</span>
                        </li>
                        <li className="suggestion" onClick={() => handleSend(null, "Write JavaScript code to sum all elements in an array.")}>
                            <h4 className="text">Write JavaScript code to sum all elements in an array.</h4>
                            <span className="icon material-symbols-rounded">code</span>
                        </li>
                    </ul>
                </header>
            )}

            <div className="chat-list" ref={chatContainerRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.role} ${msg.loading ? 'loading' : ''}`}>
                        <div className="message-content">
                            <img
                                className="avatar"
                                src={msg.role === 'outgoing'
                                    ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    : "https://ui-avatars.com/api/?name=Happytalk+AI&background=0D8ABC&color=fff"}
                                alt={msg.role === 'outgoing' ? "User" : "AI"}
                            />

                            {msg.loading && msg.text === '' ? (
                                <div className="loading-indicator">
                                    <div className="loading-bar"></div>
                                    <div className="loading-bar"></div>
                                    <div className="loading-bar"></div>
                                </div>
                            ) : (
                                <p className="text">{msg.text}</p>
                            )}
                        </div>
                        {msg.role === 'incoming' && !msg.loading && (
                            <span onClick={() => copyToClipboard(msg.text)} className="icon material-symbols-rounded">content_copy</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="typing-area">
                <form className="typing-form" onSubmit={handleSend}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Enter a prompt here"
                            className="typing-input"
                            required
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" id="send-message-button" className="icon material-symbols-rounded">send</button>
                    </div>
                    <div className="action-buttons">
                        <span id="theme-toggle-button" className="icon material-symbols-rounded" onClick={toggleTheme} title="Toggle Theme">
                            {theme === 'light_mode' ? 'dark_mode' : 'light_mode'}
                        </span>
                        <span id="mute-toggle-button" className="icon material-symbols-rounded" onClick={toggleMute} title={isMuted ? "Unmute AI" : "Mute AI"}>
                            {isMuted ? 'volume_off' : 'volume_up'}
                        </span>
                        <span id="delete-chat-button" className="icon material-symbols-rounded" onClick={() => setMessages([])} title="Clear Chat">delete</span>
                    </div>
                </form>
                <p className="disclaimer-text">
                    Happytalk It may display inaccurate info, including about people, so double-check its responses.
                </p>
            </div>
        </div>
    );
};

export default AIChat;
