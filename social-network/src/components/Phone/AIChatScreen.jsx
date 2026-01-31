import React, { useState, useRef, useEffect } from 'react';

const AIChatScreen = () => {
    const API_BASE = 'https://models.github.ai';
    const DEFAULT_MODEL = 'openai/gpt-4.1';
    const TOKEN = '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';

    const [messages, setMessages] = useState([{
        role: 'system',
        content: 'You are HAPPYY TALK AI - expert in multilingual communication, startup growth, digital marketing strategies, and code. Respond conversationally with actionable insights.'
    }]);
    const [displayMessages, setDisplayMessages] = useState([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [userInput, setUserInput] = useState('');
    const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
    const [isLoading, setIsLoading] = useState(false);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [displayMessages, currentResponse]);

    const sendMessage = async () => {
        const content = userInput.trim();
        if (!content || isLoading) return;

        const newUserMessage = { role: 'user', content };
        setDisplayMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setCurrentResponse('');

        const newMessages = [...messages, { role: 'user', content }];
        setMessages(newMessages);

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
                    messages: newMessages,
                    stream: true,
                    temperature: 0.72,
                    max_tokens: 4096
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err.slice(0, 150));
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

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
                            const tokenText = parsed.choices?.[0]?.delta?.content;
                            if (tokenText) {
                                assistantMessage += tokenText;
                                setCurrentResponse(assistantMessage);
                            }
                        } catch (e) {
                            // Ignore parsing errors
                        }
                    }
                }
            }

            setDisplayMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
            setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
            setCurrentResponse('');
        } catch (error) {
            const errorMsg = `🤖 Network error. Check token permissions.`;
            setDisplayMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
            setCurrentResponse('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: '#000000',
            color: '#e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(0,0,0,0.95)',
                padding: '12px',
                borderBottom: '1px solid rgba(0,255,255,0.2)',
                backdropFilter: 'blur(20px)'
            }}>
                <h2 style={{
                    fontSize: '1.3em',
                    fontWeight: 900,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #00ffff, #00d4ff, #58a6ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.5px'
                }}>
                    🤖 HAPPYY TALK AI
                </h2>
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(0,0,0,0.7)',
                        border: '1px solid rgba(88,166,255,0.4)',
                        borderRadius: '20px',
                        color: '#e2e8f0',
                        fontSize: '13px',
                        fontWeight: 500,
                        outline: 'none'
                    }}
                >
                    <option value="openai/gpt-4.1">GPT-4.1</option>
                    <option value="meta-llama/llama-3.2-11b-vision-instruct">Llama Vision</option>
                    <option value="microsoft/phi-3.5-mini-instruct">Phi-3.5</option>
                    <option value="google/gemini-2.0-flash-thinking-exp">Gemini Flash</option>
                    <option value="deepseek/deepseek-r1">DeepSeek R1</option>
                </select>
            </div>

            {/* Input Area - MOVED TO TOP FOR MOBILE */}
            <div style={{
                background: 'rgba(0,0,0,0.95)',
                padding: '12px',
                borderBottom: '1px solid rgba(0,255,255,0.2)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 4
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            background: 'rgba(0,0,0,0.8)',
                            border: '1.5px solid rgba(0,255,255,0.4)',
                            borderRadius: '24px',
                            color: '#e2e8f0',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.3s',
                            boxShadow: '0 0 15px rgba(0,255,255,0.1)'
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !userInput.trim()}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, rgba(0,255,255,0.27), rgba(88,166,255,0.27))',
                            color: '#ffffff',
                            border: '1.5px solid rgba(0,255,255,0.6)',
                            borderRadius: '24px',
                            cursor: isLoading || !userInput.trim() ? 'not-allowed' : 'pointer',
                            fontWeight: 800,
                            fontSize: '14px',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 16px rgba(0,255,255,0.3)',
                            opacity: (isLoading || !userInput.trim()) ? 0.5 : 1,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {isLoading ? '...' : 'Sent'}
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div
                ref={chatContainerRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}
            >
                {displayMessages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <div style={{
                            maxWidth: '85%',
                            padding: '12px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            backdropFilter: 'blur(20px)',
                            ...(msg.role === 'user' ? {
                                background: 'rgba(59,130,246,0.15)',
                                border: '1px solid rgba(59,130,246,0.4)',
                                color: '#ffffff',
                                boxShadow: '0 0 15px rgba(59,130,246,0.3)'
                            } : {
                                background: 'rgba(16,185,129,0.08)',
                                border: '1px solid rgba(0,255,255,0.3)',
                                color: '#e2e8f0',
                                boxShadow: '0 0 20px rgba(0,255,255,0.2)'
                            })
                        }}>
                            {msg.role === 'assistant' && (
                                <div style={{
                                    fontSize: '0.85em',
                                    color: '#00ffff',
                                    fontWeight: 800,
                                    marginBottom: '8px',
                                    textShadow: '0 0 8px #00ffff',
                                    letterSpacing: '0.5px'
                                }}>
                                    🤖 AI
                                </div>
                            )}
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}

                {currentResponse && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            maxWidth: '85%',
                            padding: '12px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(0,255,255,0.3)',
                            color: '#e2e8f0',
                            boxShadow: '0 0 20px rgba(0,255,255,0.2)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            <div style={{
                                fontSize: '0.85em',
                                color: '#00ffff',
                                fontWeight: 800,
                                marginBottom: '8px',
                                textShadow: '0 0 8px #00ffff',
                                letterSpacing: '0.5px'
                            }}>
                                🤖 AI
                            </div>
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {currentResponse}
                            </p>
                        </div>
                    </div>
                )}

                {isLoading && !currentResponse && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '20px',
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(0,255,255,0.3)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#00ffff',
                                    borderRadius: '50%',
                                    animation: 'bounce 1.4s infinite ease-in-out both',
                                    animationDelay: '0s'
                                }}></span>
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#00ffff',
                                    borderRadius: '50%',
                                    animation: 'bounce 1.4s infinite ease-in-out both',
                                    animationDelay: '0.16s'
                                }}></span>
                                <span style={{
                                    width: '6px',
                                    height: '6px',
                                    background: '#00ffff',
                                    borderRadius: '50%',
                                    animation: 'bounce 1.4s infinite ease-in-out both',
                                    animationDelay: '0.32s'
                                }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AIChatScreen;
