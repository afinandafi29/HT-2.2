import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { currentUser } = useAuth();
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

    useEffect(() => {
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    }, [backendUrl]);

    useEffect(() => {
        if (socket && currentUser) {
            socket.emit('join_user', currentUser.id);
        }
    }, [socket, currentUser]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
