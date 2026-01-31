import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createRoomApi } from '../api/roomApi'; // Adjust path
import { languages } from '../data/roomsData'; // Import languages array
import { createGuestRoom } from '../utils/guestRoomManager';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [durationHours, setDurationHours] = useState(1); // Default 1 hour
    const [durationMinutes, setDurationMinutes] = useState(0);
    const [language, setLanguage] = useState('English'); // Default language
    const [maxCapacity, setMaxCapacity] = useState(0); // 0 = unlimited
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Room title cannot be empty.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // If user is not logged in, create a guest room
            if (!currentUser) {
                const guestRoomData = {
                    title: title.trim(),
                    topic: language,
                    language: language,
                    max_capacity: parseInt(maxCapacity, 10) || 0,
                };

                const newRoom = createGuestRoom(guestRoomData);

                // Show success message
                window.dispatchEvent(new CustomEvent('SHOW_ALERT', {
                    detail: {
                        message: `Room "${title}" created! It will auto-delete after 15 minutes of inactivity.`
                    }
                }));

                onRoomCreated(newRoom);
                setTitle('');
                setTopic('');
                setIsPrivate(false);
                setDurationHours(1);
                setDurationMinutes(0);
                setLanguage('English');
                setMaxCapacity(0);
                onClose();
                return;
            }

            // For logged-in users, use the API
            const hours = parseInt(durationHours, 10);
            const minutes = parseInt(durationMinutes, 10);

            if (isNaN(hours) || isNaN(minutes) || (hours === 0 && minutes === 0) || hours < 0 || minutes < 0 || hours > 24 || minutes >= 60) {
                setError('Invalid room duration. Hours (0-24), Minutes (0-59). Total must be > 0.');
                return;
            }
            if ((hours * 60 + minutes) < 5) {
                setError('Minimum room duration is 5 minutes.');
                return;
            }

            const roomData = {
                title: title.trim(),
                topic: language || null,
                is_private: isPrivate,
                duration_hours: hours,
                duration_minutes: minutes,
                language: language,
                max_capacity: parseInt(maxCapacity, 10) || 0,
            };
            const newRoom = await createRoomApi(roomData);
            onRoomCreated(newRoom);
            setTitle('');
            setTopic('');
            setIsPrivate(false);
            setDurationHours(1);
            setDurationMinutes(0);
            setLanguage('English');
            setMaxCapacity(0);
            onClose();
        } catch (err) {
            console.error("Create room error:", err);
            // Display the specific error message from the backend, or a fallback
            setError(err.message || 'Failed to create room. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    // Inline styles for immediate visibility fix
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1500
    };

    const modalStyle = {
        backgroundColor: '#181e29',
        padding: '20px',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '480px',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        border: '1px solid #374151'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                    aria-label="Close"
                    disabled={isLoading}
                >
                    ×
                </button>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    color: 'white'
                }}>Create New Room</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="roomTitle" style={{ color: '#d1d5db', fontSize: '1rem', fontWeight: '500' }}>
                            Room Title <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="roomTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#232a3a',
                                border: '1px solid #374151',
                                color: 'white'
                            }}
                            placeholder="e.g., Evening Spanish Chat"
                            required
                            maxLength={100}
                        />
                    </div>
                    {/* <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                        <label htmlFor="roomTopic" style={{color: '#d1d5db', fontSize: '1rem', fontWeight: '500'}}>
                            Topic <span style={{color: '#6b7280', fontStyle: 'italic', fontSize: '0.9em'}}>(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="roomTopic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#232a3a',
                                border: '1px solid #374151',
                                color: 'white'
                            }}
                            placeholder="e.g., Discussing hobbies"
                            maxLength={255}
                        />
                    </div> */}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="roomLanguage" style={{ color: '#d1d5db', fontSize: '1rem', fontWeight: '500' }}>
                            Language <span style={{ color: '#ef4444', fontWeight: 'bold' }}>*</span>
                        </label>
                        <select
                            id="roomLanguage"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#232a3a',
                                border: '1px solid #374151',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                            required
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="maxCapacity" style={{ color: '#d1d5db', fontSize: '1rem', fontWeight: '500' }}>
                            Max Participants <span style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '0.9em' }}>(0 = Unlimited)</span>
                        </label>
                        <input
                            type="number"
                            id="maxCapacity"
                            value={maxCapacity}
                            onChange={(e) => setMaxCapacity(Math.max(0, parseInt(e.target.value, 10) || 0))}
                            min="0"
                            max="100"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: '#232a3a',
                                border: '1px solid #374151',
                                color: 'white'
                            }}
                            placeholder="0 for unlimited, or enter max number"
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: isPrivate ? 'rgba(59, 130, 246, 0.1)' : 'rgba(42, 42, 42, 0.3)',
                        borderRadius: '8px',
                        border: isPrivate ? '2px solid #3b82f6' : '1px solid #374151',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                        onClick={() => setIsPrivate(!isPrivate)}>
                        <div style={{
                            position: 'relative',
                            width: '52px',
                            height: '28px',
                            backgroundColor: isPrivate ? '#3b82f6' : '#4b5563',
                            borderRadius: '14px',
                            marginRight: '12px',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '2px',
                                left: isPrivate ? '26px' : '2px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                transition: 'left 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="isPrivate"
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: isPrivate ? '#60a5fa' : '#d1d5db',
                                    cursor: 'pointer',
                                    display: 'block'
                                }}>
                                Make this room private
                            </label>
                            {isPrivate && (
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#9ca3af',
                                    marginTop: '4px'
                                }}>
                                    Only invited members can see and join
                                </p>
                            )}
                        </div>
                    </div>

                    {error && <p style={{ color: '#f87171', fontSize: '0.95rem', textAlign: 'center' }}>{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#374151',
                                color: '#d1d5db',
                                border: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                opacity: isLoading ? '0.7' : '1'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal; 