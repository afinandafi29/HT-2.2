import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavbar = ({ activeButton, onCreateClick }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNav = (action) => {
    if (action === 'home') navigate('/');
    else if (action === 'feed') navigate('/feed');
    else if (action === 'reels') navigate('/youtube');
    else if (action === 'back') window.history.back();
    else if (action === 'create') {
      onCreateClick();
    }
  };

  return (
    <div className="bottom-navbar-wrapper">
      <div className="bottom-navbar">
        <button
          className={activeButton === '/' ? 'active' : ''}
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
          className={activeButton === '/youtube' ? 'active' : ''}
          onClick={() => handleNav('reels')}
        >
          <i className="fas fa-camera-retro"></i>
          <span>Shots</span>
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