import React, { useState } from 'react';

const AIToolsScreen = () => {
  const [activeCategory, setActiveCategory] = useState('translation');
  
  const aiTools = {
    translation: [
      { 
        name: 'Language Translator', 
        icon: '🌐',
        description: 'Translate text between 100+ languages instantly'
      },
      { 
        name: 'Speech to Text', 
        icon: '🎙️',
        description: 'Convert spoken language to written text in real-time'
      },
      { 
        name: 'Text to Speech', 
        icon: '🔊',
        description: 'Convert written text to natural-sounding speech'
      },
      { 
        name: 'Grammar Checker', 
        icon: '✓',
        description: 'Check and correct grammar, spelling, and punctuation'
      },
    ],
    learning: [
      { 
        name: 'Vocabulary Builder', 
        icon: '📚',
        description: 'Build vocabulary with personalized word lists'
      },
      { 
        name: 'Pronunciation Coach', 
        icon: '🗣️',
        description: 'Get feedback on your pronunciation'
      },
      { 
        name: 'Conversation Practice', 
        icon: '💬',
        description: 'Practice conversations with AI language partners'
      },
      { 
        name: 'Writing Assistant', 
        icon: '✍️',
        description: 'Get help with writing essays, emails, and more'
      },
    ],
    other: [
      { 
        name: 'ChatGPT', 
        icon: '🤖',
        description: 'Conversational AI for language practice and information'
      },
      { 
        name: 'AI Image Generator', 
        icon: '🖼️',
        description: 'Create images from text descriptions'
      },
      { 
        name: 'Text Summarizer', 
        icon: '📝',
        description: 'Generate concise summaries of longer texts'
      },
      { 
        name: 'Language Detector', 
        icon: '🔍',
        description: 'Identify the language of any text'
      },
    ]
  };

  return (
    <div className="h-full bg-black text-white overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">AI Tools</h2>
      </div>
      
      <div className="flex border-b border-gray-800">
        <button 
          className={`flex-1 py-3 px-2 text-center text-sm ${activeCategory === 'translation' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveCategory('translation')}
        >
          Translation
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-center text-sm ${activeCategory === 'learning' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveCategory('learning')}
        >
          Learning
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-center text-sm ${activeCategory === 'other' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveCategory('other')}
        >
          Other
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {aiTools[activeCategory].map(tool => (
            <div key={tool.name} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-2xl mr-3">{tool.icon}</div>
                <div>
                  <h3 className="font-medium">{tool.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                </div>
              </div>
              <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md text-sm">Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIToolsScreen;