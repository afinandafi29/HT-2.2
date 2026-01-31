import React, { useState } from 'react';
import axios from 'axios';
import { Search, Volume2, Book, Loader2, AlertCircle } from 'lucide-react';

const DictionaryScreen = () => {
    const [word, setWord] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchDictionary = async (searchWord) => {
        if (!searchWord.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
            setResult(response.data[0]);
        } catch (err) {
            setError('Word not found. Try another one!');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchDictionary(word);
    };

    const playAudio = () => {
        const audioObj = result?.phonetics?.find(p => p.audio !== '');
        if (audioObj?.audio) {
            const audio = new Audio(audioObj.audio);
            audio.play();
        } else {
            alert('Audio not available for this word.');
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0a0c] text-white flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="p-5 bg-indigo-600/10 backdrop-blur-xl border-b border-indigo-500/20 sticky top-0 z-20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30">
                        <Book size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tighter uppercase leading-none">Dict.io</h2>
                        <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-widest">Vocabulary Assistant</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Type a word..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                </form>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-none pb-24">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                        <p className="text-gray-500 font-black uppercase text-xs tracking-widest">Fetching definition...</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-4 bg-red-500/10 rounded-full mb-4">
                            <AlertCircle className="text-red-500" size={32} />
                        </div>
                        <p className="text-red-400 font-bold">{error}</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="space-y-6 animate-slideUp">
                        {/* Word & Phonetic */}
                        <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter capitalize">{result.word}</h1>
                                <p className="text-indigo-400 font-medium text-lg mt-1">{result.phonetic}</p>
                            </div>
                            <button
                                onClick={playAudio}
                                className="p-4 bg-indigo-500 hover:bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-90"
                            >
                                <Volume2 size={24} />
                            </button>
                        </div>

                        {/* Meanings */}
                        {result.meanings.map((meaning, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                                <div className="inline-block px-4 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                    {meaning.partOfSpeech}
                                </div>

                                <div className="space-y-6">
                                    {meaning.definitions.slice(0, 2).map((def, dIdx) => (
                                        <div key={dIdx} className="relative pl-6">
                                            <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                            <p className="text-gray-200 leading-relaxed text-sm font-medium">
                                                {def.definition}
                                            </p>
                                            {def.example && (
                                                <p className="text-gray-500 italic text-xs mt-2 border-l-2 border-white/10 pl-3">
                                                    "{def.example}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {meaning.synonyms?.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Synonyms</p>
                                        <div className="flex flex-wrap gap-2">
                                            {meaning.synonyms.slice(0, 5).map((syn, sIdx) => (
                                                <span key={sIdx} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400">
                                                    {syn}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {result.origin && (
                            <div className="p-6 bg-indigo-900/10 border border-indigo-500/10 rounded-[2rem]">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Origin</p>
                                <p className="text-gray-400 text-xs italic leading-relaxed">{result.origin}</p>
                            </div>
                        )}
                    </div>
                )}

                {!result && !loading && !error && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <Book size={64} className="mb-4" />
                        <p className="font-black uppercase text-xs tracking-widest">Type to search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DictionaryScreen;
