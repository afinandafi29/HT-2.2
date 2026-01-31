import React, { useState, useEffect, useRef } from 'react';
import './AIChat.css';
import { Send, CornerDownLeft, Zap } from 'lucide-react';

const AIChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initial welcome message from the AI
        setMessages([
            {
                role: 'assistant',
                content: "Hello! I'm your AI assistant. Ask me anything!"
            }
        ]);
    }, []);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Here we will call the OpenRouter API
        // For now, let's simulate a response
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "This is a simulated response." }]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ai-chat-container">
            <div className="ai-chat-header">
                <Zap className="h-6 w-6 text-yellow-400" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
            <div className="ai-chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="message assistant">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="ai-chat-input-area">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="ai-chat-input"
                    rows="1"
                />
                <button onClick={handleSend} className="ai-chat-send-button" disabled={isLoading}>
                    {isLoading ? <CornerDownLeft className="h-5 w-5 animate-ping" /> : <Send className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

export default AIChat;
