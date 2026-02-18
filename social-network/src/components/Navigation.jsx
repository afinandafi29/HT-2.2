import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navigation = ({
  onExpandClick,
  onCreateRoomClick,
  activeCategory,
  setActiveCategory,
  isExpanded,
  onThemeClick,
  onChatClick,
  languages,
  onCategoryClick
}) => {
  const navigate = useNavigate();
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);

  const handleButtonClick = (category) => {
    setActiveCategory(category.toLowerCase());
  };

  return (
    <>
      <div className={`unified-navigation ${isExpanded ? 'expanded' : ''}`}>
        <div className="nav-main-row">
          <button
            className={`expand-toggle-btn ${isExpanded ? 'active' : ''}`}
            onClick={onExpandClick}
          >
            <i className="fas fa-chevron-down"></i>
          </button>

          <div className="nav-items-scroll">
            <button
              id="all-button"
              className={activeCategory === 'all' ? 'active' : ''}
              onClick={() => {
                handleButtonClick('all');
                navigate('/');
              }}
            >
              All
            </button>
            <button
              className={`desktop-only ${activeCategory === 'feed' ? 'active' : ''}`}
              onClick={() => {
                handleButtonClick('feed');
                navigate('/feed');
              }}
            >
              feed
            </button>
            <button
              className={activeCategory === 'news' ? 'active' : ''}
              onClick={() => {
                handleButtonClick('news');
                navigate('/news');
              }}
            >
              NEWS
            </button>
            <button
              className={activeCategory === 'youtube' ? 'active' : ''}
              onClick={() => {
                handleButtonClick('youtube');
                navigate('/youtube');
              }}
            >
              YOUTUBE
            </button>





            <button
              className={activeCategory === 'ai-chat' ? 'active' : ''}
              style={{ fontSize: '0.85rem' }}
              onClick={() => {
                handleButtonClick('ai-chat');
                navigate('/ai-chat');
              }}
            >
              AI
            </button>

            <button
              className={activeCategory === 'apps' ? 'active' : ''}
              onClick={() => {
                handleButtonClick('apps');
                navigate('/apps');
              }}
            >
              APPS
            </button>

            <button
              className={activeCategory === 'learning' ? 'active' : ''}
              onClick={() => {
                handleButtonClick('learning');
                navigate('/learning');
              }}
            >
              LEARNING
            </button>

            <button
              className="one-to-one-btn"
              onClick={() => navigate('/1to1', { state: { reset: Date.now() } })}
            >
              1-to-1 Call
            </button>

            <button
              className="premium"
              onClick={() => navigate('/premium')}
            >
              Premium
            </button>
            <button className="create-room-btn" onClick={onCreateRoomClick}>
              Create Room
            </button>
          </div>
        </div>

      </div>

      <div className={`languages-container ${isExpanded ? 'visible' : ''}`}>
        <div className="languages-section">
          <p className="section-label">Explore by Language</p>
          <div className="languages-grid-layout">
            {languages.map(lang => (
              <button
                key={lang}
                className={`lang-pill glass-pill ${activeCategory === lang.toLowerCase() ? 'active' : ''}`}
                onClick={() => onCategoryClick(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default Navigation;
