import React, { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';

const CompassApp = () => {
    const [heading, setHeading] = useState(0);
    const [permission, setPermission] = useState('prompt');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if device orientation is supported
        if (!window.DeviceOrientationEvent) {
            setError('Device orientation not supported on this device');
            return;
        }

        const handleOrientation = (event) => {
            if (event.webkitCompassHeading !== undefined) {
                // iOS
                setHeading(event.webkitCompassHeading);
            } else if (event.alpha !== null) {
                // Android
                const compassHeading = 360 - event.alpha;
                setHeading(compassHeading);
            }
        };

        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            setPermission('prompt');
        } else {
            // For devices that don't need permission
            window.addEventListener('deviceorientation', handleOrientation);
            setPermission('granted');
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const requestPermission = async () => {
        try {
            const response = await DeviceOrientationEvent.requestPermission();
            setPermission(response);

            if (response === 'granted') {
                window.addEventListener('deviceorientation', (event) => {
                    if (event.webkitCompassHeading !== undefined) {
                        setHeading(event.webkitCompassHeading);
                    } else if (event.alpha !== null) {
                        const compassHeading = 360 - event.alpha;
                        setHeading(compassHeading);
                    }
                });
            }
        } catch (error) {
            setError('Permission denied');
        }
    };

    const getDirection = (degrees) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    const getDirectionName = (degrees) => {
        const directions = [
            'North', 'North-East', 'East', 'South-East',
            'South', 'South-West', 'West', 'North-West'
        ];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-[50px] p-12 shadow-2xl border border-white/10">
                    {error ? (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Navigation size={48} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Compass Not Available</h2>
                            <p className="text-gray-400">{error}</p>
                        </div>
                    ) : permission === 'prompt' ? (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Navigation size={48} className="text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Enable Compass</h2>
                            <p className="text-gray-400 mb-8">
                                This app needs access to your device's orientation sensor to work.
                            </p>
                            <button
                                onClick={requestPermission}
                                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-colors"
                            >
                                Enable Compass
                            </button>
                        </div>
                    ) : permission === 'denied' ? (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Navigation size={48} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Permission Denied</h2>
                            <p className="text-gray-400">
                                Please enable device orientation in your browser settings.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Compass Display */}
                            <div className="relative w-full aspect-square max-w-md mx-auto">
                                {/* Compass Circle */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-white/20 shadow-2xl">
                                    {/* Degree Markers */}
                                    <div
                                        className="absolute inset-0 transition-transform duration-300 ease-out"
                                        style={{ transform: `rotate(${-heading}deg)` }}
                                    >
                                        {/* Cardinal Directions */}
                                        {[
                                            { dir: 'N', deg: 0, color: 'text-red-400' },
                                            { dir: 'E', deg: 90, color: 'text-white' },
                                            { dir: 'S', deg: 180, color: 'text-white' },
                                            { dir: 'W', deg: 270, color: 'text-white' }
                                        ].map(({ dir, deg, color }) => (
                                            <div
                                                key={dir}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                style={{
                                                    transform: `rotate(${deg}deg) translateY(-${45}%)`,
                                                    transformOrigin: 'center'
                                                }}
                                            >
                                                <div
                                                    className={`text-3xl font-black ${color}`}
                                                    style={{ transform: `rotate(${-deg}deg)` }}
                                                >
                                                    {dir}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Degree Marks */}
                                        {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => (
                                            <div
                                                key={deg}
                                                className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
                                                style={{ transform: `rotate(${deg}deg)` }}
                                            >
                                                <div className={`w-0.5 mx-auto ${deg % 30 === 0 ? 'h-6 bg-white' : 'h-3 bg-white/30'}`} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Center Dot */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />

                                    {/* North Arrow (Fixed) */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="relative w-0 h-0">
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[80px] border-b-red-500 drop-shadow-lg" />
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[80px] border-t-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Heading Info */}
                            <div className="text-center space-y-4">
                                <div>
                                    <div className="text-6xl font-light text-white mb-2">
                                        {Math.round(heading)}°
                                    </div>
                                    <div className="text-3xl font-bold text-blue-400">
                                        {getDirection(heading)}
                                    </div>
                                    <div className="text-xl text-gray-400 mt-2">
                                        {getDirectionName(heading)}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 text-sm text-gray-400">
                                    <p>Keep your device flat for accurate readings</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompassApp;
