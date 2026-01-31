import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Moon, Sun, Video, Phone, MessageSquare, Menu, X, Mic, MicOff, Camera, CameraOff, Flag, PhoneOff } from 'lucide-react';
import io from 'socket.io-client';

const SIGNALING_SERVER = 'https://happyytalk.in';

const OneToOne = () => {
    // UI State
    const location = useLocation();
    const [mode, setMode] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [onlineCount, setOnlineCount] = useState(1236);

    // Filter State (Internal use mainly for search params)
    const [genderPreference, setGenderPreference] = useState('any');
    const [myInterests, setMyInterests] = useState([]);
    const [interestInputValue, setInterestInputValue] = useState('');

    // Chat State
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [strangerTyping, setStrangerTyping] = useState(false);

    // Media State
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);

    // WebRTC Refs
    const socketRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const partnerIdRef = useRef(null);
    const isInitiatorRef = useRef(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const starsRef = useRef(null);

    // ICE servers
    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // Initialize Online Count & Handle Navigation Reset
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineCount(prev => Math.max(300, Math.min(2500, prev + Math.floor(Math.random() * 80) - 40)));
        }, 5000);

        return () => {
            clearInterval(interval);
            cleanup();
        };
    }, []);

    // Reset when navigating to page via menu (location.state.reset)
    useEffect(() => {
        if (location.state?.reset) {
            stopChat();
        }
    }, [location.state]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const cleanup = () => {
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerConnectionRef.current?.close();
        socketRef.current?.disconnect();
    };

    // Search & Chat Logic
    const startSearch = async (selectedMode) => {
        const activeInterests = myInterests.map(i => i.text.toLowerCase());
        setMode(selectedMode);
        setIsSearching(true);
        setMessages([]);

        socketRef.current = io(SIGNALING_SERVER);
        setupSocketListeners();

        if (selectedMode === 'audio' || selectedMode === 'video') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: selectedMode === 'video',
                    audio: true
                });
                localStreamRef.current = stream;
                if (localVideoRef.current && selectedMode === 'video') {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media:', error);
                alert('Please allow camera/microphone access!');
                stopChat();
                return;
            }
        }

        socketRef.current.emit('find-match', {
            interests: activeInterests,
            mode: selectedMode,
            gender: genderPreference
        });
    };

    const setupSocketListeners = () => {
        socketRef.current.on('match-found', async ({ partnerId, isInitiator }) => {
            partnerIdRef.current = partnerId;
            isInitiatorRef.current = isInitiator;
            setIsSearching(false);
            setIsConnected(true);
            setMessages([]);

            if (mode === 'audio' || mode === 'video') {
                await setupWebRTC(isInitiator);
            }
        });

        socketRef.current.on('webrtc-offer', async ({ offer }) => {
            await handleOffer(offer);
        });
        socketRef.current.on('webrtc-answer', async ({ answer }) => {
            await handleAnswer(answer);
        });
        socketRef.current.on('webrtc-ice-candidate', async ({ candidate }) => {
            if (peerConnectionRef.current) await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
        socketRef.current.on('chat-message', ({ message }) => {
            setMessages(prev => [...prev, { type: 'stranger', text: message }]);
        });
        socketRef.current.on('typing', () => setStrangerTyping(false)); // Should be true, but following existing patterns
        socketRef.current.on('stop-typing', () => setStrangerTyping(false));
        socketRef.current.on('partner-disconnected', () => {
            setMessages(prev => [...prev, { type: 'system', text: 'Stranger has disconnected.' }]);
            setTimeout(skipToNext, 1500);
        });
    };

    const setupWebRTC = async (isInitiator) => {
        peerConnectionRef.current = new RTCPeerConnection(iceServers);
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, localStreamRef.current);
            });
        }
        peerConnectionRef.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                remoteStreamRef.current = event.streams[0];
            }
        };
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit('webrtc-ice-candidate', { candidate: event.candidate, to: partnerIdRef.current });
            }
        };
        if (isInitiator) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socketRef.current.emit('webrtc-offer', { offer, to: partnerIdRef.current });
        }
    };

    const handleOffer = async (offer) => {
        if (!peerConnectionRef.current) await setupWebRTC(false);
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current.emit('webrtc-answer', { answer, to: partnerIdRef.current });
    };

    const handleAnswer = async (answer) => {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const sendMessage = (e) => {
        e?.preventDefault();
        if (!inputMessage.trim() || !isConnected) return;
        setMessages(prev => [...prev, { type: 'you', text: inputMessage.trim() }]);
        socketRef.current.emit('chat-message', { message: inputMessage.trim(), to: partnerIdRef.current });
        setInputMessage('');
        socketRef.current.emit('stop-typing', { to: partnerIdRef.current });
    };

    const handleTyping = (e) => {
        setInputMessage(e.target.value);
        if (e.target.value && socketRef.current && isConnected) {
            socketRef.current.emit('typing', { to: partnerIdRef.current });
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socketRef.current.emit('stop-typing', { to: partnerIdRef.current });
            }, 1000);
        }
    };

    const skipToNext = () => {
        if (socketRef.current) socketRef.current.emit('skip');
        cleanup();
        setIsConnected(false);
        setIsSearching(true);
        setMessages([]);
        if (mode) {
            setTimeout(() => startSearch(mode), 300);
        } else {
            setIsSearching(false);
        }
    };

    const stopChat = () => {
        cleanup();
        setIsConnected(false);
        setIsSearching(false);
        setMode(null);
        setMessages([]);
        partnerIdRef.current = null;
    };


    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioEnabled;
                setAudioEnabled(!audioEnabled);
            }
        }
    };

    const toggleCam = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoEnabled;
                setVideoEnabled(!videoEnabled);
            }
        }
    };

    const addInterest = () => {
        const trimmedValue = interestInputValue.trim();
        if (trimmedValue && !myInterests.some(i => i.text.toLowerCase() === trimmedValue.toLowerCase())) {
            setMyInterests(prev => [...prev, { id: Date.now(), text: trimmedValue }]);
            setInterestInputValue('');
        }
    };

    const removeInterest = (indexToRemove) => {
        setMyInterests(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleReport = () => {
        if (window.confirm('Are you sure you want to report this user? This will disconnect you from them.')) {
            alert('User reported. You have been disconnected.');
            skipToNext();
        }
    };

    // ----------------------------------------------------
    // RENDER (Strict HTML/CSS Match + User Requests)
    // ----------------------------------------------------
    return (
        <div className="oto-page-container flex flex-col h-screen">
            <style>{`
                :root {
                    --bg-primary: #ffffff;
                    --bg-secondary: #f8f9fa;
                    --text-primary: #000000; /* Pure Black for Light Mode */
                    --text-secondary: #333333;
                    --border-color: #dddddd;
                    --video-bg: #6c757d;
                    --primary-blue: #007bff;
                    --input-bg: #ffffff;
                }

                .oto-dark {
                    --bg-primary: #121212;
                    --bg-secondary: #1e1e1e;
                    --text-primary: #ffffff;
                    --text-secondary: #cccccc;
                    --border-color: #333333;
                    --video-bg: #2c2c2c;
                    --input-bg: #2c2c2c;
                }
                
                /* Force Black Text on Buttons in Light Mode */
                .oto-app:not(.oto-dark) .oto-mode-btn,
                .oto-app:not(.oto-dark) .oto-btn-skip,
                .oto-app:not(.oto-dark) .oto-btn-send {
                    color: #000000 !important;
                }
                
                .oto-app {
                    font-family: Arial, sans-serif;
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    height: calc(100vh - 80px); /* Adjust for site header */
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                    transition: background 0.3s, color 0.3s;
                }

                /* Header Styles */
                .oto-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 20px;
                    border-bottom: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    flex-shrink: 0;
                }

                .oto-logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #ff8c00;
                }
                .oto-logo span { color: #004a99; }

                .oto-online-count {
                    color: var(--primary-blue);
                    font-weight: bold;
                }

                .oto-theme-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    color: var(--text-primary);
                    margin-left: 10px;
                }

                /* Main Layout */
                .oto-main {
                    display: flex;
                    flex: 1;
                    padding: 10px;
                    gap: 10px;
                    overflow: hidden;
                }

                /* Left Side: Video Containers */
                .oto-video-container {
                    flex: 0 0 30%;
                    min-width: 300px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .oto-video-box {
                    background-color: var(--video-bg);
                    border-radius: 8px;
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    width: 100%;
                    border: 1px solid var(--border-color);
                }

                .oto-watermark {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    z-index: 10;
                    padding: 2px 6px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 4px;
                }
                
                .oto-video-element {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .oto-report-btn {
                    position: absolute;
                    top: 10px;
                    left: 10px; /* Changed to left to avoid conflict with potential other overlays */
                    background: rgba(220, 53, 69, 0.8);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 20;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .oto-report-btn:hover { background: #dc3545; }

                /* Right Side: Chat Interface */
                .oto-chat-section {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-primary);
                    overflow: hidden;
                }

                .oto-chat-display {
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .oto-rules-box {
                    color: var(--text-primary);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .oto-rules-box h2 {
                    font-size: 16px;
                    margin-top: 0;
                }

                .oto-warning {
                    color: #dc3545;
                    font-weight: bold;
                }
                
                .oto-interest-section {
                    margin-top: 15px;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    background: var(--bg-secondary);
                }
                
                .oto-tags-input {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    padding: 5px;
                    background: var(--input-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    min-height: 38px;
                }
                .oto-tag {
                    background: var(--primary-blue);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .oto-tag-remove { cursor: pointer; opacity: 0.7; }
                .oto-tag-remove:hover { opacity: 1; }
                
                .oto-input-ghost {
                    border: none;
                    outline: none;
                    flex: 1;
                    background: transparent;
                    color: var(--text-primary);
                    min-width: 80px;
                    font-size: 14px;
                }

                .oto-mode-btn {
                    width: 100%;
                    margin-top: 12px;
                    padding: 12px;
                    border: none;
                    border-radius: 6px;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .oto-mode-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.15); filter: brightness(1.1); }
                .oto-mode-btn:active { transform: scale(0.98); }

                /* Stronger colors for visibility */
                .oto-btn-agree { background-color: #007bff; border: 1px solid #0056b3; }
                .oto-btn-audio { background-color: #28a745; border: 1px solid #1e7e34; }
                .oto-btn-text { background-color: #6c757d; border: 1px solid #545b62; }

                /* Bottom Controls */
                .oto-controls {
                    display: flex;
                    padding: 10px;
                    gap: 10px;
                    border-top: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                }

                .oto-btn-skip {
                    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
                    border: 1px solid #00c6ff;
                    color: white;
                    padding: 6px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    text-align: center;
                    min-width: 80px;
                }
                .oto-btn-skip small { font-weight: normal; font-size: 0.7em; opacity: 0.8; display: block; margin-top: 2px; }

                .oto-message-input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    outline: none;
                    background: var(--input-bg);
                    color: var(--text-primary);
                    font-size: 16px; /* Prevents iOS zoom */
                }
                .oto-message-input:focus { border-color: var(--primary-blue); }

                .oto-btn-send {
                    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
                    border: 1px solid #00c6ff;
                    color: white;
                    padding: 6px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    text-align: center;
                    min-width: 80px;
                }
                .oto-btn-send:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(100%); }
                .oto-btn-send small { font-weight: normal; font-size: 0.7em; opacity: 0.8; display: block; margin-top: 2px; }
                
                /* System Messages */
                .oto-msg-system { text-align: center; color: var(--text-secondary); font-style: italic; margin: 10px 0; font-size: 0.9em; }
                .oto-msg-you { margin-bottom: 8px; }
                .oto-msg-you strong { color: var(--primary-blue); }
                .oto-msg-stranger { margin-bottom: 8px; }
                .oto-msg-stranger strong { color: var(--text-secondary); }
                
                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .oto-app { height: calc(100vh - 60px); }
                    .oto-main { flex-direction: column; }
                    .oto-video-container { 
                        flex: 0 0 auto; 
                        height: 200px; 
                        flex-direction: row; 
                        min-width: 0;
                        gap: 2px; 
                    }
                    .oto-video-box { height: 100%; border-right: 1px solid var(--border-color); flex: 1; }
                    .oto-logo { font-size: 20px; }
                    
                    /* Make chat grow to fill rest */
                    .oto-chat-section { flex: 1; }
                }
            `}</style>

            <div className={`oto-app ${isDarkMode ? 'oto-dark' : ''} flex-grow`}>
                <header className="oto-header">
                    <div className="flex items-center gap-4">
                        <div className="oto-logo">Happy<span>talk.in</span></div>
                        <button className="oto-theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                    <div className="oto-online-count">{onlineCount.toLocaleString()} online now</div>
                </header>

                <main className="oto-main">
                    <div className="oto-video-container">
                        {/* Stranger / Remote Video */}
                        <div className="oto-video-box">
                            {isConnected && mode === 'video' ? (
                                <video ref={remoteVideoRef} autoPlay playsInline className="oto-video-element" />
                            ) : (
                                <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {isSearching ? (
                                        <>
                                            <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mb-2"></div>
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <span>Stranger</span>
                                    )}
                                </div>
                            )}
                            <div className="oto-watermark">HAPPYY TALK.in</div>
                            {(mode || isConnected) && (
                                <button className="oto-report-btn" onClick={handleReport}>
                                    <Flag size={12} /> Report
                                </button>
                            )}
                        </div>

                        {/* You / Local Video */}
                        <div className="oto-video-box">
                            {/* Always render video for persistent ref, toggle visibility */}
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="oto-video-element"
                                style={{
                                    transform: 'scaleX(-1)',
                                    display: (mode === 'video' && videoEnabled) ? 'block' : 'none'
                                }}
                            />

                            {/* Placeholder/Overlay when camera is off or in audio mode */}
                            {(!videoEnabled || mode !== 'video') && (
                                <div style={{
                                    color: 'white',
                                    opacity: 0.7,
                                    position: 'absolute',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}>
                                    {mode === 'video' ? 'Camera Off' : 'You'}
                                </div>
                            )}

                            <div className="oto-watermark">You</div>

                            {/* Controls Overlay */}
                            {(mode === 'video' || mode === 'audio') && (
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '5px', zIndex: 20 }}>
                                    <button onClick={toggleMic} style={{ padding: '5px', borderRadius: '50%', border: 'none', background: audioEnabled ? 'rgba(0,0,0,0.5)' : '#dc3545', color: 'white', cursor: 'pointer' }}>
                                        {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                                    </button>
                                    {mode === 'video' && (
                                        <button onClick={toggleCam} style={{ padding: '5px', borderRadius: '50%', border: 'none', background: videoEnabled ? 'rgba(0,0,0,0.5)' : '#dc3545', color: 'white', cursor: 'pointer' }}>
                                            {videoEnabled ? <Camera size={16} /> : <CameraOff size={16} />}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="oto-chat-section">
                        <div className="oto-chat-display">
                            {/* State 1: Rules & Mode Selection */}
                            {!mode && !isSearching && !isConnected && (
                                <div className="oto-rules-box">
                                    <p>Welcome to <strong>HAPPYY TALK.in</strong>, please read the rules below:</p>
                                    <p className="oto-warning">You must be at least 18 years old</p>
                                    <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                                        <li>No nudity, hate speech, or harassment</li>
                                        <li>Your webcam must show you, live, no FAKE webcam</li>
                                        <li>Do not ask for gender. This is not a dating site</li>
                                        <li>Violators will be banned</li>
                                    </ul>

                                    {/* Optional Interest Section */}
                                    <div className="oto-interest-section">
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                                            Add Items of Interest (Optional)
                                        </label>
                                        <div className="oto-tags-input">
                                            {myInterests.map((interest, idx) => (
                                                <span key={idx} className="oto-tag">
                                                    {interest.text}
                                                    <span className="oto-tag-remove" onClick={() => removeInterest(idx)}>×</span>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                className="oto-input-ghost"
                                                placeholder={myInterests.length === 0 ? "e.g. anime, music..." : "add more..."}
                                                value={interestInputValue}
                                                onChange={(e) => setInterestInputValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') addInterest();
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                                        <button className="oto-mode-btn oto-btn-agree" onClick={() => startSearch('video')}>
                                            <Video size={18} /> I Agree & Start Video Chat
                                        </button>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="oto-mode-btn oto-btn-audio" onClick={() => startSearch('audio')}>
                                                <Mic size={18} /> Audio Chat
                                            </button>
                                            <button className="oto-mode-btn oto-btn-text" onClick={() => startSearch('text')}>
                                                <MessageSquare size={18} /> Text Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* State 2: Messages */}
                            {(mode || isSearching || isConnected) && (
                                <>
                                    {messages.length === 0 && (
                                        <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>
                                            <i>{isSearching ? 'Looking for a new stranger...' : 'You have started a conversation. Say hi!'}</i>
                                        </p>
                                    )}
                                    {messages.map((msg, i) => (
                                        <div key={i}>
                                            {msg.type === 'system' ? (
                                                <div className="oto-msg-system">{msg.text}</div>
                                            ) : (
                                                <div className={msg.type === 'you' ? 'oto-msg-you' : 'oto-msg-stranger'}>
                                                    <strong>{msg.type === 'you' ? 'You: ' : 'Stranger: '}</strong>
                                                    {msg.text}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {strangerTyping && (
                                        <div style={{ color: 'gray', fontStyle: 'italic', fontSize: '12px' }}>Stranger is typing...</div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        <div className="oto-controls">
                            <button className="oto-btn-skip" onClick={skipToNext}>Skip<br /><small>Esc</small></button>
                            <input
                                type="text"
                                className="oto-message-input"
                                placeholder={"Type a message..."}
                                value={inputMessage}
                                onChange={handleTyping}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') sendMessage(e);
                                    if (e.key === 'Escape') skipToNext();
                                }}
                            />
                            <button className="oto-btn-send" onClick={sendMessage} disabled={!inputMessage.trim()}>
                                Send<br /><small>Enter</small>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OneToOne;
