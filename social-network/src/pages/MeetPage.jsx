import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MeetPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [iframeSrc, setIframeSrc] = useState('/newcall');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const room = params.get('room');
        const name = params.get('name');

        // Construct the URL for the iframe based on query parameters
        // If room is present, we go to the join page
        if (room) {
            let src = `/join/${encodeURIComponent(room)}`;
            if (name) {
                src += `?name=${encodeURIComponent(name)}`;
            }
            setIframeSrc(src);
        } else {
            // Otherwise show the landing page or new call page
            // Since we are proxying /meet to /, we can use / to show landing
            // But if we want to avoid the Mirotalk landing page taking over links, maybe /newcall is safer
            setIframeSrc('/newcall');
        }
    }, [location]);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#000' }}>
            {isLoading && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', flexDirection: 'column'
                }}>
                    <div className="loader-shorts"></div>
                    <p style={{ marginTop: '10px' }}>Loading Meeting Interface...</p>
                </div>
            )}
            <iframe
                src={iframeSrc}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
                onLoad={() => setIsLoading(false)}
                title="HappyyTalk Meet"
            />
        </div>
    );
};


export default MeetPage;
