import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavbar = ({ activeButton, onCreateClick }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNav = (action) => {
    if (action === 'home') navigate('/');
    else if (action === 'feed') navigate('/feed');
    else if (action === 'profile') navigate('/profile');
    else if (action === 'search') {
      const searchInput = document.querySelector('.search-section input');
      if (searchInput) searchInput.focus();
    }
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

        <button onClick={() => handleNav('create')}>
          <i className="fas fa-plus-square"></i>
          <span>Create</span>
        </button>

        <button onClick={() => handleNav('search')}>
          <i className="fas fa-search"></i>
          <span>Search</span>
        </button>

        <button
          className={activeButton.startsWith('/profile') ? 'active' : ''}
          onClick={() => handleNav('profile')}
        >
          <i className="fas fa-user"></i>
          <span>{currentUser ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavbar;