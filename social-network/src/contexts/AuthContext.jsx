import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function signup(email, password, username) {
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    },
                },
            });

            if (signUpError) throw signUpError;
            return data.user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function login(email, password) {
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;
            return data.user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function signInWithGoogle() {
        try {
            const { data, error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (googleError) throw googleError;
            return data.user;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function logout() {
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function resetPassword(email) {
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (resetError) throw resetError;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function updateUserProfile(profile) {
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                data: profile,
            });
            if (updateError) throw updateError;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    useEffect(() => {
        let mounted = true;
        const timeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth loading timed out, forcing render');
                setLoading(false);
            }
        }, 3000);

        let subscription = null;
        try {
            const { data } = supabase.auth.onAuthStateChange((event, session) => {
                if (mounted) {
                    if (session) {
                        setCurrentUser(session.user);
                    } else {
                        setCurrentUser(null);
                    }
                    setLoading(false);
                }
            });
            subscription = data?.subscription;
        } catch (err) {
            console.error("Supabase auth subscription failed:", err);
            if (mounted) setLoading(false);
        }

        return () => {
            mounted = false;
            clearTimeout(timeout);
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        signInWithGoogle,
        updateUserProfile,
        error,
        setError
    };



    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
