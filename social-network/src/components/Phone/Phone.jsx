import React, { useState, useEffect } from 'react';
import AppScreen from './AppScreen';
import GameScreen from './GameScreen';
import YouTubeContainer from './YouTubeContainer';
import WatchPartyScreen from './WatchPartyScreen';
import BottomNav from './BottomNav';
import SearchContainer from './SearchContainer';
import FeedScreen from './FeedScreen';
import SocialScreen from './SocialScreen';
import MovieScreen from './MovieScreen';
import AIToolsScreen from './AIToolsScreen';
import WhiteboardScreen from './WhiteboardScreen';
import SettingsScreen from './SettingsScreen';
import WebAppScreen from './WebAppScreen';
import OneToOneCallScreen from './OneToOneCallScreen';
import UnsplashScreen from './UnsplashScreen';
import DictionaryScreen from './DictionaryScreen';
import AIChatScreen from './AIChatScreen';

import ThemeScreen from './ThemeScreen';
import AppStoreScreen from './AppStoreScreen';

const Phone = ({ onClose, initialScreen = 'app' }) => {
  const [activeScreen, setActiveScreen] = useState(initialScreen);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [webAppUrl, setWebAppUrl] = useState('');
  const [webAppTitle, setWebAppTitle] = useState('');

  // Listen for YouTube open event
  useEffect(() => {
    const handleOpenYouTube = () => {
      setActiveScreen('youtube');
    };

    window.addEventListener('openYouTubeInPhone', handleOpenYouTube);

    return () => {
      window.removeEventListener('openYouTubeInPhone', handleOpenYouTube);
    };
  }, []);

  const handleAppClick = (appId) => {
    switch (appId) {
      case 'youtube-app':
        setActiveScreen('youtube');
        break;
      case 'games-folder':
        setActiveScreen('games');
        break;
      case 'watchparty-app':
        setActiveScreen('watchparty');
        break;
      case 'whiteboard-app':
        setActiveScreen('whiteboard');
        break;
      case 'feed-app':
        // URL navigation is handled in AppScreen now
        break;
      case 'social-app':
        setActiveScreen('social');
        break;
      case 'movie-app':
        setActiveScreen('movie');
        break;
      case 'theme-app':
        setActiveScreen('theme');
        break;
      case 'unsplash-app':
        setActiveScreen('unsplash');
        break;
      case 'dictionary-app':
        setActiveScreen('dictionary');
        break;
      case 'app-store':
        setActiveScreen('app-store');
        break;
      case 'ai-chat-app':
        setActiveScreen('ai-chat');
        break;
      case 'instagram-app':
        setWebAppUrl('https://instagram.com');
        setWebAppTitle('Instagram');
        setActiveScreen('webapp');
        break;
      case 'facebook-app':
        setWebAppUrl('https://facebook.com');
        setWebAppTitle('Facebook');
        setActiveScreen('webapp');
        break;
      case 'twitter-app':
        setWebAppUrl('https://twitter.com');
        setWebAppTitle('Twitter');
        setActiveScreen('webapp');
        break;
      case 'linkedin-app':
        setWebAppUrl('https://linkedin.com');
        setWebAppTitle('LinkedIn');
        setActiveScreen('webapp');
        break;
      default:
        break;
    }
  };

  const handleHomeClick = () => {
    setActiveScreen('app');
    setSearchActive(false);
    setSearchQuery('');
  };

  const handleBackClick = () => {
    if (activeScreen === 'app') {
      onClose?.();
    } else {
      setActiveScreen('app');
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  const handleSearchClick = () => {
    if (activeScreen === 'app') {
      setSearchActive(!searchActive);
      if (!searchActive) {
        setSearchQuery('');
      }
    }
  };

  const handleExpandClick = () => {
    alert('Expand functionality not implemented.');
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="w-[320px] h-[660px] bg-black rounded-[60px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)] border-8 border-white">
      <div className='h-4'></div>
      <div className="phone-content-area" style={{ height: 'calc(100%)', overflowY: 'auto' }}>
        {activeScreen === 'app' && (
          <AppScreen
            onAppClick={handleAppClick}
            searchQuery={searchQuery}
          />
        )}

        {activeScreen === 'games' && (
          <GameScreen searchQuery={searchQuery} />
        )}

        {activeScreen === 'youtube' && (
          <YouTubeContainer />
        )}

        {activeScreen === 'watchparty' && (
          <WatchPartyScreen searchQuery={searchQuery} />
        )}

        {activeScreen === 'feed' && (
          <FeedScreen />
        )}

        {activeScreen === 'social' && (
          <SocialScreen />
        )}

        {activeScreen === 'movie' && (
          <MovieScreen />
        )}

        {activeScreen === 'whiteboard' && (
          <WhiteboardScreen />
        )}

        {activeScreen === 'theme' && (
          <ThemeScreen />
        )}

        {activeScreen === 'unsplash' && (
          <UnsplashScreen />
        )}

        {activeScreen === 'dictionary' && (
          <DictionaryScreen />
        )}

        {activeScreen === 'app-store' && (
          <AppStoreScreen />
        )}

        {activeScreen === 'ai-chat' && (
          <AIChatScreen />
        )}

        {activeScreen === 'webapp' && (
          <WebAppScreen url={webAppUrl} title={webAppTitle} />
        )}

        {searchActive && activeScreen === 'app' && (
          <SearchContainer
            onSearchChange={handleSearchChange}
          />
        )}
      </div>

      <BottomNav
        onHomeClick={handleHomeClick}
        onSearchClick={handleSearchClick}
        onBackClick={handleBackClick}
      />
    </div>
  );
};

export default Phone;