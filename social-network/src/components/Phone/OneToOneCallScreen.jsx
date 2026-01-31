import React, { useState } from 'react';

const OneToOneCallScreen = () => {
    const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected
    const [cameraOn, setCameraOn] = useState(false);

    const handleStartCall = () => {
        setCallStatus('calling');
        // Simulate connection after a delay
        setTimeout(() => {
            setCallStatus('connected');
        }, 2000);
    };

    const handleCancelCall = () => {
        setCallStatus('idle');
        setCameraOn(false);
    };

    const toggleCamera = () => {
        setCameraOn(!cameraOn);
    };

    return (
        <div className="h-full bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative">
            <div className={`absolute inset-0 bg-black z-0 ${cameraOn ? 'block' : 'hidden'}`}>
                {/* Simulated Camera View */}
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Camera Active</span>
                </div>
            </div>

            <div className="z-10 flex flex-col items-center gap-8 w-full">
                {callStatus === 'idle' && (
                    <>
                        <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700 shadow-lg">
                            <i className="fas fa-user text-5xl text-gray-400"></i>
                        </div>
                        <h2 className="text-2xl font-bold">Start a Call</h2>
                        <button
                            onClick={handleStartCall}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-lg"
                        >
                            <i className="fas fa-phone-alt"></i> Call Now
                        </button>
                        <button
                            onClick={toggleCamera}
                            className={`w-full py-3 ${cameraOn ? 'bg-blue-600' : 'bg-gray-700'} hover:opacity-90 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2`}
                        >
                            <i className={`fas ${cameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
                            {cameraOn ? 'Camera On' : 'Open Camera'}
                        </button>
                    </>
                )}

                {callStatus === 'calling' && (
                    <>
                        <div className="w-40 h-40 rounded-full bg-gray-800 flex items-center justify-center border-4 border-blue-500 shadow-lg animate-pulse">
                            <i className="fas fa-user text-6xl text-gray-400"></i>
                        </div>
                        <h2 className="text-2xl font-bold animate-bounce">Calling...</h2>
                        <button
                            onClick={handleCancelCall}
                            className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                        >
                            <i className="fas fa-phone-slash text-2xl"></i>
                        </button>
                    </>
                )}

                {callStatus === 'connected' && (
                    <>
                        <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg border-2 border-white shadow-lg overflow-hidden">
                            {/* Self view */}
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                <i className="fas fa-user text-gray-500"></i>
                            </div>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <h2 className="text-xl font-semibold">User 123</h2>
                        </div>

                        <div className="w-full flex justify-around items-center pb-8">
                            <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
                                <i className="fas fa-microphone"></i>
                            </button>
                            <button
                                onClick={handleCancelCall}
                                className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            >
                                <i className="fas fa-phone-slash text-2xl"></i>
                            </button>
                            <button
                                onClick={toggleCamera}
                                className={`w-12 h-12 rounded-full ${cameraOn ? 'bg-white text-black' : 'bg-gray-700 text-white'} flex items-center justify-center hover:opacity-90`}
                            >
                                <i className={`fas ${cameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OneToOneCallScreen;
