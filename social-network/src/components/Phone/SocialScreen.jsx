import React, { useState } from 'react';

const SocialScreen = () => {
  const [activeTab, setActiveTab] = useState('trending');
  
  const socialApps = [
    { 
      name: 'Instagram', 
      icon: 'https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=000000',
      url: 'https://instagram.com'
    },
    { 
      name: 'Facebook', 
      icon: 'https://img.icons8.com/?size=100&id=118497&format=png&color=000000',
      url: 'https://facebook.com'
    },
    { 
      name: 'Pinterest', 
      icon: 'https://img.icons8.com/?size=100&id=63676&format=png&color=000000',
      url: 'https://pinterest.com'
    },
    { 
      name: 'LinkedIn', 
      icon: 'https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000',
      url: 'https://linkedin.com'
    },
    { 
      name: 'X', 
      icon: 'https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000',
      url: 'https://x.com'
    },
    { 
      name: 'TikTok', 
      icon: 'https://img.icons8.com/?size=100&id=118638&format=png&color=000000',
      url: 'https://tiktok.com'
    },
    { 
      name: 'WhatsApp', 
      icon: 'https://img.icons8.com/?size=100&id=16713&format=png&color=000000',
      url: 'https://whatsapp.com'
    },
    { 
      name: 'Snapchat', 
      icon: 'https://img.icons8.com/?size=100&id=67599&format=png&color=000000',
      url: 'https://snapchat.com'
    },
    { 
      name: 'Telegram', 
      icon: 'https://img.icons8.com/?size=100&id=oWiuH0jFiU0R&format=png&color=000000',
      url: 'https://telegram.org'
    },
  ];
  
  return (
    <div className="h-full bg-black text-white overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Social</h2>
      </div>
      
      <div className="flex border-b border-gray-800">
        <button 
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'trending' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button 
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'connect' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('connect')}
        >
          Connect
        </button>
      </div>
      
      {activeTab === 'trending' ? (
        <div className="p-4">
          <div className="bg-gray-900 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Today's Trending</h3>
              <span className="text-blue-400 text-sm">See all</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">#1</span>
                <span>LanguageLearning</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">#2</span>
                <span>HAPPYY TALKApp</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">#3</span>
                <span>PolyglotLife</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Latest News</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm">New language exchange app gaining popularity among students</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
              <div>
                <p className="text-sm">Study shows benefits of regular conversation practice for language learning</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-3 gap-4">
          {socialApps.map(app => (
            <a 
              key={app.name} 
              href={app.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden mb-1">
                <img src={app.icon} alt={app.name} className="w-10 h-10 object-contain" />
              </div>
              <span className="text-xs">{app.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialScreen;