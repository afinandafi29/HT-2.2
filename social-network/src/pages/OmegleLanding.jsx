import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Phone, Tag, X, ChevronDown } from 'lucide-react';

const OneToOneLanding = () => {
  const navigate = useNavigate();
  const [interest, setInterest] = useState('');
  const [interests, setInterests] = useState([]);
  const [showInterestInput, setShowInterestInput] = useState(false);

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' && interest.trim()) {
      e.preventDefault();
      if (!interests.includes(interest.trim())) {
        setInterests([...interests, interest.trim()]);
      }
      setInterest('');
    }
  };

  const removeInterest = (indexToRemove) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };

  const handleStartChat = (mode) => {
    const interestsParam = interests.length > 0 ? `?interests=${encodeURIComponent(interests.join(','))}` : '';
    navigate(`/1to1/${mode}${interestsParam}`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-transparent text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-4">
              <Video size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Talk to Strangers
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Connect with people from around the world instantly
          </p>
        </div>

        {/* Optional Interest Section */}
        <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <button
            onClick={() => setShowInterestInput(!showInterestInput)}
            className="w-full flex items-center justify-between text-left mb-4">
            <div className="flex items-center gap-3">
              <Tag className="text-purple-400" size={24} />
              <div>
                <h3 className="font-bold text-lg">Add Interests (Optional)</h3>
                <p className="text-sm text-gray-400">Match with people who share your interests</p>
              </div>
            </div>
            <ChevronDown
              className={`text-gray-400 transition-transform ${showInterestInput ? 'rotate-180' : ''}`}
              size={24}
            />
          </button>

          {showInterestInput && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder="Type an interest and press Enter (e.g., music, gaming, coding...)"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-base backdrop-blur-xl"
                />
              </div>

              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map((int, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm font-semibold">
                      <span>{int}</span>
                      <button
                        onClick={() => removeInterest(index)}
                        className="hover:bg-white/10 rounded-full p-1 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => handleStartChat('video')}
            className="group relative p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-3xl transition-all backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/5 transition-all"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                <Video size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-center">Video Call</h3>
              <p className="text-gray-400 text-sm text-center">Face-to-face video chat with camera controls</p>
            </div>
          </button>

          <button
            onClick={() => handleStartChat('audio')}
            className="group relative p-8 bg-gradient-to-br from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 border-2 border-green-500/30 hover:border-green-500/50 rounded-3xl transition-all backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/10 group-hover:to-green-600/5 transition-all"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                <Phone size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-center">Audio Call</h3>
              <p className="text-gray-400 text-sm text-center">Voice chat only, no video required</p>
            </div>
          </button>

          <button
            onClick={() => handleStartChat('text')}
            className="group relative p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-3xl transition-all backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/10 group-hover:to-purple-600/5 transition-all"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <MessageSquare size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-center">Text Call</h3>
              <p className="text-gray-400 text-sm text-center">Chat via messages instantly</p>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {interests.length > 0
              ? `Matching with people interested in: ${interests.join(', ')}`
              : 'Start chatting with random people or add interests to find like-minded strangers'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneToOneLanding;
