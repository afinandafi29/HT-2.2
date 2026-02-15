import React, { useState, useRef, useEffect } from 'react';
import { fetchAIReply } from '../api/aiApi';
import './AIChatBox.css';

const AIChatBox = ({ isOpen, onClose, language = 'en' }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const languageConfig = {
    en: {
      title: 'AI Learning Assistant',
      placeholder: 'Ask me anything about the quiz...',
      sendButton: 'Send',
      thinking: 'Thinking...',
      welcome: 'Hello! I\'m your AI learning assistant. I can help you with vocabulary, grammar, cultural context, or any questions about the quiz. How can I help you today?'
    },
    es: {
      title: 'Asistente de Aprendizaje IA',
      placeholder: 'Pregúntame cualquier cosa sobre el quiz...',
      sendButton: 'Enviar',
      thinking: 'Pensando...',
      welcome: '¡Hola! Soy tu asistente de aprendizaje con IA. Puedo ayudarte con vocabulario, gramática, contexto cultural o cualquier pregunta sobre el quiz. ¿Cómo puedo ayudarte hoy?'
    },
    fr: {
      title: 'Assistant d\'Apprentissage IA',
      placeholder: 'Demandez-moi n\'importe quoi sur le quiz...',
      sendButton: 'Envoyer',
      thinking: 'Réflexion...',
      welcome: 'Bonjour ! Je suis votre assistant d\'apprentissage IA. Je peux vous aider avec le vocabulaire, la grammaire, le contexte culturel ou toute question sur le quiz. Comment puis-je vous aider aujourd\'hui ?'
    },
    ja: {
      title: 'AI学習アシスタント',
      placeholder: 'クイズについて何でも聞いてください...',
      sendButton: '送信',
      thinking: '考えています...',
      welcome: 'こんにちは！私はAI学習アシスタントです。語彙、文法、文化的背景、クイズに関する質問など、何でもお手伝いできます。今日はどのようにお手伝いしましょうか？'
    },
    de: {
      title: 'KI-Lernassistent',
      placeholder: 'Fragen Sie mich alles über das Quiz...',
      sendButton: 'Senden',
      thinking: 'Denke nach...',
      welcome: 'Hallo! Ich bin Ihr KI-Lernassistent. Ich kann Ihnen mit Vokabular, Grammatik, kulturellem Kontext oder Fragen zum Quiz helfen. Wie kann ich Ihnen heute helfen?'
    },
    ko: {
      title: 'AI 학습 도우미',
      placeholder: '퀴즈에 대해 무엇이든 물어보세요...',
      sendButton: '전송',
      thinking: '생각 중...',
      welcome: '안녕하세요! 저는 AI 학습 도우미입니다. 어휘, 문법, 문화적 맥락, 퀴즈에 대한 질문 등 어떤 것이든 도와드릴 수 있습니다. 오늘 어떻게 도와드릴까요?'
    },
    it: {
      title: 'Assistente di Apprendimento IA',
      placeholder: 'Chiedimi qualsiasi cosa sul quiz...',
      sendButton: 'Invia',
      thinking: 'Pensando...',
      welcome: 'Ciao! Sono il tuo assistente di apprendimento IA. Posso aiutarti con vocabolario, grammatica, contesto culturale o qualsiasi domanda sul quiz. Come posso aiutarti oggi?'
    },
    zh: {
      title: 'AI学习助手',
      placeholder: '问我任何关于测验的问题...',
      sendButton: '发送',
      thinking: '思考中...',
      welcome: '你好！我是你的AI学习助手。我可以帮助你解决词汇、语法、文化背景或任何关于测验的问题。今天我能如何帮助你？'
    },
    hi: {
      title: 'AI लर्निंग सहायक',
      placeholder: 'मुझसे क्विज़ के बारे में कुछ भी पूछें...',
      sendButton: 'भेजें',
      thinking: 'सोच रहा हूँ...',
      welcome: 'नमस्ते! मैं आपका AI लर्निंग सहायक हूँ। मैं आपको शब्दावली, व्याकरण, सांस्कृतिक संदर्भ या क्विज़ के बारे में किसी भी प्रश्न में मदद कर सकता हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?'
    },
    ru: {
      title: 'AI Помощник по обучению',
      placeholder: 'Спросите меня что-нибудь о квизе...',
      sendButton: 'Отправить',
      thinking: 'Думаю...',
      welcome: 'Привет! Я ваш AI помощник по обучению. Я могу помочь вам с лексикой, грамматикой, культурным контекстом или любыми вопросами о квизе. Как я могу помочь вам сегодня?'
    },
    pt: {
      title: 'Assistente de Aprendizagem IA',
      placeholder: 'Pergunte-me qualquer coisa sobre o quiz...',
      sendButton: 'Enviar',
      thinking: 'Pensando...',
      welcome: 'Olá! Sou seu assistente de aprendizagem IA. Posso ajudar com vocabulário, gramática, contexto cultural ou qualquer pergunta sobre o quiz. Como posso ajudar hoje?'
    },
    tr: {
      title: 'AI Öğrenme Asistanı',
      placeholder: 'Quiz hakkında herhangi bir şey sorun...',
      sendButton: 'Gönder',
      thinking: 'Düşünüyorum...',
      welcome: 'Merhaba! Ben AI öğrenme asistanınızım. Kelime bilgisi, dilbilgisi, kültürel bağlam veya quiz hakkındaki herhangi bir soruda size yardımcı olabilirim. Bugün size nasıl yardımcı olabilirim?'
    },
    nl: {
      title: 'AI Leerassistent',
      placeholder: 'Vraag me iets over de quiz...',
      sendButton: 'Versturen',
      thinking: 'Aan het denken...',
      welcome: 'Hallo! Ik ben uw AI leerassistent. Ik kan u helpen met woordenschat, grammatica, culturele context of vragen over de quiz. Hoe kan ik u vandaag helpen?'
    },
    el: {
      title: 'AI Βοηθός Μάθησης',
      placeholder: 'Ρωτήστε με οτιδήποτε για το κουίζ...',
      sendButton: 'Αποστολή',
      thinking: 'Σκέφτομαι...',
      welcome: 'Γεια σας! Είμαι ο AI βοηθός μάθησής σας. Μπορώ να σας βοηθήσω με λεξιλόγιο, γραμματική, πολιτιστικό πλαίσιο ή οποιαδήποτε ερώτηση για το κουίζ. Πώς μπορώ να σας βοηθήσω σήμερα;'
    },
    vi: {
      title: 'AI Trợ lý Học tập',
      placeholder: 'Hỏi tôi bất cứ điều gì về bài kiểm tra...',
      sendButton: 'Gửi',
      thinking: 'Đang suy nghĩ...',
      welcome: 'Xin chào! Tôi là trợ lý học tập AI của bạn. Tôi có thể giúp bạn về từ vựng, ngữ pháp, bối cảnh văn hóa hoặc bất kỳ câu hỏi nào về bài kiểm tra. Tôi có thể giúp gì cho bạn hôm nay?'
    },
    pl: {
      title: 'AI Asystent Nauki',
      placeholder: 'Zapytaj mnie o cokolwiek o quizie...',
      sendButton: 'Wyślij',
      thinking: 'Myślę...',
      welcome: 'Cześć! Jestem twoim asystentem nauki AI. Mogę pomóc ci z słownictwem, gramatyką, kontekstem kulturowym lub jakimikolwiek pytaniami o quiz. Jak mogę ci pomóc dzisiaj?'
    },
    sv: {
      title: 'AI Inlärningsassistent',
      placeholder: 'Fråga mig vad som helst om quizet...',
      sendButton: 'Skicka',
      thinking: 'Tänker...',
      welcome: 'Hej! Jag är din AI inlärningsassistent. Jag kan hjälpa dig med ordförråd, grammatik, kulturellt sammanhang eller frågor om quizet. Hur kan jag hjälpa dig idag?'
    },
    id: {
      title: 'AI Asisten Pembelajaran',
      placeholder: 'Tanyakan apa saja tentang kuis...',
      sendButton: 'Kirim',
      thinking: 'Berpikir...',
      welcome: 'Halo! Saya adalah asisten pembelajaran AI Anda. Saya dapat membantu Anda dengan kosakata, tata bahasa, konteks budaya, atau pertanyaan apa pun tentang kuis. Bagaimana saya dapat membantu Anda hari ini?'
    }
  };

  const config = languageConfig[language] || languageConfig.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: config.welcome,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, config.welcome]);

  const callAI = async (prompt) => {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are a helpful AI language learning assistant. Provide clear, concise answers in the same language as the user's question. Help with vocabulary, grammar, pronunciation, and cultural context related to language learning.`
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      return await fetchAIReply(messages);
    } catch (error) {
      console.error('AI Error:', error);
      return 'I apologize, but I encountered an error processing your request. Please check your API key or try again later.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callAI(inputValue);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <h3>{config.title}</h3>
          <button className="ai-chat-close" onClick={onClose}>×</button>
        </div>
        <div className="ai-chat-language-switch">
          <button
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => {/* TODO: Implement language switching */ }}
          >
            EN
          </button>
          <button
            className={`lang-btn ${language === language ? 'active' : ''}`}
            onClick={() => {/* TODO: Implement language switching */ }}
          >
            {language.toUpperCase()}
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`ai-chat-message ${message.sender === 'user' ? 'user' : 'ai'}`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-chat-message ai">
              <div className="message-content thinking">
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                {config.thinking}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={config.placeholder}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            {config.sendButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
