import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

const CalendarApp = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('calendarEvents');
        return saved ? JSON.parse(saved) : [];
    });
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', time: '12:00', color: '#3b82f6' });

    useEffect(() => {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }, [events]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    const getEventsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };

    const handleAddEvent = () => {
        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        setEvents([...events, { ...newEvent, date: dateStr, id: Date.now() }]);
        setNewEvent({ title: '', time: '12:00', color: '#3b82f6' });
        setShowEventModal(false);
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDate(day);
            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`aspect-square p-2 rounded-2xl cursor-pointer transition-all relative
            ${isToday(day) ? 'bg-blue-500 text-white font-bold' : 'hover:bg-white/10'}
            ${isSelected(day) && !isToday(day) ? 'bg-white/20 ring-2 ring-blue-400' : ''}
          `}
                >
                    <div className="text-center text-lg">{day}</div>
                    {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                            {dayEvents.slice(0, 3).map((event, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }} />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    const selectedDateEvents = getEventsForDate(selectedDate.getDate());

    return (
        <div className="min-h-[calc(100vh-200px)] bg-transparent p-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={previousMonth} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                                    <ChevronLeft className="text-white" size={24} />
                                </button>
                                <button onClick={nextMonth} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                                    <ChevronRight className="text-white" size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {dayNames.map(day => (
                                <div key={day} className="text-center text-gray-400 font-semibold text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-2 text-white">
                            {renderCalendarDays()}
                        </div>
                    </div>

                    {/* Events sidebar */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setShowEventModal(true)}
                                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                            >
                                <Plus className="text-white" size={20} />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {selectedDateEvents.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No events</p>
                            ) : (
                                selectedDateEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="p-4 rounded-2xl border border-white/10 relative group"
                                        style={{ backgroundColor: event.color + '20' }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold text-white mb-1">{event.title}</div>
                                                <div className="text-sm text-gray-300">{event.time}</div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 rounded-lg transition-all"
                                            >
                                                <X size={16} className="text-white" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEventModal(false)} />
                    <div className="relative bg-gray-900 rounded-3xl p-8 max-w-md w-full border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Add Event</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Event title"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="time"
                                value={newEvent.time}
                                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setNewEvent({ ...newEvent, color })}
                                        className={`w-10 h-10 rounded-xl transition-all ${newEvent.color === color ? 'ring-2 ring-white scale-110' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleAddEvent}
                                    disabled={!newEvent.title}
                                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
                                >
                                    Add Event
                                </button>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarApp;
