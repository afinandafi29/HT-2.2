import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Globe,
  Zap,
  Trophy,
  ChevronRight,
  PlayCircle
} from 'lucide-react';

const Learning = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleGetStarted = () => {
    navigate('/learning-languages');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLanguageClick = (lang) => {
    if (lang === 'Spanish') {
      alert('Spanish course coming soon!');
    } else if (lang === 'French') {
      alert('French course coming soon!');
    } else if (lang === 'German') {
      alert('German course coming soon!');
    } else if (lang === 'Italian') {
      alert('Italian course coming soon!');
    } else if (lang === 'Portuguese') {
      alert('Portuguese course coming soon!');
    } else if (lang === 'Japanese') {
      alert('Japanese course coming soon!');
    }
  };

  return (
    <div style={{
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      margin: 0,
      backgroundColor: theme === 'light' ? '#ffffff' : '#131f24',
      color: theme === 'light' ? '#4b4b4b' : '#eeeeee',
      transition: '0.3s ease',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Header Navigation */}
      <header style={{
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10%',
        borderBottom: `2px solid ${theme === 'light' ? '#e5e5e5' : '#3c444d'}`
      }}>
        <button
          onClick={handleBackToHome}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#2563eb';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back
        </button>
        <a
          href="#"
          style={{
            color: '#3b82f6',
            fontSize: '28px',
            fontWeight: 800,
            textDecoration: 'none',
            textTransform: 'uppercase'
          }}
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          HAPPYY TALK.in
        </a>
        <button
          onClick={toggleTheme}
          style={{
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%',
            border: `2px solid ${theme === 'light' ? '#e5e5e5' : '#3c444d'}`,
            background: 'none',
            color: theme === 'light' ? '#4b4b4b' : '#eeeeee',
            fontSize: '18px',
            transition: '0.2s'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Hero Section */}
      <section style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10%'
      }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '42px',
            marginBottom: '40px',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '-1px'
          }}>
            START YOUR LANGUAGE JOURNEY TODAY WITH HAPPYY TALK!
          </h1>

          <button
            onClick={handleGetStarted}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '320px',
              padding: '18px 0',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '17px',
              cursor: 'pointer',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 auto',
              transition: 'transform 0.1s, filter 0.2s',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderBottom: '5px solid #2563eb'
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(3px)';
              e.target.style.borderBottomWidth = '2px';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderBottomWidth = '5px';
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Languages Bar */}
      <div style={{
        borderTop: `2px solid ${theme === 'light' ? '#e5e5e5' : '#3c444d'}`,
        padding: '30px 0',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: theme === 'light' ? '#ffffff' : '#131f24'
      }}>
        <div style={{
          display: 'flex',
          gap: '35px',
          fontWeight: 'bold',
          fontSize: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div
            onClick={() => handleLanguageClick('Spanish')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: '0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.color = '#1cb0f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.color = theme === 'light' ? '#4b4b4b' : '#eeeeee';
            }}
          >
            <img
              src="https://flagcdn.com/es.svg"
              alt="Spanish"
              style={{
                width: '28px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            Spanish
          </div>
          <div
            onClick={() => handleLanguageClick('French')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: '0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.color = '#1cb0f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.color = theme === 'light' ? '#4b4b4b' : '#eeeeee';
            }}
          >
            <img
              src="https://flagcdn.com/fr.svg"
              alt="French"
              style={{
                width: '28px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            French
          </div>
          <div
            onClick={() => handleLanguageClick('German')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: '0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.color = '#1cb0f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.color = theme === 'light' ? '#4b4b4b' : '#eeeeee';
            }}
          >
            <img
              src="https://flagcdn.com/de.svg"
              alt="German"
              style={{
                width: '28px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            German
          </div>
          <div
            onClick={() => handleLanguageClick('Italian')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: '0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.color = '#1cb0f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.color = theme === 'light' ? '#4b4b4b' : '#eeeeee';
            }}
          >
            <img
              src="https://flagcdn.com/it.svg"
              alt="Italian"
              style={{
                width: '28px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            Italian
          </div>
          <div
            onClick={() => handleLanguageClick('Portuguese')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: '0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.color = '#1cb0f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.color = theme === 'light' ? '#4b4b4b' : '#eeeeee';
            }}
          >
            <img
              src="https://flagcdn.com/pt.svg"
              alt="Portuguese"
              style={{
                width: '28px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            Portuguese
          </div>
          <div
            onClick={() => handleLanguageClick('Japanese')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: '0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.color = '#1cb0f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.color = theme === 'light' ? '#4b4b4b' : '#eeeeee';
            }}
          >
            <img
              src="https://flagcdn.com/jp.svg"
              alt="Japanese"
              style={{
                width: '28px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            Japanese
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
