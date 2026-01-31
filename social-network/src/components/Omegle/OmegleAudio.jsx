import React, { useRef, useEffect, useState } from 'react';

const OmegleAudio = ({ partnerId, onEnd, onNext }) => {
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [waveHeights, setWaveHeights] = useState(Array(20).fill(0));

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log('Mic access denied');
      }
    };
    
    initAudio();

    // Cleanup: stop all tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Animate waveform
    const interval = setInterval(() => {
      setWaveHeights(Array(20).fill(0).map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="omegle-audio-chat">
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
      
      <div className="audio-container">
        <div className="audio-avatar">
          <div className="avatar-circle">
            <span className="avatar-emoji">👤</span>
          </div>
        </div>

        <div className="waveform-container">
          <div className="waveform">
            {waveHeights.map((height, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <h2 className="audio-status">Connected 🎤</h2>
      </div>

      <div className="audio-controls">
        <button 
          className={`control-btn ${isMuted ? 'disabled' : ''}`}
          onClick={toggleMute}
          title="Mute/Unmute"
        >
          {isMuted ? '🔇' : '🎤'}
        </button>

        <button 
          className="control-btn next-btn"
          onClick={onNext}
          title="Next Person"
        >
          ➡️ Next
        </button>

        <button 
          className="control-btn end-btn"
          onClick={onEnd}
          title="End Call"
        >
          ❌ End
        </button>
      </div>
    </div>
  );
};

export default OmegleAudio;
