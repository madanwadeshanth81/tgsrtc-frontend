import React, { useState, useEffect } from 'react';
import { 
    Users, Search, Filter, ShieldCheck, Mail, Phone, Calendar, 
    RefreshCw, KeyRound, CheckCircle2, UserCheck, Database, Eye, EyeOff, 
    X, ArrowUpDown, Lock, Copy, Check, Trash2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';

export default function Passengers() {
    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [selectedPassenger, setSelectedPassenger] = useState(null);
    const [revealedPasswords, setRevealedPasswords] = useState({});
    const [allRevealed, setAllRevealed] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    // Delete Modal State
    const [deleteModalPassenger, setDeleteModalPassenger] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState('');
    const [actionError, setActionError] = useState('');

    const loadPassengers = async () => {
        try {
            setLoading(true);
            const res = await api.getUsers({ role: 'PASSENGER' });
            if (res.data) {
                setPassengers(res.data);
            }
        } catch (err) {
            console.error('Failed to load passenger login info:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPassengers();
    }, []);

    const togglePassword = (id) => {
        setRevealedPasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleAllPasswords = () => {
        if (allRevealed) {
            setRevealedPasswords({});
            setAllRevealed(false);
        } else {
            const all = {};
            passengers.forEach(p => { all[p.id] = true; });
            setRevealedPasswords(all);
            setAllRevealed(true);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDeleteUser = async () => {
        if (!deleteModalPassenger) return;
        setDeleteLoading(true);
        setActionError('');
        setActionSuccess('');

        try {
            const res = await api.deleteUser(deleteModalPassenger.id);
            if (res.success) {
                setActionSuccess(res.message || `Passenger '${deleteModalPassenger.name}' deleted successfully from database.`);
                setPassengers(prev => prev.filter(p => p.id !== deleteModalPassenger.id));
                setDeleteModalPassenger(null);
                setTimeout(() => setActionSuccess(''), 4000);
            } else {
                setActionError(res.message || 'Failed to delete passenger account.');
            }
        } catch (err) {
            setActionError('Server error while deleting account. Please verify connection.');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filter and Sort
    const filtered = passengers.filter(p => {
        const query = search.toLowerCase();
        return (
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.employee_id && p.employee_id.toLowerCase().includes(query)) ||
            (p.email && p.email.toLowerCase().includes(query)) ||
            (p.phone && p.phone.toLowerCase().includes(query)) ||
            (p.password && p.password.toLowerCase().includes(query))
        );
    }).sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        if (sortBy === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'id') return (a.employee_id || '').localeCompare(b.employee_id || '');
        return 0;
    });

    const totalCount = passengers.length;
    const verifiedPhones = passengers.filter(p => p.phone && p.phone.length >= 10).length;
    const verifiedEmails = passengers.filter(p => p.email && p.email.includes('@')).length;

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserCheck size={28} style={{ color: '#f59e0b' }} />
                        Passenger Accounts & Login Credentials
                    </h1>
                    <p>
                        Admin Portal Oversight — Central database repository of commuter accounts with visible login passwords, delete controls, and contact details.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={toggleAllPasswords}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', borderColor: allRevealed ? '#06b6d4' : 'var(--border-color)' }}
                    >
                        {allRevealed ? <EyeOff size={15} style={{ color: '#06b6d4' }} /> : <Eye size={15} style={{ color: '#06b6d4' }} />}
                        {allRevealed ? 'Hide All Passwords' : 'Reveal All Passwords'}
                    </button>
                    <button 
                        onClick={loadPassengers}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <RefreshCw size={15} className={loading ? 'spin' : ''} />
                        Refresh Records
                    </button>
                </div>
            </div>

            {/* Action Feedback Alerts */}
            {actionSuccess && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#4ade80',
                    fontSize: '0.88rem',
                    marginBottom: '1rem'
                }}>
                    <CheckCircle2 size={16} />
                    <span>{actionSuccess}</span>
                </div>
            )}

            {actionError && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#f87171',
                    fontSize: '0.88rem',
                    marginBottom: '1rem'
                }}>
                    <AlertCircle size={16} />
                    <span>{actionError}</span>
                </div>
            )}



            {/* Search & Filter Toolbar */}
            <div className="toolbar" style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <div className="search-bar" style={{ flex: '1 1 300px', minWidth: '260px' }}>
                    <Search size={16} />
                    <input 
                        type="text"
                        placeholder="Search by commuter name, passenger ID, email, mobile, or password..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <ArrowUpDown size={15} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Sort By:</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                    >
                        <option value="latest">Latest Registered</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Commuter Name (A-Z)</option>
                        <option value="id">Passenger ID</option>
                    </select>
                </div>
            </div>

            {/* Passenger Accounts Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Passenger ID</th>
                            <th>Commuter / Username</th>
                            <th>Login Email Address</th>
                            <th>Mobile Number</th>
                            <th>Login Password (Database)</th>
                            <th>Authentication Status</th>
                            <th>Registered On</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    No passenger login records found matching "{search}".
                                </td>
                            </tr>
                        ) : (
                            filtered.map(p => {
                                const isRevealed = revealedPasswords[p.id] || allRevealed;
                                const pwd = p.password || 'Password@123';
                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <span style={{ 
                                                background: 'rgba(6, 182, 212, 0.12)', 
                                                color: '#06b6d4', 
                                                padding: '3px 8px', 
                                                borderRadius: '6px', 
                                                fontWeight: 700, 
                                                fontSize: '0.85rem' 
                                            }}>
                                                {p.employee_id}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                                                {p.name}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                                Role: {p.role}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                                                <Mail size={14} style={{ color: '#06b6d4' }} />
                                                <span>{p.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                                                <Phone size={14} style={{ color: '#22c55e' }} />
                                                <span>{p.phone || 'Not Provided'}</span>
                                            </div>
                                        </td>
                                        {/* Login Password Column */}
                                        <td>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '4px 10px', borderRadius: '6px', border: '1px solid #334155' }}>
                                                <span style={{ 
                                                    fontFamily: 'monospace', 
                                                    fontSize: '0.9rem', 
                                                    fontWeight: 700,
                                                    color: isRevealed ? '#38bdf8' : '#64748b',
                                                    letterSpacing: isRevealed ? '0.5px' : '2px'
                                                }}>
                                                    {isRevealed ? pwd : '••••••••'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => togglePassword(p.id)}
                                                    title={isRevealed ? "Hide password" : "Show password"}
                                                    style={{ background: 'none', border: 'none', color: '#06b6d4', cursor: 'pointer', padding: 2, display: 'flex' }}
                                                >
                                                    {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                                {isRevealed && (
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(pwd, p.id)}
                                                        title="Copy password"
                                                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2, display: 'flex' }}
                                                    >
                                                        {copiedId === p.id ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                background: 'rgba(34, 197, 94, 0.12)',
                                                color: '#22c55e',
                                                padding: '3px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                                                Active (JWT Ready)
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                            {p.created_at ? new Date(p.created_at).toLocaleString() : 'Recent'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <button 
                                                    onClick={() => setSelectedPassenger(p)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '4px 9px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                    title="View credentials info"
                                                >
                                                    <Eye size={13} /> View
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteModalPassenger(p)}
                                                    className="btn btn-danger"
                                                    style={{ padding: '4px 9px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                    title="Delete passenger account from database"
                                                >
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Passenger Login Details Modal */}
            {selectedPassenger && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '14px',
                        padding: '1.75rem',
                        width: '100%',
                        maxWidth: '560px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                    }}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <KeyRound size={22} style={{ color: '#f59e0b' }} />
                                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>
                                    Passenger Login Credentials & Database Record
                                </h3>
                            </div>
                            <button 
                                onClick={() => setSelectedPassenger(null)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                                        Passenger ID
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#06b6d4' }}>
                                        {selectedPassenger.employee_id}
                                    </div>
                                </div>
                                <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                                        Role Privilege
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>
                                        {selectedPassenger.role} (Citizen Commuter)
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                                    Full Name / Username
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                                    {selectedPassenger.name}
                                </div>
                            </div>

                            <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                                    Primary Login Identifier (Email)
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#cbd5e1' }}>
                                    {selectedPassenger.email}
                                </div>
                            </div>

                            <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 2 }}>
                                    Mobile Number
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#cbd5e1' }}>
                                    {selectedPassenger.phone || 'No mobile number registered'}
                                </div>
                            </div>

                            {/* Visible Database Password */}
                            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #06b6d4' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <div style={{ fontSize: '0.75rem', color: '#06b6d4', textTransform: 'uppercase', fontWeight: 700 }}>
                                        🔑 Stored Database Password
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => togglePassword(selectedPassenger.id)}
                                        style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                                    >
                                        {(revealedPasswords[selectedPassenger.id] || allRevealed) ? <EyeOff size={13} /> : <Eye size={13} />}
                                        {(revealedPasswords[selectedPassenger.id] || allRevealed) ? 'Hide' : 'Reveal'}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                                        {(revealedPasswords[selectedPassenger.id] || allRevealed) 
                                            ? (selectedPassenger.password || 'Password@123') 
                                            : '••••••••••••'}
                                    </span>
                                    <button 
                                        onClick={() => copyToClipboard(selectedPassenger.password || 'Password@123', 'modal-pwd')}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.75rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                                    >
                                        {copiedId === 'modal-pwd' ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                                        {copiedId === 'modal-pwd' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                                <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700, marginBottom: 4 }}>
                                    🗄️ Database Query Reference
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                    View this account directly in MariaDB CLI with:<br />
                                    <code style={{ color: '#f59e0b', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', display: 'block', marginTop: 4 }}>
                                        SELECT id, employee_id, name, email, password FROM users WHERE id = {selectedPassenger.id};
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                            <button
                                onClick={() => {
                                    const p = selectedPassenger;
                                    setSelectedPassenger(null);
                                    setDeleteModalPassenger(p);
                                }}
                                className="btn btn-danger"
                                style={{ fontSize: '0.85rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <Trash2 size={14} /> Delete This Account
                            </button>
                            <button 
                                onClick={() => setSelectedPassenger(null)}
                                className="btn btn-primary"
                                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {deleteModalPassenger && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                    backdropFilter: 'blur(6px)',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '14px',
                        padding: '1.75rem',
                        width: '100%',
                        maxWidth: '480px',
                        boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{ 
                                width: 44, 
                                height: 44, 
                                borderRadius: '10px', 
                                background: 'rgba(239, 68, 68, 0.15)', 
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ef4444'
                            }}>
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>
                                    Delete Passenger Account?
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                                    Permanent database removal from MariaDB
                                </p>
                            </div>
                        </div>

                        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#cbd5e1' }}>
                                Are you sure you want to permanently delete the following commuter record?
                            </p>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                                • <strong>Name:</strong> <span style={{ color: '#f8fafc' }}>{deleteModalPassenger.name}</span><br />
                                • <strong>Passenger ID:</strong> <span style={{ color: '#06b6d4' }}>{deleteModalPassenger.employee_id}</span><br />
                                • <strong>Login Email:</strong> <span style={{ color: '#cbd5e1' }}>{deleteModalPassenger.email}</span><br />
                                • <strong>Mobile:</strong> <span style={{ color: '#cbd5e1' }}>{deleteModalPassenger.phone || 'N/A'}</span>
                            </div>
                            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <AlertTriangle size={14} />
                                This will permanently delete the row from table `users` in database `tgsrtc_shift_management`.
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                disabled={deleteLoading}
                                onClick={() => setDeleteModalPassenger(null)}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleteLoading}
                                onClick={handleDeleteUser}
                                className="btn btn-danger"
                                style={{ 
                                    fontSize: '0.85rem', 
                                    padding: '8px 18px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px',
                                    background: '#ef4444',
                                    color: '#fff',
                                    border: 'none',
                                    opacity: deleteLoading ? 0.7 : 1,
                                    cursor: deleteLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Trash2 size={15} />
                                {deleteLoading ? 'Deleting from DB...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
