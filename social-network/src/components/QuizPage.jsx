import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from './AIChatBox';

const QuizPage = ({
  language,
  languageCode,
  pageTitle,
  subtitle,
  rawData,
  speechLocale,
  primaryColor,
  primaryHover,
  secondaryColor,
  isRtl = false,
  resultTitle,
  resultMessage,
  retryLabel,
  levelLabels,
}) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [options, setOptions] = useState([]);
  const answeredRef = useRef(false);

  const questions = useMemo(() => {
    const parsed = rawData
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|');
        const [l, q, a, ...rest] = parts;
        const wRaw = rest.join('|');
        const w = wRaw.split('||').filter(Boolean);
        return { l, q, a, w };
      });
    return parsed.sort(() => Math.random() - 0.5);
  }, [rawData]);

  const speak = useCallback(
    (text) => {
      if (isMuted) return;
      if (typeof window === 'undefined') return;
      if (!('speechSynthesis' in window)) return;
      const cleanText = String(text).replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        '',
      );
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.lang = speechLocale;
      window.speechSynthesis.speak(utterance);
    },
    [isMuted],
  );

  const shuffle = useCallback((arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  const loadQuestion = useCallback(
    (index) => {
      const q = questions[index];
      if (!q) return;
      answeredRef.current = false;
      setSelected(null);
      setOptions(shuffle([q.a, ...q.w]));
    },
    [questions, shuffle],
  );

  useEffect(() => {
    loadQuestion(0);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [loadQuestion]);

  const handleSelect = (choice) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setSelected(choice);
    speak(choice);
    const correct = questions[currentQuestion]?.a;
    if (choice === correct) setScore((s) => s + 1);
  };

  const next = () => {
    const nextIndex = currentQuestion + 1;
    if (nextIndex >= questions.length) {
      setShowResults(true);
      return;
    }
    setCurrentQuestion(nextIndex);
    loadQuestion(nextIndex);
  };

  const restart = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setScore(0);
    loadQuestion(0);
  };

  const q = questions[currentQuestion];
  const levelClass = String(q?.l || '').toLowerCase();
  const correct = q?.a;
  const canGoNext = answeredRef.current;

  const themeColors = {
    light: {
      bg: '#ffffff',
      text: '#2c3e50',
      muted: '#4b5563',
      cardBorder: '#e5e5e5',
      cardBorderHover: '#cecece',
      cardHoverBg: '#f7f7f7',
      flagBg: '#ffffff',
      flagBorder: '#f0f0f0',
      shadow: 'rgba(0, 0, 0, 0.05)',
    },
    dark: {
      bg: '#0f172a',
      text: '#e5e7eb',
      muted: '#cbd5e1',
      cardBorder: '#334155',
      cardBorderHover: '#475569',
      cardHoverBg: 'rgba(148, 163, 184, 0.12)',
      flagBg: 'rgba(255, 255, 255, 0.08)',
      flagBorder: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(0, 0, 0, 0.35)',
    },
  };

  const theme = isDarkMode ? themeColors.dark : themeColors.light;

  const voiceCss = `
    .quiz-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: ${theme.bg};
      margin: 0;
      padding: 20px;
      color: ${theme.text};
      min-height: 100vh;
    }

    .quiz-header {
      text-align: center;
      color: ${primaryColor};
      margin-bottom: 5px;
      font-weight: 800;
    }

    .quiz-subtitle {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 25px;
      font-size: 1rem;
    }

    .external-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      width: 100%;
      max-width: 1050px;
      gap: 15px;
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .control-group.right {
      margin-left: auto;
    }

    .back-button {
      background: ${primaryColor};
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .back-button:hover {
      background: ${primaryHover};
      transform: translateY(-2px);
    }

    .theme-buttons {
      display: flex;
      gap: 10px;
    }

    .theme-btn {
      background: transparent;
      color: ${theme.text};
      border: 2px solid ${theme.cardBorder};
      border-bottom: 4px solid ${theme.cardBorder};
      padding: 10px 14px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.1s;
      user-select: none;
    }

    .theme-btn:hover {
      background-color: ${primaryColor}20;
      border-color: ${primaryHover};
    }

    .theme-btn.active {
      background: ${primaryColor};
      color: white;
      border-color: ${primaryColor};
    }

    .mute-toolbar-btn {
      background: transparent;
      color: ${theme.text};
      border: 2px solid ${theme.cardBorder};
      border-bottom: 4px solid ${theme.cardBorder};
      padding: 10px 14px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.1s;
      user-select: none;
    }

    .mute-toolbar-btn:hover {
      background-color: ${primaryColor}20;
      border-color: ${primaryHover};
    }

    .mute-toolbar-btn.active {
      background: ${primaryColor};
      color: white;
      border-color: ${primaryColor};
    }

    .container {
      max-width: 650px;
      margin: 0 auto;
      background: ${theme.bg};
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0, 106, 167, 0.1);
      position: relative;
      border-top: 10px solid ${secondaryColor || primaryColor};
      direction: ${isRtl ? 'rtl' : 'ltr'};
      text-align: ${isRtl ? 'right' : 'left'};
    }

    .mute-btn {
      position: absolute;
      top: 25px;
      ${isRtl ? 'left: 25px;' : 'right: 25px;'}
      cursor: pointer;
      background: ${theme.bg};
      border: 2px solid ${primaryColor};
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      z-index: 10;
      transition: all 0.2s ease;
    }

    .mute-btn:hover {
      transform: scale(1.1);
      background: ${theme.cardHoverBg};
    }

    .question-box {
      background: ${theme.cardHoverBg};
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      border: 1px solid ${theme.cardBorder};
      text-align: ${isRtl ? 'right' : 'left'};
    }

    .level-badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
      background: #e0e0e0;
      color: #333;
    }

    /* Arabic levels - Updated to user requested theme */
    .مبتدئ { background: #E8F5E9; color: #2E7D32; }
    .متوسط { background: #FFF3E0; color: #E65100; }
    .خبير { background: #E1F5FE; color: #01579B; }

    /* Russian levels */
    .новичок { background: #ffeaa7; color: #d35400; }
    .любитель { background: #fab1a0; color: #c0392b; }
    .эксперт { background: #2d3436; color: #fff; }

    /* Portuguese levels */
    .iniciante { background: #ffeaa7; color: #d35400; }
    .intermediário { background: #fab1a0; color: #c0392b; }
    .mestre { background: #2d3436; color: #fff; }

    /* Turkish levels */
    .başlangıç { background: #ffeaa7; color: #d35400; }
    .orta { background: #fab1a0; color: #c0392b; }
    .uzman { background: #2d3436; color: #fff; }

    /* Indonesian levels */
    .pemula { background: #ffeaa7; color: #d35400; }
    .menengah { background: #fab1a0; color: #c0392b; }
    .ahli { background: #2d3436; color: #fff; }

    /* English levels */
    .beginner { background: #ffeaa7; color: #d35400; }
    .intermediate { background: #fab1a0; color: #c0392b; }
    .advanced { background: #2d3436; color: #fff; }
    .expert { background: #2d3436; color: #fff; }


    .qnum {
      color: ${primaryColor};
      font-weight: bold;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 8px;
    }

    .options {
      display: grid;
      gap: 12px;
    }

    .option {
      background: ${theme.bg};
      border: 2px solid ${theme.cardBorder};
      border-radius: 12px;
      padding: 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.1rem;
      text-align: ${isRtl ? 'right' : 'left'};
    }

    .option.correct {
      background: ${primaryColor} !important;
      color: white !important;
      border-color: ${primaryHover} !important;
    }

    .option.wrong {
      background: #e74c3c !important;
      color: white !important;
      border-color: #c0392b !important;
    }

    .next-btn {
      background: ${primaryColor};
      color: white;
      border: none;
      padding: 18px;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 12px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
    }

    .next-btn:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    .result-screen {
      text-align: center;
      padding: 40px 10px;
    }

    .result-title {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 20px;
      color: ${primaryColor};
    }

    .score-display {
      font-size: 4rem;
      font-weight: 900;
      color: ${primaryColor};
      margin: 20px 0;
    }

    .result-message {
      font-size: 1.2rem;
      margin-bottom: 30px;
    }

    .try-again {
      background: ${primaryColor};
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: bold;
    }

    @media (max-width: 500px) {
      .container {
        padding: 20px;
      }
      .options {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .option {
        padding: 16px;
        font-size: 1rem;
      }
    }
  `;

  if (showResults) {
    return (
      <div className="quiz-container">
        <style>{voiceCss}</style>
        <div className="external-controls">
          <button className="back-button" onClick={() => navigate('/learning-languages')}>
            ← Back
          </button>
          <div className="control-group right">
            <div className="theme-buttons">
              <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
                ☀️ Light
              </button>
              <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
        <div className="container">
          <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <div className="result-screen">
            <h2 className="result-title">{resultTitle}</h2>
            <div className="score-display">{score}/{questions.length}</div>
            <p className="result-message">{resultMessage}</p>
            <button type="button" onClick={restart} className="try-again">
              {retryLabel}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAIChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryHover} 100%)`,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            zIndex: 1000,
          }}
          aria-label="Open AI Chat"
        >
          🤖
        </button>
        <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language={languageCode} />
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <style>{voiceCss}</style>
      <div className="external-controls">
        <button className="back-button" onClick={() => navigate('/learning-languages')}>
          ← Back
        </button>
        <div className="control-group right">
          <div className="theme-buttons">
            <button className={`theme-btn ${!isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(false)}>
              ☀️ Light
            </button>
            <button className={`theme-btn ${isDarkMode ? 'active' : ''}`} onClick={() => setIsDarkMode(true)}>
              🌙 Dark
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="quiz-header">
          {pageTitle}
        </div>
        <div className="quiz-subtitle">{subtitle}</div>
        <div className="question-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={`level-badge ${levelClass}`}>{q?.l}</span>
            <span className="qnum">{isRtl ? 'سؤال' : 'Question'} {currentQuestion + 1} / {questions.length}</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', marginTop: '10px' }}>{q?.q}</h2>
          <div className="options" style={{ marginTop: '20px' }}>
            {options.map((opt) => {
              const isCorrect = answeredRef.current && opt === correct;
              const isWrong = answeredRef.current && selected === opt && opt !== correct;
              const cls = `option${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`;
              return (
                <div key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
        <button className="next-btn" type="button" disabled={!canGoNext} onClick={next}>
          {isRtl ? 'السؤال التالي ←' : 'Next →'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setIsAIChatOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryHover} 100%)`,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          zIndex: 1000,
        }}
        aria-label="Open AI Chat"
      >
        🤖
      </button>
      <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language={languageCode} />
    </div>
  );
};

export default QuizPage;
