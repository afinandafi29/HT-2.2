import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Meeting = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const { currentUser } = useAuth();

    const userName = searchParams.get('name') || currentUser?.username || 'User';

    // Determine the base URL for MiroTalk
    let baseUrl = 'https://meet.happyytalk.in';
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.');

    if (isLocal) {
        baseUrl = `http://${hostname}:3001`;
    }

    const meetingUrl = `${baseUrl}/join/${encodeURIComponent(roomId)}?name=${encodeURIComponent(userName)}`;

    useEffect(() => {
        // You could also redirect here if you don't want an iframe:
        // window.location.href = meetingUrl;
    }, [meetingUrl]);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
            <iframe
                src={meetingUrl}
                allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
                title="MiroTalk Meeting"
            />
        </div>
    );
};

export default Meeting;
