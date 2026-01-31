import React, { useState, useEffect } from 'react';
import { Clock, Timer, Plus, X, Play, Pause, RotateCcw } from 'lucide-react';

const ClockApp = () => {
    const [activeTab, setActiveTab] = useState('clock');
    const [time, setTime] = useState(new Date());

    // Alarm state
    const [alarms, setAlarms] = useState(() => {
        const saved = localStorage.getItem('alarms');
        return saved ? JSON.parse(saved) : [];
    });
    const [showAlarmModal, setShowAlarmModal] = useState(false);
    const [newAlarmTime, setNewAlarmTime] = useState('12:00');

    // Timer state
    const [timerMinutes, setTimerMinutes] = useState(5);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerTime, setTimerTime] = useState(0);

    // Stopwatch state
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [stopwatchRunning, setStopwatchRunning] = useState(false);
    const [laps, setLaps] = useState([]);

    // Clock update
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Save alarms
    useEffect(() => {
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }, [alarms]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (timerRunning && timerTime > 0) {
            interval = setInterval(() => {
                setTimerTime(prev => {
                    if (prev <= 1) {
                        setTimerRunning(false);
                        alert('Timer finished!');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerRunning, timerTime]);

    // Stopwatch logic
    useEffect(() => {
        let interval;
        if (stopwatchRunning) {
            interval = setInterval(() => {
                setStopwatchTime(prev => prev + 10);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [stopwatchRunning]);

    const addAlarm = () => {
        setAlarms([...alarms, { id: Date.now(), time: newAlarmTime, enabled: true }]);
        setShowAlarmModal(false);
        setNewAlarmTime('12:00');
    };

    const toggleAlarm = (id) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    const deleteAlarm = (id) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const startTimer = () => {
        setTimerTime(timerMinutes * 60 + timerSeconds);
        setTimerRunning(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const formatStopwatch = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    };

    const addLap = () => {
        setLaps([...laps, stopwatchTime]);
    };

    const resetStopwatch = () => {
        setStopwatchTime(0);
        setStopwatchRunning(false);
        setLaps([]);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent p-6">
            <div className="max-w-4xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white/5 p-2 rounded-3xl backdrop-blur-xl border border-white/10">
                    {[
                        { id: 'clock', icon: Clock, label: 'Clock' },
                        { id: 'alarm', icon: Timer, label: 'Alarm' },
                        { id: 'timer', icon: Timer, label: 'Timer' },
                        { id: 'stopwatch', icon: Timer, label: 'Stopwatch' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
                ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 min-h-[500px]">
                    {/* Clock Tab */}
                    {activeTab === 'clock' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-8xl font-light text-white mb-4 tracking-tight">
                                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                            </div>
                            <div className="text-2xl text-gray-400">
                                {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    )}

                    {/* Alarm Tab */}
                    {activeTab === 'alarm' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Alarms</h2>
                                <button
                                    onClick={() => setShowAlarmModal(true)}
                                    className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                                >
                                    <Plus className="text-white" size={24} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {alarms.length === 0 ? (
                                    <p className="text-gray-400 text-center py-12">No alarms set</p>
                                ) : (
                                    alarms.map(alarm => (
                                        <div key={alarm.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl font-light text-white">{alarm.time}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleAlarm(alarm.id)}
                                                    className={`w-14 h-8 rounded-full transition-colors relative ${alarm.enabled ? 'bg-blue-500' : 'bg-gray-600'}`}
                                                >
                                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${alarm.enabled ? 'right-1' : 'left-1'}`} />
                                                </button>
                                                <button onClick={() => deleteAlarm(alarm.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                                                    <X className="text-red-400" size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timer Tab */}
                    {activeTab === 'timer' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            {!timerRunning && timerTime === 0 ? (
                                <div className="space-y-6 w-full max-w-sm">
                                    <div className="flex gap-4 justify-center">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Minutes</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={timerMinutes}
                                                onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                                                className="w-24 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Seconds</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={timerSeconds}
                                                onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                                                className="w-24 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={startTimer}
                                        disabled={timerMinutes === 0 && timerSeconds === 0}
                                        className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-colors"
                                    >
                                        Start Timer
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="text-8xl font-light text-white text-center">
                                        {formatTime(timerTime)}
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setTimerRunning(!timerRunning)}
                                            className="p-6 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                                        >
                                            {timerRunning ? <Pause className="text-white" size={32} /> : <Play className="text-white" size={32} />}
                                        </button>
                                        <button
                                            onClick={() => { setTimerRunning(false); setTimerTime(0); }}
                                            className="p-6 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                        >
                                            <RotateCcw className="text-white" size={32} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stopwatch Tab */}
                    {activeTab === 'stopwatch' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-7xl font-light text-white mb-8">
                                {formatStopwatch(stopwatchTime)}
                            </div>
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={() => setStopwatchRunning(!stopwatchRunning)}
                                    className="p-6 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                                >
                                    {stopwatchRunning ? <Pause className="text-white" size={32} /> : <Play className="text-white" size={32} />}
                                </button>
                                {stopwatchRunning && (
                                    <button
                                        onClick={addLap}
                                        className="px-8 py-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-full transition-colors"
                                    >
                                        Lap
                                    </button>
                                )}
                                <button
                                    onClick={resetStopwatch}
                                    className="p-6 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                >
                                    <RotateCcw className="text-white" size={32} />
                                </button>
                            </div>
                            {laps.length > 0 && (
                                <div className="w-full max-w-md space-y-2 max-h-48 overflow-y-auto">
                                    {laps.map((lap, i) => (
                                        <div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                            <span className="text-gray-400">Lap {laps.length - i}</span>
                                            <span className="text-white font-mono">{formatStopwatch(lap)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Alarm Modal */}
            {showAlarmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAlarmModal(false)} />
                    <div className="relative bg-gray-900 rounded-3xl p-8 max-w-sm w-full border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Set Alarm</h3>
                        <input
                            type="time"
                            value={newAlarmTime}
                            onChange={(e) => setNewAlarmTime(e.target.value)}
                            className="w-full px-4 py-4 bg-white/10 border border-white/10 rounded-xl text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={addAlarm}
                                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
                            >
                                Add Alarm
                            </button>
                            <button
                                onClick={() => setShowAlarmModal(false)}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClockApp;
