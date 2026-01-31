import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, Upload } from 'lucide-react';

const MusicPlayer = () => {
    const [playlist, setPlaylist] = useState(() => {
        const saved = localStorage.getItem('musicPlaylist');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);

    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('musicPlaylist', JSON.stringify(playlist));
    }, [playlist]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (isRepeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleNext();
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isRepeat, currentTrackIndex]);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newTracks = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Unknown Artist',
            url: URL.createObjectURL(file),
            duration: 0
        }));

        setPlaylist([...playlist, ...newTracks]);
    };

    const togglePlay = () => {
        if (playlist.length === 0) return;

        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (playlist.length === 0) return;

        let nextIndex;
        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
            nextIndex = (currentTrackIndex + 1) % playlist.length;
        }
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
    };

    const handlePrevious = () => {
        if (playlist.length === 0) return;

        if (currentTime > 3) {
            audioRef.current.currentTime = 0;
        } else {
            const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
            setCurrentTrackIndex(prevIndex);
        }
        setIsPlaying(true);
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value / 100;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const deleteTrack = (id) => {
        const newPlaylist = playlist.filter(track => track.id !== id);
        setPlaylist(newPlaylist);
        if (playlist[currentTrackIndex]?.id === id) {
            setCurrentTrackIndex(0);
            setIsPlaying(false);
        }
    };

    const currentTrack = playlist[currentTrackIndex];

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.src = currentTrack.url;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentTrackIndex]);

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent p-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Player */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-[50px] p-12 border border-white/10">
                            {/* Album Art */}
                            <div className="w-full aspect-square max-w-md mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                                <div className="text-9xl">🎵</div>
                            </div>

                            {/* Track Info */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {currentTrack?.name || 'No Track Selected'}
                                </h2>
                                <p className="text-xl text-gray-300">
                                    {currentTrack?.artist || 'Unknown Artist'}
                                </p>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={(currentTime / duration) * 100 || 0}
                                    onChange={handleSeek}
                                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-sm text-gray-400 mt-2">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-6 mb-6">
                                <button
                                    onClick={() => setIsShuffle(!isShuffle)}
                                    className={`p-3 rounded-full transition-colors ${isShuffle ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                >
                                    <Shuffle size={20} />
                                </button>

                                <button
                                    onClick={handlePrevious}
                                    disabled={playlist.length === 0}
                                    className="p-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
                                >
                                    <SkipBack size={24} className="text-white" />
                                </button>

                                <button
                                    onClick={togglePlay}
                                    disabled={playlist.length === 0}
                                    className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all shadow-lg"
                                >
                                    {isPlaying ? (
                                        <Pause size={32} className="text-white" />
                                    ) : (
                                        <Play size={32} className="text-white ml-1" />
                                    )}
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={playlist.length === 0}
                                    className="p-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
                                >
                                    <SkipForward size={24} className="text-white" />
                                </button>

                                <button
                                    onClick={() => setIsRepeat(!isRepeat)}
                                    className={`p-3 rounded-full transition-colors ${isRepeat ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                >
                                    <Repeat size={20} />
                                </button>
                            </div>

                            {/* Volume */}
                            <div className="flex items-center gap-4 max-w-xs mx-auto">
                                <button onClick={toggleMute} className="text-white">
                                    {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume * 100}
                                    onChange={handleVolumeChange}
                                    className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                                />
                            </div>

                            <audio ref={audioRef} />
                        </div>
                    </div>

                    {/* Playlist */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-6 border border-white/10 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Playlist</h3>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 bg-purple-500 hover:bg-purple-600 rounded-xl transition-colors"
                                >
                                    <Upload size={20} className="text-white" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {playlist.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Upload size={48} className="mx-auto mb-4 opacity-30" />
                                        <p>No tracks yet</p>
                                        <p className="text-sm mt-2">Upload audio files to start</p>
                                    </div>
                                ) : (
                                    playlist.map((track, index) => (
                                        <div
                                            key={track.id}
                                            onClick={() => {
                                                setCurrentTrackIndex(index);
                                                setIsPlaying(true);
                                            }}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all group
                        ${index === currentTrackIndex ? 'bg-purple-500/30 ring-2 ring-purple-400' : 'bg-white/5 hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-white truncate">{track.name}</div>
                                                    <div className="text-sm text-gray-400 truncate">{track.artist}</div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteTrack(track.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                                                >
                                                    <span className="text-red-400 text-sm">×</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {playlist.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
                                    {playlist.length} {playlist.length === 1 ? 'track' : 'tracks'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
        </div>
    );
};

export default MusicPlayer;
