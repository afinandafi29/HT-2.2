import React from 'react';

const HappyTalkScreen = () => {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <iframe
        src="http://localhost:3000"
        title="HAPPYY TALK Chat"
        className="w-full h-full border-none"
        allow="camera;microphone;fullscreen;display-capture"
      ></iframe>
    </div>
  );
};

export default HappyTalkScreen;