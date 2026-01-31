import React, { useRef, useState, useEffect } from 'react';

const OmegleText = ({ partnerId, onEnd, onNext }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now(),
        text: input,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // Simulate partner response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: '👋 Hey there!',
          sender: 'partner',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 500 + Math.random() * 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="omegle-text-chat">
      <div className="text-chat-container">
        <div className="chat-header">
          <h2>Text Chat</h2>
          <p className="partner-status">Partner connected 💬</p>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>👋 Say hi to your new friend!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}
              >
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            className="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="3"
          />
          <button className="send-button" onClick={handleSendMessage}>
            Send
          </button>
        </div>

        <div className="text-controls">
          <button 
            className="control-btn next-btn"
            onClick={onNext}
          >
            ➡️ Next
          </button>

          <button 
            className="control-btn end-btn"
            onClick={onEnd}
          >
            ❌ End
          </button>
        </div>
      </div>
    </div>
  );
};

export default OmegleText;
