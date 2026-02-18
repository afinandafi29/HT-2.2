import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutContext } from './Layout';

const BottomNavbar = ({ activeButton, onCreateClick }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setActiveHomeView, activeHomeView } = useContext(LayoutContext);

  const handleNav = (action) => {
    if (action === 'home') {
      setActiveHomeView('rooms');
      navigate('/');
    }
    else if (action === 'feed') {
      navigate('/feed');
    }
    else if (action === 'reels') {
      setActiveHomeView('shorts');
      navigate('/');
    }
    else if (action === 'back') window.history.back();
    else if (action === 'create') {
      if (onCreateClick) {
        onCreateClick();
      }
    }
  };

  return (
    <div className="bottom-navbar-wrapper">
      <div className="bottom-navbar">
        <button
          className={(activeButton === '/' && activeHomeView === 'rooms') ? 'active' : ''}
          onClick={() => handleNav('home')}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </button>

        <button
          className={activeButton === '/feed' ? 'active' : ''}
          onClick={() => handleNav('feed')}
        >
          <i className="fas fa-rss"></i>
          <span>Feed</span>
        </button>

        <button
          className="plus-nav-btn"
          onClick={() => handleNav('create')}
        >
          <div className="plus-icon-wrapper">
            <i className="fas fa-plus"></i>
          </div>
          <span>Create</span>
        </button>

        <button
          className={(activeButton === '/' && activeHomeView === 'shorts') ? 'active' : ''}
          onClick={() => handleNav('reels')}
        >
          <i className="fas fa-camera-retro"></i>
          <span>Shorts</span>
        </button>

        <button
          onClick={() => handleNav('back')}
        >
          <i className="fas fa-chevron-left"></i>
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavbar;