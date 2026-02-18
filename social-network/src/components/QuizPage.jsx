import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AIChatBox from './AIChatBox';

const QuizPage = ({ language, languageCode, pageTitle, subtitle, rawData, speechLocale, primaryColor, primaryHover, resultTitle, resultMessage, retryLabel, levelLabels }) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState('Basic');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const answeredRef = useRef(false);

  // Default values for optional props
  const pColor = primaryColor || '#3b82f6';
  const pHover = primaryHover || '#2563eb';

  const questions = useMemo(() => {
    if (!rawData) return [];

    // Check if rawData is already an object/array (if we move to JSON later) or string
    let parsed = [];
    if (typeof rawData === 'string') {
      parsed = rawData
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
    }

    // Filter by level (Basic = Beginner + Intermediate, Advanced = Advanced + Expert)
    const filtered = parsed.filter((q) => {
      // Simple mapping strategy: check against known keys in labels or direct string
      const level = q.l;
      const isBasic = level === 'Beginner' || level === 'Intermediate' ||
        level === 'Principiante' || level === 'Intermedio' ||
        level === 'Débutant' || level === 'Intermédiaire' ||
        level === 'Anfänger' || level === 'Fortgeschritten' ||
        level === 'Basic';

      if (levelFilter === 'Basic') {
        return isBasic;
      } else {
        return !isBasic;
      }
    });

    return filtered.sort(() => Math.random() - 0.5);
  }, [rawData, levelFilter]);

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
      utterance.pitch = 1.1;
      utterance.lang = speechLocale || 'en-US';
      window.speechSynthesis.speak(utterance);
    },
    [isMuted, speechLocale],
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
    if (questions.length > 0) {
      loadQuestion(0);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [questions, loadQuestion]);

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

  const handleLevelChange = (level) => {
    setLevelFilter(level);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    answeredRef.current = false;
    setSelected(null);
  };

  const q = questions[currentQuestion];
  const correct = q?.a;
  const canGoNext = answeredRef.current;

  // Use inline styles for simplicity since we want one file if possible, or we could keep using CSS modules?
  // Re-using the style injection approach from the original files to minimize friction
  const styles = `
    .quiz-page {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      transition: all 0.3s ease;
      padding: 20px;
    }
    
    .quiz-page.light-mode { background-color: #fafafa; color: #333; }
    .quiz-page.dark-mode { background-color: #1a1a1a; color: #fff; }

    .quiz-container {
      max-width: 800px;
      margin: 0 auto;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      position: relative;
    }
   
    .quiz-page.light-mode .quiz-container { background: #ffffff; border: 2px solid ${pColor}; }
    .quiz-page.dark-mode .quiz-container { background: #0d0d0d; border: 2px solid ${pColor}; }

    h1 { color: ${pColor}; text-align: center; margin-bottom: 20px; }

    .option-item {
        padding: 15px; margin: 10px 0; border-radius: 12px;
        border: 2px solid ${pColor}; cursor: pointer; transition: all 0.2s;
    }
    .option-item:hover { transform: translateY(-2px); }
    .quiz-page.light-mode .option-item:hover { background: #f0f9ff; }
    .quiz-page.dark-mode .option-item:hover { background: #333; }

    .option-item.correct { background-color: ${pColor} !important; color: white !important; }
    .option-item.wrong { background-color: #ffebee !important; border-color: #ef5350 !important; color: #c62828 !important; }

    .quiz-btn {
        background: ${pColor}; color: white; border: none; padding: 12px 24px;
        border-radius: 25px; cursor: pointer; font-weight: bold; transition: background 0.2s;
    }
    .quiz-btn:hover:not(:disabled) { background: ${pHover}; }
    .quiz-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .top-bar { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
  `;

  if (showResults) {
    return (
      <div className={`quiz-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <style>{styles}</style>
        <div className="quiz-container" style={{ textAlign: 'center' }}>
          <h1>{resultTitle || "Quiz Complete!"}</h1>
          <p>{resultMessage || "Great job!"}</p>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: pColor, margin: '20px 0' }}>
            {score}/{questions.length}
          </div>

          <button className="quiz-btn" onClick={restart}>
            {retryLabel || "Try Again"}
          </button>
          <button className="quiz-btn" onClick={() => navigate('/learning-languages')} style={{ marginLeft: '10px', background: '#666' }}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <style>{styles}</style>

      <div className="top-bar">
        <button className="quiz-btn" onClick={() => navigate('/learning-languages')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>← Back</button>

        <div>
          <button
            className="quiz-btn"
            style={{ borderRadius: '20px 0 0 20px', background: levelFilter === 'Basic' ? pHover : pColor, opacity: levelFilter === 'Basic' ? 1 : 0.7 }}
            onClick={() => handleLevelChange('Basic')}
          >
            Basic
          </button>
          <button
            className="quiz-btn"
            style={{ borderRadius: '0 20px 20px 0', background: levelFilter === 'Advanced' ? pHover : pColor, opacity: levelFilter === 'Advanced' ? 1 : 0.7 }}
            onClick={() => handleLevelChange('Advanced')}
          >
            Advanced
          </button>
        </div>

        <button className="quiz-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="quiz-container">
        <h1>{pageTitle}</h1>
        <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '30px' }}>{subtitle}</p>

        {questions.length > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: pColor }}>{q?.l}</span>
              <span style={{ fontWeight: 'bold' }}>{currentQuestion + 1}/{questions.length}</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{q?.q}</h2>

            <div>
              {options.map((opt, idx) => {
                const isCorrect = answeredRef.current && opt === correct;
                const isWrong = answeredRef.current && selected === opt && opt !== correct;
                const cls = `option-item${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`;
                return (
                  <div key={idx} className={cls} onClick={() => handleSelect(opt)}>
                    {opt}
                  </div>
                );
              })}
            </div>

            <button
              className="quiz-btn"
              id="nextBtn"
              disabled={!canGoNext}
              onClick={next}
              style={{ width: '100%', marginTop: '30px' }}
            >
              Next Question →
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading questions...</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsAIChatOpen(true)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${pColor} 0%, ${pHover} 100%)`, color: 'white', border: 'none',
          cursor: 'pointer', fontSize: '24px', boxShadow: `0 4px 20px rgba(0,0,0,0.3)`, zIndex: 1000,
        }}
      >
        🤖
      </button>
      <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language={language || "en"} />
    </div>
  );
};

export default QuizPage;
