import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import OmegleSearching from '../components/Omegle/OmegleSearching';
import OmegleVideo from '../components/Omegle/OmegleVideo';
import OmegleAudio from '../components/Omegle/OmegleAudio';
import OmegleText from '../components/Omegle/OmegleText';
import ActionButtons from '../components/ActionButtons';
import '../styles/omegle.css';

const OmegleSession = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const interest = searchParams.get('interest') || 'general';
  const [status, setStatus] = useState('searching');
  const [sessionId] = useState(() => `session-${Math.random().toString(36).substr(2, 9)}`);
  const [userId] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [partnerId, setPartnerId] = useState(null);
  const matchTimeoutRef = useRef(null);

  useEffect(() => {
    // Simulate matching after 2-5 seconds
    matchTimeoutRef.current = setTimeout(() => {
      setPartnerId(`user-${Math.random().toString(36).substr(2, 9)}`);
      setStatus('connected');
    }, 2000 + Math.random() * 3000);

    return () => {
      if (matchTimeoutRef.current) {
        clearTimeout(matchTimeoutRef.current);
      }
    };
  }, []);

  const handleEndCall = () => {
    setPartnerId(null);
    setStatus('ended');
    setTimeout(() => {
      navigate('/1to1');
    }, 1000);
  };

  const handleNext = () => {
    setPartnerId(null);
    setStatus('searching');
    matchTimeoutRef.current = setTimeout(() => {
      setPartnerId(`user-${Math.random().toString(36).substr(2, 9)}`);
      setStatus('connected');
    }, 2000 + Math.random() * 3000);
  };

  return (
    <div className="omegle-session p-4">
      <ActionButtons />
      {status === 'searching' && <OmegleSearching mode={mode} interest={interest} />}
      {status === 'connected' && mode === 'video' && (
        <OmegleVideo partnerId={partnerId} onEnd={handleEndCall} onNext={handleNext} />
      )}
      {status === 'connected' && mode === 'audio' && (
        <OmegleAudio partnerId={partnerId} onEnd={handleEndCall} onNext={handleNext} />
      )}
      {status === 'connected' && mode === 'text' && (
        <OmegleText partnerId={partnerId} onEnd={handleEndCall} onNext={handleNext} />
      )}
      {status === 'ended' && (
        <div className="omegle-ended">
          <h2>Chat Ended</h2>
          <p>Thanks for chatting!</p>
          <button onClick={() => navigate('/1to1')}>Back to Home</button>
        </div>
      )}
    </div>
  );
};

export default OmegleSession;
