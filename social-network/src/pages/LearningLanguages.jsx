import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LearningLanguages = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState('light');
  const [mode, setMode] = useState('Advanced');
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('learningLanguagesTheme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('learningLanguagesTheme', theme);
  }, [theme]);

  const langs = useMemo(
    () => [
      { name: 'English', img: 'gb' },
      { name: 'Spanish', img: 'es' },
      { name: 'French', img: 'fr' },
      { name: 'Japanese', img: 'jp' },
      { name: 'German', img: 'de' },
      { name: 'Korean', img: 'kr' },
      { name: 'Italian', img: 'it' },
      { name: 'Chinese', img: 'cn' },
      { name: 'Hindi', img: 'in' },
      { name: 'Russian', img: 'ru' },
      { name: 'Arabic', img: 'sa' },
      { name: 'Portuguese', img: 'pt' },
      { name: 'Turkish', img: 'tr' },
      { name: 'Dutch', img: 'nl' },
      { name: 'Greek', img: 'gr' },
      { name: 'Vietnamese', img: 'vn' },
      { name: 'Polish', img: 'pl' },
      { name: 'Swedish', img: 'se' },
      { name: 'Latin', img: 'va' },
      { name: 'Indonesian', img: 'id' },
    ],
    [],
  );

  const handleLanguageClick = (name) => {
    const routeMap = {
      'English': '/english-quiz',
      'Spanish': '/spanish-quiz',
      'French': '/french-quiz',
      'Japanese': '/japanese-quiz',
      'German': '/german-quiz',
      'Korean': '/korean-quiz',
      'Italian': '/italian-quiz',
      'Chinese': '/chinese-quiz',
      'Hindi': '/hindi-quiz',
      'Russian': '/russian-quiz',
      'Portuguese': '/portuguese-quiz',
      'Turkish': '/turkish-quiz',
      'Dutch': '/dutch-quiz',
      'Greek': '/greek-quiz',
      'Vietnamese': '/vietnamese-quiz',
      'Polish': '/polish-quiz',
      'Swedish': '/swedish-quiz',
      'Latin': '/latin-quiz',
      'Indonesian': '/indonesian-quiz'
    };

    // If Basic mode, go to basic learning page
    if (mode === 'Basic') {
      navigate(`/basic-learning?lang=${name}`);
      return;
    }

    // If Advanced mode, go to quiz page
    if (routeMap[name]) {
      navigate(routeMap[name]);
      return;
    }

    alert(`${name} course coming soon!`);
  };

  return (
    <div className={`learning-languages-page ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <style>{`
        .learning-languages-page {
          --bg: #ffffff;
          --text: #3c3c3c;
          --muted: #1f2937;
          --card-bg: #f8f9fa;
          --card-border: #3b82f6;
          --card-border-hover: #2563eb;
          --card-hover-bg: rgba(59, 130, 246, 0.15);
          --flag-bg: #ffffff;
          --flag-border: #e5e7eb;
          --shadow: rgba(0, 0, 0, 0.1);

          font-family: "din-round", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--bg);
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 40px 0;
          color: var(--text);
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
        }

        .learning-languages-page.theme-dark {
          --bg: #0f1419;
          --text: #f1f5f9;
          --muted: #e0e7ff;
          --card-bg: rgba(30, 58, 138, 0.3);
          --card-border: #3b82f6;
          --card-border-hover: #60a5fa;
          --card-hover-bg: rgba(59, 130, 246, 0.2);
          --flag-bg: rgba(59, 130, 246, 0.1);
          --flag-border: rgba(59, 130, 246, 0.3);
          --shadow: rgba(0, 0, 0, 0.5);
        }

        .learning-languages-logo {
          color: #3b82f6;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 20px;
          text-transform: none;
          text-align: center;
        }

        .learning-languages-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 40px;
          color: var(--muted);
          text-align: center;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
          padding: 0 12px;
          box-sizing: border-box;
        }

        .glass-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .theme-toggle {
          background: var(--card-bg);
          color: inherit;
          border: 2px solid var(--card-border);
          border-bottom: 4px solid var(--card-border);
          padding: 10px 14px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: all 0.1s;
          user-select: none;
          box-shadow: 0 2px 4px var(--shadow);
        }

        .theme-toggle:hover {
          background-color: var(--card-hover-bg);
          border-color: var(--card-border-hover);
          box-shadow: 0 4px 8px var(--shadow);
        }

        .theme-toggle:active {
          background: var(--card-border);
          border-color: var(--card-border);
          color: white;
          transform: translateY(2px);
          border-bottom-width: 2px;
        }

        .mode-toggle {
          display: inline-flex;
          position: relative;
          background: var(--card-bg);
          border: 2px solid var(--card-border);
          border-radius: 30px;
          padding: 4px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .mode-toggle:hover {
          border-color: var(--card-border-hover);
          box-shadow: 0 4px 12px var(--shadow);
        }

        .mode-toggle-slider {
          position: absolute;
          top: 4px;
          height: calc(100% - 8px);
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .mode-btn {
          background: transparent;
          border: none;
          padding: 10px 20px;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          color: var(--text);
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          min-width: 80px;
        }

        .mode-btn.active {
          color: #fff !important;
        }

        .mode-btn:not(.active) {
          color: var(--text);
        }

        .back-button {
          background: #3b82f6;
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
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .back-button:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .learning-languages-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          width: 100%;
          padding: 0 12px;
          box-sizing: border-box;
        }

        .learning-languages-card {
          background: var(--card-bg);
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 24px 4px 24px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 2px 6px var(--shadow);
        }

        .learning-languages-card:hover {
          background-color: var(--card-hover-bg);
          border-color: var(--card-border-hover);
          transform: translateY(-4px);
          box-shadow: 0 6px 12px var(--shadow);
        }

        .learning-languages-card:active {
          transform: translateY(2px);
          box-shadow: 0 2px 4px var(--shadow);
        }

        .learning-languages-flag {
          width: 84px;
          height: 64px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px var(--shadow);
          border: 1px solid var(--flag-border);
          background: var(--flag-bg);
        }

        .learning-languages-name {
          font-weight: 700;
          font-size: 20px;
          text-transform: capitalize;
          text-align: center;
          margin-top: 8px;
          color: var(--text);
        }

        @media (max-width: 1024px) {
          .learning-languages-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 768px) {
          .learning-languages-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 500px) {
          .learning-languages-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .learning-languages-flag {
            width: 60px;
            height: 45px;
          }
        }
      `}</style>

      <div className="learning-languages-logo">HAPPYY TALK.in</div>
      <div className="top-nav">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            className="mode-toggle"
            role="tablist"
            aria-label="Learning mode"
            title="Toggle between Basic Learning and Advanced Quiz"
            style={{
              '--toggle-position': mode === 'Basic' ? '0%' : '50%'
            }}
          >
            <div
              className="mode-toggle-slider"
              style={{
                left: mode === 'Basic' ? '4px' : 'calc(50% + 4px)',
                width: 'calc(50% - 4px)'
              }}
            />
            <button
              type="button"
              className={`mode-btn ${mode === 'Basic' ? 'active' : ''}`}
              onClick={() => setMode('Basic')}
            >
              Basic
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'Advanced' ? 'active' : ''}`}
              onClick={() => setMode('Advanced')}
            >
              Advanced
            </button>
          </div>
        </div>
        <div className="glass-controls">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
      <h1 className="learning-languages-title">I want to learn...</h1>

      <div className="learning-languages-grid">
        {langs.map((l) => {
          const flagSrc = l.custom || `https://flagcdn.com/h80/${l.img}.png`;
          return (
            <button
              key={l.name}
              type="button"
              className="learning-languages-card"
              onClick={() => handleLanguageClick(l.name)}
            >
              <img className="learning-languages-flag" src={flagSrc} alt={l.name} />
              <div className="learning-languages-name">{l.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LearningLanguages;
