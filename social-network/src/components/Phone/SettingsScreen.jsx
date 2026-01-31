import React, { useState, useEffect } from 'react';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [textSize, setTextSize] = useState('Medium');
  const [soundEffects, setSoundEffects] = useState(true);
  const [volume, setVolume] = useState(60);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedBrightness = localStorage.getItem('brightness') || 80;
    const savedTextSize = localStorage.getItem('textSize') || 'Medium';
    const savedSoundEffects = localStorage.getItem('soundEffects') !== 'false';
    const savedVolume = localStorage.getItem('volume') || 60;

    setDarkMode(savedDarkMode);
    setBrightness(savedBrightness);
    setTextSize(savedTextSize);
    setSoundEffects(savedSoundEffects);
    setVolume(savedVolume);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('brightness', brightness);
    localStorage.setItem('textSize', textSize);
    localStorage.setItem('soundEffects', soundEffects);
    localStorage.setItem('volume', volume);

    // Apply dark mode to the body if needed
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode, brightness, textSize, soundEffects, volume]);

  return (
    <div className="h-full bg-[#181818] text-white overflow-y-auto">
      <div className="p-4 border-b border-[#333]">
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>
      
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-base font-semibold mb-4 text-[#4f8cff]">Theme</h3>
        <div className="flex justify-between items-center mb-4">
          <div>Dark Mode</div>
          <label className="relative inline-block w-[40px] h-[24px]">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="opacity-0 w-0 h-0"
            />
            <span className={`absolute cursor-pointer inset-0 rounded-full transition-all ${darkMode ? 'bg-[#4f8cff]' : 'bg-[#333]'}`}>
              <span 
                className={`absolute top-[2px] left-[2px] bg-white w-[20px] h-[20px] rounded-full transition-all ${darkMode ? 'translate-x-[16px]' : ''}`}
              ></span>
            </span>
          </label>
        </div>
      </div>
      
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-base font-semibold mb-4 text-[#4f8cff]">Display</h3>
        <div className="flex justify-between items-center mb-4">
          <div>Brightness</div>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
            className="w-[120px] h-[4px] bg-[#333] rounded appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4f8cff] [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>Text Size</div>
          <select
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
            className="bg-[#333] text-white border-none py-1 px-2 rounded"
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>
      </div>
      
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-base font-semibold mb-4 text-[#4f8cff]">Sound & Haptics</h3>
        <div className="flex justify-between items-center mb-4">
          <div>Sound Effects</div>
          <label className="relative inline-block w-[40px] h-[24px]">
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={() => setSoundEffects(!soundEffects)}
              className="opacity-0 w-0 h-0"
            />
            <span className={`absolute cursor-pointer inset-0 rounded-full transition-all ${soundEffects ? 'bg-[#4f8cff]' : 'bg-[#333]'}`}>
              <span 
                className={`absolute top-[2px] left-[2px] bg-white w-[20px] h-[20px] rounded-full transition-all ${soundEffects ? 'translate-x-[16px]' : ''}`}
              ></span>
            </span>
          </label>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>Volume</div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-[120px] h-[4px] bg-[#333] rounded appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4f8cff] [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>
      
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-base font-semibold mb-4 text-[#4f8cff]">Privacy & Security</h3>
        <div className="flex justify-between items-center mb-4">
          <div>Location Services</div>
          <label className="relative inline-block w-[40px] h-[24px]">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0"
            />
            <span className="absolute cursor-pointer inset-0 rounded-full transition-all bg-[#333]">
              <span 
                className="absolute top-[2px] left-[2px] bg-white w-[20px] h-[20px] rounded-full transition-all"
              ></span>
            </span>
          </label>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>Clear Cache</div>
          <button className="bg-[#333] text-white px-3 py-1 rounded">Clear</button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-semibold mb-4 text-[#4f8cff]">About</h3>
        <div className="mb-2">
          <div>App Version</div>
          <div className="text-sm text-gray-400">1.0.0</div>
        </div>
        <div className="mb-2">
          <div>Terms of Service</div>
          <div className="text-sm text-gray-400">View Terms</div>
        </div>
        <div className="mb-2">
          <div>Privacy Policy</div>
          <div className="text-sm text-gray-400">View Policy</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;