import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser, googleLogin } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import './Signup.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Signup() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const googleButtonRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 1, label: 'Weak', color: '#ef4444' };
        if (password.length < 8) return { strength: 2, label: 'Fair', color: '#f59e0b' };
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, label: 'Good', color: '#3b82f6' };
        return { strength: 4, label: 'Strong', color: '#10b981' };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...userData } = formData;
            const response = await registerUser(userData);

            if (response.success) {
                login(response.user);
                navigate('/home');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    // Initialize Google OAuth
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) {
            console.warn('Google Client ID not found. Please add VITE_GOOGLE_CLIENT_ID to your .env file');
            return;
        }

        const initializeGoogleAuth = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleResponse,
                });

                // Render button if ref is available
                if (googleButtonRef.current) {
                    // Clear any existing button
                    googleButtonRef.current.innerHTML = '';
                    window.google.accounts.id.renderButton(
                        googleButtonRef.current,
                        {
                            theme: 'outline',
                            size: 'large',
                            text: 'signup_with',
                            width: '100%',
                            type: 'standard',
                        }
                    );
                }
            }
        };

        // If Google script is already loaded
        if (window.google && window.google.accounts) {
            initializeGoogleAuth();
        } else {
            // Load Google Identity Services script
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleAuth;
            document.head.appendChild(script);
        }

        // Cleanup function
        return () => {
            if (googleButtonRef.current) {
                googleButtonRef.current.innerHTML = '';
            }
        };
    }, [GOOGLE_CLIENT_ID]);

    const handleGoogleResponse = async (response) => {
        if (!response.credential) {
            setError('Failed to authenticate with Google');
            return;
        }

        setError('');
        setGoogleLoading(true);

        try {
            const result = await googleLogin(response.credential);
            if (result.success) {
                login(result.user);
                navigate('/home');
            } else {
                setError(result.message || 'Google authentication failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during Google authentication');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-background-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>
            
            <div className="signup-container">
                <div className="signup-form-wrapper">
                    <div className="signup-form-container">
                        <div className="form-header">
                            <div className="signup-logo">
                                <h1 className="logo-text">ChefAI Companion</h1>
                            </div>
                            <h2 className="form-title">Create Your Account</h2>
                            <p className="form-subtitle">Join thousands of chefs creating amazing recipes with AI</p>
                        </div>

                        {error && (
                            <div className="error-alert" role="alert">
                                <svg className="error-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Social Login */}
                        {GOOGLE_CLIENT_ID && (
                            <div className="social-login-section">
                                <div 
                                    ref={googleButtonRef}
                                    className="google-signin-button"
                                    style={{ 
                                        display: googleLoading ? 'none' : 'block',
                                        width: '100%',
                                        marginBottom: '20px'
                                    }}
                                ></div>
                                {googleLoading && (
                                    <div className="google-loading" style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        padding: '12px',
                                        background: '#f9f9f9',
                                        borderRadius: '8px',
                                        marginBottom: '20px'
                                    }}>
                                        <svg className="spinner-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '8px' }}>
                                            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                                                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                                                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                                            </circle>
                                        </svg>
                                        <span>Creating account with Google...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {GOOGLE_CLIENT_ID && (
                            <div className="divider">
                                <span>or</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="signup-form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2.5 18.3333C2.5 15.1117 5.11167 12.5 8.33333 12.5H11.6667C14.8883 12.5 17.5 15.1117 17.5 18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M5.83333 9.16667V5.83333C5.83333 4.72826 6.27281 3.66846 7.05372 2.88756C7.83462 2.10665 8.89442 1.66667 9.99999 1.66667C11.1056 1.66667 12.1654 2.10665 12.9463 2.88756C13.7272 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M2.5 2.5L17.5 17.5M8.15833 8.15833C7.84019 8.47647 7.66667 8.91449 7.66667 9.375C7.66667 10.2965 8.41286 11.0417 9.33333 11.0417C9.79384 11.0417 10.2319 10.8681 10.55 10.55M5.97499 5.97499C4.60833 6.91667 3.40833 8.33333 2.5 10C4.16667 13.3333 6.66667 15.8333 10 15.8333C11.15 15.8333 12.2417 15.5417 13.225 15.05M14.6417 14.6417C15.85 13.7917 16.8917 12.6667 17.5 11.25C15.8333 7.91667 13.3333 5.41667 10 5.41667C9.39167 5.41667 8.8 5.50833 8.23333 5.675" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M1.66667 10C1.66667 10 4.16667 5.41667 10 5.41667C15.8333 5.41667 18.3333 10 18.3333 10C18.3333 10 15.8333 14.5833 10 14.5833C4.16667 14.5833 1.66667 10 1.66667 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="password-strength">
                                        <div className="password-strength-bars">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`strength-bar ${passwordStrength.strength >= level ? 'active' : ''}`}
                                                    style={{ backgroundColor: passwordStrength.strength >= level ? passwordStrength.color : '#e5e7eb' }}
                                                ></div>
                                            ))}
                                        </div>
                                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M5.83333 9.16667V5.83333C5.83333 4.72826 6.27281 3.66846 7.05372 2.88756C7.83462 2.10665 8.89442 1.66667 9.99999 1.66667C11.1056 1.66667 12.1654 2.10665 12.9463 2.88756C13.7272 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`form-input ${passwordsMatch ? 'input-success' : ''} ${passwordsMismatch ? 'input-error' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M2.5 2.5L17.5 17.5M8.15833 8.15833C7.84019 8.47647 7.66667 8.91449 7.66667 9.375C7.66667 10.2965 8.41286 11.0417 9.33333 11.0417C9.79384 11.0417 10.2319 10.8681 10.55 10.55M5.97499 5.97499C4.60833 6.91667 3.40833 8.33333 2.5 10C4.16667 13.3333 6.66667 15.8333 10 15.8333C11.15 15.8333 12.2417 15.5417 13.225 15.05M14.6417 14.6417C15.85 13.7917 16.8917 12.6667 17.5 11.25C15.8333 7.91667 13.3333 5.41667 10 5.41667C9.39167 5.41667 8.8 5.50833 8.23333 5.675" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M1.66667 10C1.66667 10 4.16667 5.41667 10 5.41667C15.8333 5.41667 18.3333 10 18.3333 10C18.3333 10 15.8333 14.5833 10 14.5833C4.16667 14.5833 1.66667 10 1.66667 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formData.confirmPassword && (
                                    <div className="password-match-indicator">
                                        {passwordsMatch ? (
                                            <span className="match-success">
                                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                Passwords match
                                            </span>
                                        ) : passwordsMismatch ? (
                                            <span className="match-error">
                                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                Passwords do not match
                                            </span>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading || passwordsMismatch}
                            >
                                {loading ? (
                                    <>
                                        <svg className="spinner-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                                                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                                                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                                            </circle>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <svg className="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="form-footer">
                            <p className="login-prompt">
                                Already have an account?{' '}
                                <Link to="/login" className="login-link">Sign in here</Link>
                            </p>
                            <p className="terms-text">
                                By creating an account, you agree to our{' '}
                                <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
                                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
