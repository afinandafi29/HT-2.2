import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/config';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          // Successfully signed in
          navigate('/', { replace: true });
        } else {
          // No session found after OAuth redirect
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/in'), 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication failed. Please try again.');
        setTimeout(() => navigate('/in'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-red-500 mb-4">
          <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
          <p className="text-xl">{error}</p>
        </div>
        <p className="text-gray-400">Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-xl text-gray-400">Completing sign in...</p>
    </div>
  );
} 