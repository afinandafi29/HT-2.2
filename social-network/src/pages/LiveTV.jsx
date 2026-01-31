import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, Volume2, Volume1, VolumeX, RotateCw, Maximize, Minimize, PictureInPicture2, Tv, ExternalLink } from 'lucide-react';
import Hls from 'hls.js';
import '../styles/LiveTV.css';

const LiveTV = () => {
    const [channels, setChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [countries, setCountries] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');

    // Player state
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [pipMode, setPipMode] = useState(false);

    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        // Fetch Countries and Languages
        Promise.all([
            fetch('https://iptv-org.github.io/api/countries.json').then(r => r.json()),
            fetch('https://iptv-org.github.io/api/languages.json').then(r => r.json())
        ]).then(([countriesData, languagesData]) => {
            setCountries(countriesData.sort((a, b) => a.name.localeCompare(b.name)));
            setLanguages(languagesData.sort((a, b) => a.name.localeCompare(b.name)));
        }).catch(err => console.error('Error fetching metadata:', err));

        // Initial fetch - all channels from index
        fetchPlaylist('https://iptv-org.github.io/iptv/index.m3u');
    }, []);

    const fetchPlaylist = (url) => {
        setLoading(true);
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                const parsedChannels = [];
                let currentChannel = {};

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('#EXTINF')) {
                        const lastCommaIndex = line.lastIndexOf(',');
                        let name = lastCommaIndex !== -1 ? line.substring(lastCommaIndex + 1).trim() : 'Unknown Channel';

                        // Clean up name
                        if (name.includes('"')) {
                            const parts = name.split('"');
                            name = parts[parts.length - 1].split(',').pop().trim();
                        }
                        name = name.replace(/^,+/, '').trim() || 'Unknown Channel';

                        const logoMatch = line.match(/tvg-logo="(.*?)"/);
                        const groupMatch = line.match(/group-title="(.*?)"/);
                        const countryMatch = line.match(/tvg-country="(.*?)"/);
                        const languageMatch = line.match(/tvg-language="(.*?)"/);

                        currentChannel.name = name;
                        currentChannel.logo = logoMatch ? logoMatch[1] : null;
                        currentChannel.group = groupMatch ? groupMatch[1] : 'General';
                        currentChannel.country = countryMatch ? countryMatch[1] : null;
                        currentChannel.language = languageMatch ? languageMatch[1] : null;

                    } else if (line.startsWith('http')) {
                        currentChannel.url = line;
                        if (!parsedChannels.find(c => c.url === line) && (line.includes('.m3u8') || line.includes('.mp4'))) {
                            parsedChannels.push(currentChannel);
                        }
                        currentChannel = {};
                    }
                }

                parsedChannels.sort((a, b) => a.name.localeCompare(b.name));
                setChannels(parsedChannels);
                setFilteredChannels(parsedChannels);
                if (parsedChannels.length > 0 && !selectedChannel) {
                    setSelectedChannel(parsedChannels[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching IPTV playlist:', err);
                setLoading(false);
            });
    };

    // Filter Logic
    useEffect(() => {
        let result = channels;

        if (searchTerm) {
            result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredChannels(result);
    }, [searchTerm, channels]);

    const handleCountryChange = (e) => {
        const code = e.target.value;
        setSelectedCountry(code);
        if (code === 'all') {
            fetchPlaylist('https://iptv-org.github.io/iptv/index.m3u');
        } else {
            fetchPlaylist(`https://iptv-org.github.io/iptv/countries/${code}.m3u`);
        }
    };

    const handleLanguageChange = (e) => {
        const code = e.target.value;
        setSelectedLanguage(code);
        if (code === 'all') {
            fetchPlaylist('https://iptv-org.github.io/iptv/index.m3u');
        } else {
            fetchPlaylist(`https://iptv-org.github.io/iptv/languages/${code}.m3u`);
        }
    };

    useEffect(() => {
        if (selectedChannel && videoRef.current) {
            const video = videoRef.current;
            const videoSrc = selectedChannel.url;

            if (Hls.isSupported()) {
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(e => console.log('Autoplay blocked:', e));
                    setIsPlaying(true);
                });
                hlsRef.current = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoSrc;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(e => console.log('Autoplay blocked:', e));
                    setIsPlaying(true);
                });
            }
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [selectedChannel]);

    // Custom Controls Handlers
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            setIsMuted(val === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            setIsMuted(newMuted);
            videoRef.current.muted = newMuted;
            if (!newMuted && volume === 0) {
                setVolume(0.5);
                videoRef.current.volume = 0.5;
            }
        }
    };

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (playerContainerRef.current.requestFullscreen) {
                playerContainerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFSChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    const togglePiP = async () => {
        if (videoRef.current) {
            try {
                if (videoRef.current !== document.pictureInPictureElement) {
                    await videoRef.current.requestPictureInPicture();
                    setPipMode(true);
                } else {
                    await document.exitPictureInPicture();
                    setPipMode(false);
                }
            } catch (err) {
                console.error('PiP failed:', err);
            }
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    return (
        <div className="livetv-page">
            <div className="livetv-container glass-morphism vlc-theme" onMouseMove={handleMouseMove}>

                <div className="player-section" ref={playerContainerRef}>
                    {selectedChannel ? (
                        <div className="vlc-player-wrapper">
                            <div className={`player-header ${showControls ? 'visible' : 'hidden'}`}>
                                <div className="channel-meta">
                                    <h2>{selectedChannel.name}</h2>
                                    <div className="live-indicator">
                                        <div className="live-dot"></div>
                                        <span>LIVE</span>
                                    </div>
                                </div>
                                <div className="header-actions">
                                    <button onClick={togglePiP} title="Picture in Picture">
                                        <PictureInPicture2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="video-viewport" onClick={togglePlay}>
                                <video
                                    ref={videoRef}
                                    className="vlc-video-element"
                                    poster={selectedChannel.logo}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                                {!isPlaying && (
                                    <div className="play-overlay">
                                        <Play size={64} fill="white" className="opacity-80 drop-shadow-lg" />
                                    </div>
                                )}
                            </div>

                            <div className={`vlc-controls-footer ${showControls ? 'visible' : 'hidden'}`}>
                                <div className="controls-row main-controls">
                                    <div className="left-controls">
                                        <button onClick={togglePlay} className="control-btn play-pause">
                                            {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                                        </button>
                                        <div className="volume-control">
                                            <button onClick={toggleMute} className="control-btn">
                                                {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="volume-slider"
                                            />
                                        </div>
                                    </div>

                                    <div className="right-controls">
                                        <button onClick={() => fetchPlaylist('https://iptv-org.github.io/iptv/index.m3u')} title="Refresh Playlist" className="control-btn">
                                            <RotateCw size={20} />
                                        </button>
                                        <button onClick={toggleFullScreen} title="Fullscreen" className="control-btn">
                                            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="vlc-placeholder">
                            <div className="vlc-logo">
                                <Tv size={64} />
                            </div>
                            <p>Select a channel from the right to start watching</p>
                        </div>
                    )}
                </div>

                <div className="channels-sidebar-right">
                    <div className="sidebar-filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search channels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-dropdowns">
                            <select value={selectedCountry} onChange={handleCountryChange}>
                                <option value="all">All Countries</option>
                                {countries.map(c => (
                                    <option key={c.code} value={c.code.toLowerCase()}>{c.name}</option>
                                ))}
                            </select>
                            <select value={selectedLanguage} onChange={handleLanguageChange}>
                                <option value="all">All Languages</option>
                                {languages.map(l => (
                                    <option key={l.code} value={l.code.toLowerCase()}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="channels-grid">
                        {loading ? (
                            <div className="vlc-loader">
                                <div className="vlc-spinner"></div>
                                <span>Loading Streams...</span>
                            </div>
                        ) : (
                            filteredChannels.map((channel, index) => (
                                <div
                                    key={index}
                                    className={`vlc-channel-card ${selectedChannel?.url === channel.url ? 'active' : ''}`}
                                    onClick={() => setSelectedChannel(channel)}
                                >
                                    <div className="channel-logo-top">
                                        {channel.logo ? (
                                            <img src={channel.logo} alt={channel.name} onError={(e) => e.target.style.display = 'none'} />
                                        ) : (
                                            <Tv size={24} color="#555" />
                                        )}
                                    </div>
                                    <div className="channel-details-bottom">
                                        <span className="name">{channel.name}</span>
                                        <span className="grp">{channel.group}</span>
                                    </div>
                                    {selectedChannel?.url === channel.url && (
                                        <div className="vlc-active-indicator"></div>
                                    )}
                                </div>
                            ))
                        )}
                        {!loading && filteredChannels.length === 0 && (
                            <div className="no-results" style={{ color: '#666', padding: '20px', textAlign: 'center' }}>No channels found</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LiveTV;
