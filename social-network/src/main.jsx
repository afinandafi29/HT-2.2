import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <SocketProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
