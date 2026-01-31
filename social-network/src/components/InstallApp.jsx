import React, { useState, useEffect } from 'react';
import { FaDownload, FaApple } from 'react-icons/fa';

const InstallApp = ({ className }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        if (isStandalone) return;

        // Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);

        if (isIosDevice) {
            setShowInstallButton(true);
        }

        // Handle Android/Desktop install prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async (e) => {
        e.stopPropagation(); // Prevent parent clicks
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallButton(false);
        }
        setDeferredPrompt(null);
    };

    if (!showInstallButton) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className={className || "fixed bottom-20 right-4 z-[9999] flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-500 active:scale-95 animate-bounce"}
            >
                {isIOS ? <FaApple className="text-lg" /> : <FaDownload className="text-lg" />}
                <span>Install App</span>
            </button>

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setShowIOSInstructions(false)}>
                    <div className="w-full max-w-sm rounded-2xl bg-gray-900 p-6 text-center shadow-2xl border border-gray-800" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex justify-center text-blue-500">
                            <FaApple className="text-5xl" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-white">Install HAPPYY TALK</h3>
                        <p className="mb-6 text-gray-400">
                            Install this web app on your iPhone for the best experience. It's free and takes up almost no space.
                        </p>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4 rounded-xl bg-gray-800 p-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 font-bold text-white">1</span>
                                <span className="text-gray-300">Tap the <span className="font-bold text-blue-400">Share</span> button below</span>
                            </div>
                            <div className="flex items-center gap-4 rounded-xl bg-gray-800 p-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 font-bold text-white">2</span>
                                <span className="text-gray-300">Scroll down and tap <span className="font-bold text-white">Add to Home Screen</span></span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="mt-8 start-full w-full rounded-xl bg-gray-800 py-3 font-semibold text-white hover:bg-gray-700"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallApp;
