import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bus, Shield, User, Award, Users, AlertCircle, ArrowRight, 
    Lock, Mail, Phone, CheckCircle2, UserPlus, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { api } from '../utils/api';

export default function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [selectedRole, setSelectedRole] = useState('ADMIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Passenger Registration Form State
    const [regForm, setRegForm] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Dual OTP Verification States
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneOtp, setPhoneOtp] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(false);

    const [otpLoading, setOtpLoading] = useState({
        email: false,
        emailVerify: false,
        phone: false,
        phoneVerify: false
    });

    // 4 Distinct Roles Setup
    const roles = [
        {
            id: 'ADMIN',
            name: 'Central Admin',
            icon: Shield,
            color: '#8b5cf6',
            defaultEmail: 'admin@tgsrtc.telangana.gov.in',
            desc: 'System oversight, driver roster allocation & analytics'
        },
        {
            id: 'DEPOT_MANAGER',
            name: 'Depot Manager',
            icon: Award,
            color: '#06b6d4',
            defaultEmail: 'manager.mgbs@tgsrtc.telangana.gov.in',
            desc: 'Shift dispatches, fatigue monitoring & fleet duty'
        },
        {
            id: 'DRIVER',
            name: 'Driver & Crew',
            icon: User,
            color: '#22c55e',
            defaultEmail: 'rajesh.drv@tgsrtc.telangana.gov.in',
            desc: 'My schedule, fatigue health scores & route assignments'
        },
        {
            id: 'PASSENGER',
            name: 'Passenger',
            icon: Users,
            color: '#f59e0b',
            defaultEmail: 'passenger@tgsrtc.telangana.gov.in',
            desc: 'Live route lookup, bus timings & safety reporting'
        }
    ];

    const handleRoleSelect = (roleObj) => {
        setSelectedRole(roleObj.id);
        setEmail(roleObj.defaultEmail);
        setPassword('Password@123');
        setError('');
        setSuccessMsg('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res.success) {
                if (res.user.role === 'PASSENGER') {
                    navigate('/passenger');
                } else if (res.user.role === 'DRIVER') {
                    navigate('/driver-portal');
                } else {
                    navigate('/');
                }
            } else {
                setError(res.message || 'Authentication failed. Please check credentials.');
            }
        } catch (err) {
            setError('Unable to connect to TGSRTC Backend (Port 5001). Please ensure server is running.');
        } finally {
            setLoading(false);
        }
    };

    // OTP Handlers for Email
    const handleSendEmailOtp = async () => {
        const cleanEmail = regForm.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!cleanEmail || !emailRegex.test(cleanEmail)) {
            setError('Please enter a valid email address first.');
            return;
        }
        setError('');
        setSuccessMsg('');
        setOtpLoading(prev => ({ ...prev, email: true }));
        try {
            const res = await api.sendOtp('EMAIL', cleanEmail);
            if (res.success) {
                setEmailOtpSent(true);
                setEmailOtp(''); // Ensure field starts empty so user types the code from their email
                setSuccessMsg(`Verification code sent to ${cleanEmail}! Please check your email inbox.`);
            } else {
                setError(res.message || 'Failed to send Email OTP.');
            }
        } catch (err) {
            setError('Error requesting Email OTP. Check backend connection.');
        } finally {
            setOtpLoading(prev => ({ ...prev, email: false }));
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (!emailOtp || emailOtp.length < 6) {
            setError('Please enter the 6-digit Email OTP.');
            return;
        }
        setError('');
        setSuccessMsg('');
        setOtpLoading(prev => ({ ...prev, emailVerify: true }));
        try {
            const res = await api.verifyOtp('EMAIL', regForm.email.trim(), emailOtp);
            if (res.success) {
                setEmailVerified(true);
                setSuccessMsg('Email address verified successfully!');
            } else {
                setError(res.message || 'Invalid Email OTP.');
            }
        } catch (err) {
            setError('Error verifying Email OTP.');
        } finally {
            setOtpLoading(prev => ({ ...prev, emailVerify: false }));
        }
    };

    // OTP Handlers for Mobile
    const handleSendPhoneOtp = async () => {
        const cleanPhone = regForm.phone.trim();
        const digits = cleanPhone.replace(/\D/g, '');
        if (digits.length < 10) {
            setError('Please enter a valid 10-digit mobile number first.');
            return;
        }
        setError('');
        setSuccessMsg('');
        setOtpLoading(prev => ({ ...prev, phone: true }));
        try {
            const res = await api.sendOtp('MOBILE', cleanPhone);
            if (res.success) {
                setPhoneOtpSent(true);
                setPhoneOtp(''); // Ensure field starts empty so user types the code from SMS
                setSuccessMsg(`Verification code sent to ${cleanPhone}! Please check your SMS.`);
            } else {
                setError(res.message || 'Failed to send Mobile OTP.');
            }
        } catch (err) {
            setError('Error requesting Mobile OTP. Check backend connection.');
        } finally {
            setOtpLoading(prev => ({ ...prev, phone: false }));
        }
    };

    const handleVerifyPhoneOtp = async () => {
        if (!phoneOtp || phoneOtp.length < 6) {
            setError('Please enter the 6-digit Mobile OTP.');
            return;
        }
        setError('');
        setSuccessMsg('');
        setOtpLoading(prev => ({ ...prev, phoneVerify: true }));
        try {
            const res = await api.verifyOtp('MOBILE', regForm.phone.trim(), phoneOtp);
            if (res.success) {
                setPhoneVerified(true);
                setSuccessMsg('Mobile number verified successfully!');
            } else {
                setError(res.message || 'Invalid Mobile OTP.');
            }
        } catch (err) {
            setError('Error verifying Mobile OTP.');
        } finally {
            setOtpLoading(prev => ({ ...prev, phoneVerify: false }));
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const trimmedUser = regForm.username.trim();
        const trimmedEmail = regForm.email.trim();
        const trimmedPhone = regForm.phone.trim();

        if (!trimmedUser) {
            setError('Please enter a username or full name.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            setError('Please provide a valid email address (e.g. name@domain.com).');
            return;
        }

        const digits = trimmedPhone.replace(/\D/g, '');
        if (digits.length < 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }

        if (regForm.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (regForm.password !== regForm.confirmPassword) {
            setError('Passwords do not match! Please check and confirm your password.');
            return;
        }

        setLoading(true);
        try {
            const res = await register({
                username: trimmedUser,
                email: trimmedEmail,
                phone: trimmedPhone,
                password: regForm.password,
                confirmPassword: regForm.confirmPassword
            });

            if (res.success) {
                setSuccessMsg('Account registered successfully and stored in Admin Database! Redirecting...');
                setTimeout(() => {
                    navigate('/passenger');
                }, 1200);
            } else {
                setError(res.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Server connection error. Please ensure TGSRTC server is running.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px 10px 38px',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        color: '#f8fafc',
        fontSize: '0.88rem',
        outline: 'none',
        boxSizing: 'border-box'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)',
            padding: '2rem 1rem',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '940px',
                background: 'rgba(30, 41, 59, 0.75)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                overflow: 'hidden'
            }}>
                {/* Left Brand Panel */}
                <div style={{
                    padding: '3rem 2.5rem',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRight: '1px solid rgba(148, 163, 184, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            marginBottom: '1.25rem'
                        }}>
                            <img
                                src="/tgsrtc_logo.png"
                                alt="TGSRTC Logo"
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid rgba(245, 158, 11, 0.4)',
                                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
                                }}
                            />
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>
                                    TGSRTC
                                </h1>
                                <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Telangana State Road Transport
                                </span>
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#06b6d4', margin: '0 0 1rem 0' }}>
                            Shift & Fatigue Management System
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Telangana State Road Transport Corporation — A data-driven full-stack framework integrating driver biometric health, route terrain difficulty, and automated shift scheduling.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.1)'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 4 }}>
                            Academic Engineering Super-System
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
                            Urban Transportation & Sustainable Mobility (IP-3)
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div style={{ padding: '2.5rem 2.5rem' }}>
                    {/* Mode Toggle Switch */}
                    <div style={{
                        display: 'flex',
                        background: '#0f172a',
                        padding: '4px',
                        borderRadius: '10px',
                        border: '1px solid #334155',
                        marginBottom: '1.5rem'
                    }}>
                        <button
                            type="button"
                            onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '7px',
                                background: !isRegisterMode ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent',
                                color: !isRegisterMode ? '#fff' : '#94a3b8',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsRegisterMode(true); setError(''); setSuccessMsg(''); }}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '7px',
                                background: isRegisterMode ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                                color: isRegisterMode ? '#fff' : '#94a3b8',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <UserPlus size={15} />
                            New Passenger
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: '#f87171',
                            fontSize: '0.85rem',
                            marginBottom: '1.25rem'
                        }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: '#4ade80',
                            fontSize: '0.85rem',
                            marginBottom: '1.25rem'
                        }}>
                            <CheckCircle2 size={16} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {!isRegisterMode ? (
                        /* ================= SIGN IN FORM ================= */
                        <>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
                                Portal Sign In
                            </h3>
                            <form onSubmit={handleLoginSubmit} style={{ marginTop: '1rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                                        Email / Username
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email or username"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1' }}>
                                            Password
                                        </label>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '11px',
                                        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        fontSize: '0.92rem',
                                        fontWeight: 700,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'opacity 0.2s ease',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                        </>
                    ) : (
                        /* ================= CREATE PASSENGER ACCOUNT WITH OTP ================= */
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                                <div style={{ background: '#f59e0b', color: '#0f172a', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                                    COMMUTER REGISTRATION & OTP VERIFICATION
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.35rem 0' }}>
                                Create Verified Passenger Account
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
                                Email OTP verification required for security before storing account in TGSRTC database.
                            </p>

                            <form onSubmit={handleRegisterSubmit}>
                                {/* Username */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                                        Username / Full Name *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Ramesh Kumar"
                                            value={regForm.username}
                                            onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                                            required
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Email Address + OTP Validation */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1' }}>
                                            Email Address *
                                        </label>
                                        {emailVerified ? (
                                            <span style={{ fontSize: '0.72rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                                <CheckCircle2 size={13} /> Email Verified
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>
                                                Requires OTP Verification
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                                            <input
                                                type="email"
                                                placeholder="e.g. ramesh.kumar@example.com"
                                                value={regForm.email}
                                                onChange={(e) => {
                                                    setRegForm({ ...regForm, email: e.target.value });
                                                    setEmailVerified(false);
                                                }}
                                                disabled={emailVerified}
                                                required
                                                style={{ ...inputStyle, background: emailVerified ? 'rgba(34, 197, 94, 0.08)' : '#0f172a' }}
                                            />
                                        </div>
                                        {!emailVerified && (
                                            <button
                                                type="button"
                                                onClick={handleSendEmailOtp}
                                                disabled={otpLoading.email}
                                                style={{
                                                    padding: '0 12px',
                                                    background: 'rgba(6, 182, 212, 0.15)',
                                                    border: '1px solid #06b6d4',
                                                    borderRadius: '8px',
                                                    color: '#38bdf8',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 700,
                                                    cursor: otpLoading.email ? 'not-allowed' : 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {otpLoading.email ? 'Sending...' : emailOtpSent ? 'Resend OTP' : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>
                                    {/* Email OTP Input Row */}
                                    {emailOtpSent && !emailVerified && (
                                        <div style={{ marginTop: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit Email OTP"
                                                value={emailOtp}
                                                onChange={(e) => setEmailOtp(e.target.value)}
                                                maxLength={6}
                                                style={{
                                                    ...inputStyle,
                                                    padding: '7px 10px',
                                                    fontSize: '0.82rem',
                                                    letterSpacing: '2px',
                                                    flex: 1
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyEmailOtp}
                                                disabled={otpLoading.emailVerify}
                                                style={{
                                                    padding: '7px 14px',
                                                    background: '#22c55e',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '0.78rem',
                                                    cursor: otpLoading.emailVerify ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {otpLoading.emailVerify ? 'Verifying...' : 'Verify'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Number (Standard input without OTP requirement) */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                                        Mobile Number *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                                        <input
                                            type="tel"
                                            placeholder="10-digit mobile number (e.g. 9876543210)"
                                            value={regForm.phone}
                                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                                            required
                                            maxLength={15}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Password & Confirm Password */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                                            Password *
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                                            <input
                                                type="password"
                                                placeholder="Min. 6 chars"
                                                value={regForm.password}
                                                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                                                required
                                                style={{ ...inputStyle, paddingLeft: '32px' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                                            Confirm Password *
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <ShieldCheck size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                                            <input
                                                type="password"
                                                placeholder="Re-enter"
                                                value={regForm.confirmPassword}
                                                onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                                                required
                                                style={{ ...inputStyle, paddingLeft: '32px' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !emailVerified}
                                    style={{
                                        width: '100%',
                                        padding: '11px',
                                        background: !emailVerified ? '#475569' : 'linear-gradient(135deg, #f59e0b, #ea580c)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        fontSize: '0.92rem',
                                        fontWeight: 700,
                                        cursor: (loading || !emailVerified) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        opacity: (loading || !emailVerified) ? 0.75 : 1,
                                        boxShadow: emailVerified ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none'
                                    }}
                                >
                                    <span>
                                        {!emailVerified 
                                            ? 'Verify Email OTP First' 
                                            : loading 
                                            ? 'Creating & Authenticating...' 
                                            : 'Complete Registration & Save to Database'}
                                    </span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>

                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#06b6d4',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        padding: 0
                                    }}
                                >
                                    Sign In here
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
