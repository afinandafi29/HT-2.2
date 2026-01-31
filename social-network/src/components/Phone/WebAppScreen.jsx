import React, { useState } from 'react';

const WebAppScreen = ({ url, title }) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="h-full bg-black text-white flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <h2 className="text-xl font-semibold">{title || 'Web App'}</h2>
        {loading && (
          <div className="ml-2 animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        )}
      </div>
      
      <div className="flex-1 bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        )}
        <iframe
          src={url}
          title={title || 'Web App'}
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
        />
      </div>
      
      <div className="p-3 border-t border-gray-800 flex justify-center items-center">
        <button 
          onClick={() => window.open(url, '_blank')}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Open in Browser
        </button>
      </div>
    </div>
  );
};

export default WebAppScreen;