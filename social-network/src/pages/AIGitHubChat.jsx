import React, { useState, useRef, useEffect } from 'react';

const AIGitHubChat = () => {
    const TOKEN = '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';
    const API_BASE = 'https://models.github.ai';

    const [messages, setMessages] = useState([{
        role: 'system',
        content: 'You are HAPPYY TALK AI - expert in multilingual communication, startup growth, digital marketing strategies, and code. Respond conversationally with actionable insights.'
    }]);
    const [displayMessages, setDisplayMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('openai/gpt-4.1');
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState('');

    const chatContainerRef = useRef(null);

    useEffect(() => {
        createStars();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [displayMessages, currentResponse]);

    const createStars = () => {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;
        starsContainer.innerHTML = '';
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = star.style.height = (Math.random() * 2.5 + 0.8) + 'px';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            star.style.animationDelay = Math.random() * 4 + 's';
            starsContainer.appendChild(star);
        }
    };

    const sendMessage = async () => {
        const content = userInput.trim();
        if (!content || isLoading) return;

        setDisplayMessages(prev => [...prev, { role: 'user', content }]);
        setUserInput('');
        setIsLoading(true);
        setCurrentResponse('');

        const apiMessages = [...messages, { role: 'user', content }];
        setMessages(apiMessages);

        try {
            const response = await fetch(`${API_BASE}/inference/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: apiMessages,
                    stream: true,
                    temperature: 0.72,
                    max_tokens: 4096
                })
            });

            if (!response.ok) throw new Error('Network error');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(data);
                            const token = parsed.choices?.[0]?.delta?.content;
                            if (token) {
                                fullText += token;
                                setCurrentResponse(fullText);
                            }
                        } catch {
                            // Ignore JSON parse errors for malformed chunks
                        }
                    }
                }
            }

            setDisplayMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
            setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
            setCurrentResponse('');
        } catch (error) {
            setDisplayMessages(prev => [...prev, { role: 'assistant', content: '🤖 AI Network error. Check token permissions.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif",
            height: "100vh",
            overflow: "hidden",
            background: "#000000",
            color: "#e2e8f0",
            display: "flex",
            flexDirection: "column",
            position: "relative"
        }}>
            <style>{`
                .star { 
                    position: absolute; background: radial-gradient(circle, #ffffff 0%, transparent 70%); 
                    border-radius: 50%; animation: twinkle 3s infinite ease-in-out;
                    box-shadow: 0 0 8px rgba(255,255,255,0.6);
                }
                @keyframes twinkle { 
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.3); }
                }
                #chat-container::-webkit-scrollbar { display: none; }
                @keyframes slideGlow {
                    from { opacity: 0; transform: translateY(30px); filter: blur(8px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .message { 
                    margin-bottom: 24px; padding: 20px 24px; border-radius: 28px; 
                    max-width: 90%; word-wrap: break-word; backdrop-filter: blur(20px);
                    animation: slideGlow 0.5s ease-out;
                    position: relative; overflow: hidden;
                }
                .user { 
                    background: rgba(59,130,246,0.15); 
                    border: 1px solid rgba(59,130,246,0.4);
                    color: #ffffff; margin-left: auto;
                    box-shadow: 0 0 20px rgba(59,130,246,0.3);
                }
                .bot { 
                    background: rgba(16,185,129,0.08); 
                    border: 1px solid rgba(0,255,255,0.3);
                    color: #e2e8f0; 
                    box-shadow: 0 0 25px rgba(0,255,255,0.2);
                }
                .bot-label {
                    color: #00ffff; font-size: 0.9em; font-weight: 800;
                    margin-bottom: 12px; text-shadow: 0 0 10px #00ffff;
                    letter-spacing: 1px;
                }
                @media (max-width: 768px) { 
                    .input-container { flex-direction: column !important; padding: 16px !important; gap: 12px !important; }
                    .user-input { min-width: 100% !important; border-radius: 20px !important; }
                    .model-select { width: 100% !important; order: 3; border-radius: 20px !important; }
                    .send-btn { width: 100% !important; border-radius: 20px !important; padding: 16px !important; }
                    .header h1 { font-size: 1.8em !important; }
                }
            `}</style>

            <div id="stars" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}></div>

            <div className="header" style={{ padding: "20px 32px", textAlign: "center", zIndex: 3, background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(0,255,255,0.1)", backdropFilter: "blur(20px)" }}>
                <h1 style={{ fontSize: "2.5em", margin: 0, background: "linear-gradient(45deg, #00ffff, #00d4ff, #58a6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 900, letterSpacing: "-1px", textShadow: "0 0 30px rgba(0,255,255,0.5)" }}>
                    HAPPYY TALK AI
                </h1>
            </div>

            <div id="chat-container" ref={chatContainerRef} style={{ flex: 1, overflowY: "auto", padding: "32px 24px", margin: "0 12px", zIndex: 2, position: "relative", scrollbarWidth: "none" }}>
                {displayMessages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                        {msg.role === 'assistant' && <div className="bot-label">🤖 AI</div>}
                        {msg.content}
                    </div>
                ))}
                {currentResponse && (
                    <div className="message bot">
                        <div className="bot-label">🤖 AI</div>
                        {currentResponse}
                    </div>
                )}
            </div>

            <div className="input-container" style={{ padding: "24px", display: "flex", gap: "16px", alignItems: "center", background: "rgba(0,0,0,0.95)", borderTop: "1px solid rgba(0,255,255,0.15)", zIndex: 3 }}>
                <input
                    type="text"
                    className="user-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Launch your query into the void..."
                    style={{ flex: 1, padding: "18px 24px", border: "1.5px solid rgba(0,255,255,0.4)", borderRadius: "36px", outline: "none", fontSize: "16px", background: "rgba(0,0,0,0.8)", color: "#e2e8f0", backdropFilter: "blur(25px)", minWidth: "300px", transition: "all 0.3s" }}
                />
                <select
                    className="model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{ padding: "14px 18px", border: "1px solid rgba(88,166,255,0.4)", borderRadius: "28px", background: "rgba(0,0,0,0.7)", color: "#e2e8f0", fontSize: "14px", outline: "none" }}
                >
                    <option value="openai/gpt-4.1">GPT-4.1</option>
                    <option value="meta-llama/llama-3.2-11b-vision-instruct">Llama Vision</option>
                    <option value="microsoft/phi-3.5-mini-instruct">Phi-3.5</option>
                    <option value="google/gemini-2.0-flash-thinking-exp">Gemini Flash</option>
                    <option value="deepseek/deepseek-r1">DeepSeek R1</option>
                </select>
                <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={isLoading || !userInput.trim()}
                    style={{ padding: "18px 32px", background: "linear-gradient(135deg, #00ffff44, #58a6ff44)", color: "#ffffff", border: "1.5px solid rgba(0,255,255,0.6)", borderRadius: "36px", cursor: "pointer", fontWeight: 800, fontSize: "16px", transition: "all 0.3s" }}
                >
                    {isLoading ? '...' : 'Sent'}
                </button>
            </div>
        </div>
    );
};

export default AIGitHubChat;
