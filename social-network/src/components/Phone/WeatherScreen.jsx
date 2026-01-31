import React, { useState } from 'react';

const WeatherScreen = () => {
  const [location, setLocation] = useState('New York');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock weather data
  const weatherData = {
    temperature: '72°',
    condition: 'Sunny',
    date: 'Monday, June 3',
    details: [
      { icon: 'fas fa-wind', value: '8 mph' },
      { icon: 'fas fa-tint', value: '30%' },
      { icon: 'fas fa-temperature-high', value: '75° / 64°' }
    ],
    forecast: [
      { day: 'Tue', icon: 'fas fa-cloud', temp: '70°' },
      { day: 'Wed', icon: 'fas fa-cloud-sun', temp: '72°' },
      { day: 'Thu', icon: 'fas fa-cloud-rain', temp: '65°' },
      { day: 'Fri', icon: 'fas fa-sun', temp: '76°' },
      { day: 'Sat', icon: 'fas fa-sun', temp: '78°' }
    ]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(searchQuery);
      setSearchQuery('');
      // In a real app, you would fetch weather data for the new location here
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#1a237e] via-[#0d47a1] to-[#01579b] text-white p-4 flex flex-col">
      <div className="flex mb-5">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="flex-1 bg-[rgba(255,255,255,0.2)] border-none rounded-full py-2 px-4 text-white outline-none placeholder-[rgba(255,255,255,0.7)]"
          />
          <button 
            type="submit"
            className="bg-transparent border-none text-white ml-2"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-semibold">{location}</div>
          <div className="text-sm opacity-80">{weatherData.date}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <i className="fas fa-sun text-[80px] text-[#ffeb3b] mb-2"></i>
          <div className="text-6xl font-light">{weatherData.temperature}</div>
        </div>
        
        <div className="text-2xl">{weatherData.condition}</div>
        
        <div className="flex justify-around w-full">
          {weatherData.details.map((detail, index) => (
            <div key={index} className="flex flex-col items-center">
              <i className={`${detail.icon} text-xl mb-1`}></i>
              <span className="text-sm">{detail.value}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between w-full pt-4 border-t border-[rgba(255,255,255,0.2)]">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-sm mb-2">{day.day}</div>
              <i className={`${day.icon} text-xl mb-2 text-[#e0e0e0]`}></i>
              <div className="text-base">{day.temp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherScreen;