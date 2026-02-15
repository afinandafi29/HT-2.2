import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Cpu } from 'lucide-react';
import { fetchAIReply } from '../../api/aiApi';

const ChatGPTScreen = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const apiMessages = [
                { role: 'system', content: 'You are ChatGPT, a helpful and friendly AI assistant.' },
                ...history,
                userMessage
            ];

            const responseText = await fetchAIReply(apiMessages);

            const aiMessage = {
                role: 'assistant',
                content: responseText,
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please check your API key or try again later.',
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: 'Chat cleared. How else can I help?' }]);
    };

    return (
        <div className="w-full h-full bg-[#050505] text-white flex flex-col animate-fadeIn relative">
            {/* Header */}
            <div className="p-4 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                        <Cpu size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tighter uppercase leading-none">ChatGPT</h2>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">GPT-3.5 Turbo</span>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-red-400"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none pb-32">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                    >
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
                                }`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : msg.isError
                                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    : 'bg-zinc-800 text-gray-100 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none">
                                <Loader2 className="animate-spin text-emerald-400" size={16} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pb-6">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-2xl p-1.5 focus-within:border-emerald-500/50 transition-all shadow-2xl"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 placeholder:text-zinc-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-90"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatGPTScreen;
