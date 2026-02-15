import React, { useState, useEffect } from 'react';

export const InstallModal = ({ onClose, isIOS, isFirefox }) => (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={onClose}>
        <div className="w-full max-w-sm rounded-[32px] bg-[#0f172a] p-8 text-center shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-[#38bdf8]/20 flex items-center justify-center">
                    <i className="fas fa-mobile-alt text-4xl text-[#38bdf8]"></i>
                </div>
            </div>
            <h3 className="mb-3 text-2xl font-black text-white uppercase tracking-tight">Install HAPPYY TALK</h3>
            <p className="mb-8 text-gray-400 font-medium text-sm">
                {isIOS
                    ? "Install this web app on your iPhone for the best experience."
                    : isFirefox
                        ? "Install this app from the Firefox menu."
                        : "Install our app for a better experience."}
            </p>

            <div className="space-y-4 text-left">
                {isIOS ? (
                    <>
                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]">1</span>
                            <span className="text-gray-300 font-medium text-sm">Tap the <span className="text-white font-bold">Share</span> button</span>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]">2</span>
                            <span className="text-gray-300 font-medium text-sm">Tap <span className="text-white font-bold">Add to Home Screen</span></span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]"><i className="fas fa-ellipsis-v"></i></span>
                            <span className="text-gray-300 font-medium text-sm">Open browser menu</span>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#38bdf8]/20 font-black text-[#38bdf8]"><i className="fas fa-download"></i></span>
                            <span className="text-gray-300 font-medium text-sm">Tap <span className="text-white font-bold">{isFirefox ? 'Install' : 'Add to Home screen'}</span></span>
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={onClose}
                className="mt-10 w-full rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] py-4 font-black uppercase tracking-widest text-white hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20"
            >
                Got it
            </button>
        </div>
    </div>
);

const PWAInstallButton = ({ renderButton }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isFirefox, setIsFirefox] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // 1. Detect iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);

        // 2. Detect Firefox
        const isFirefoxBrowser = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        setIsFirefox(isFirefoxBrowser);

        // 3. Handle Chrome/Edge/Brave Native Prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // 4. Check Standalone Mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone ||
            document.referrer.includes('android-app://');

        if (isStandalone) {
            setShowInstallButton(false);
        } else {
            // Show button if iOS or Firefox (since they don't fire beforeinstallprompt)
            if (isIosDevice || isFirefoxBrowser) {
                setShowInstallButton(true);
            }
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Native Chrome/Edge/Brave Prompt
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setShowInstallButton(false);
            }
        } else {
            // Show Manual Instructions (iOS, Firefox, or unsupported)
            setShowInstructions(true);
        }
    };

    if (!showInstallButton) return null;

    return (
        <>
            {renderButton({ onClick: handleInstallClick })}
            {showInstructions && <InstallModal onClose={() => setShowInstructions(false)} isIOS={isIOS} isFirefox={isFirefox} />}
        </>
    );
};

export default PWAInstallButton;
