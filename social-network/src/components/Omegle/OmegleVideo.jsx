import React, { useRef, useEffect, useState } from 'react';

const OmegleVideo = ({ partnerId, onEnd, onNext }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Initialize video stream
    const initVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log('Camera/mic access denied or not available');
      }
    };
    
    initVideo();

    // Cleanup: stop all tracks when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className="omegle-video-chat">
      <div className="video-container">
        <video 
          ref={remoteVideoRef} 
          className="remote-video"
          autoPlay 
          playsInline
          style={{ background: '#1a1a1a' }}
        />
        
        <video 
          ref={localVideoRef} 
          className="local-video"
          autoPlay 
          playsInline 
          muted
        />
      </div>

      <div className="video-controls">
        <button 
          className={`control-btn ${isMuted ? 'disabled' : ''}`}
          onClick={toggleMute}
          title="Mute/Unmute"
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        
        <button 
          className={`control-btn ${isCameraOff ? 'disabled' : ''}`}
          onClick={toggleCamera}
          title="Camera On/Off"
        >
          {isCameraOff ? '📷' : '📹'}
        </button>

        <button 
          className="control-btn report-btn"
          onClick={() => setShowReport(true)}
          title="Report User"
        >
          🚩
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

      {showReport && (
        <div className="report-modal">
          <div className="report-content">
            <h3>Report User</h3>
            <select className="report-reason">
              <option value="">Select reason</option>
              <option value="harassment">Harassment</option>
              <option value="nudity">Nudity</option>
              <option value="hate">Hate Speech</option>
              <option value="spam">Spam</option>
              <option value="other">Other</option>
            </select>
            <button className="report-submit">Submit Report</button>
            <button className="report-close" onClick={() => setShowReport(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OmegleVideo;
