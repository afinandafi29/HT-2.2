import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'boxicons/css/boxicons.min.css';
import '../styles/login.css';

const AuthForm = () => {
    const [isActive, setIsActive] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { signup, login, signInWithGoogle, error: authError, setError } = useAuth();
    const navigate = useNavigate();

    const validateForm = (isLogin = false) => {
        const newErrors = {};

        if (!formData.username.trim() && !isLogin) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (authError) {
            setError('');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm(true)) return;

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signup(formData.email, formData.password, formData.username);
            navigate('/in');
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        setLoading(true);
        try {
            await signInWithGoogle();
            // No need to navigate manually as AuthCallback will handle it
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError(error.message || 'Failed to sign in with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        setIsActive(true);
        setErrors({});
        setError('');
    };

    const handleLoginClick = () => {
        setIsActive(false);
        setErrors({});
        setError('');
    };

    return (
        <div className="login-container">
            {/* Background glows to match homepage */}
            <div className="background-glows">
                <div className="glow1"></div>
                <div className="glow2"></div>
                <div className="glow3"></div>
                <div className="glow4"></div>
                <div className="glow5"></div>
                <div className="streak streak1"></div>
                <div className="streak streak2"></div>
                <div className="streak streak3"></div>
                <div className="streak streak4"></div>
                <div className="streak streak5"></div>
            </div>

            <div className={`auth-card-container ${isActive ? 'active' : ''}`}>
                {/* Home and Back buttons inside the container */}
                <div className="inner-navigation">
                    <button onClick={() => navigate('/')} className="nav-icon-btn" title="Home">
                        <i className='bx bx-home-alt'></i>
                    </button>
                </div>

                {authError && <div className="auth-error">{authError}</div>}

                <div className="form-box login">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                            />
                            <i className='bx bxs-envelope'></i>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                            />
                            <i className='bx bxs-lock-alt'></i>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <div className="forgot-link">
                            <a href="#">Forgot Password?</a>
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <p>or login with social platforms</p>
                        <div className="social-icons">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="social-icon-btn google"
                            >
                                <i className='bx bxl-google'></i>
                                <span>Continue with Google</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className={errors.username ? 'error' : ''}
                            />
                            <i className='bx bxs-user'></i>
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                            />
                            <i className='bx bxs-envelope'></i>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                            />
                            <i className='bx bxs-lock-alt'></i>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            <i className='bx bxs-lock-alt'></i>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                        <p>or register with social platforms</p>
                        <div className="social-icons">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="social-icon-btn google"
                            >
                                <i className='bx bxl-google'></i>
                                <span>Continue with Google</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Hello, Welcome!</h1>
                        <p>Don't have an account?</p>
                        <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account?</p>
                        <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
