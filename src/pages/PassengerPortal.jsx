import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Search, AlertCircle, Clock, ShieldCheck, CheckCircle2, Users, ArrowRight, Calendar, Shield } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../utils/AuthContext';

export default function PassengerPortal() {
    const { user, logout } = useAuth();
    const [routes, setRoutes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [safetyReportSubmitted, setSafetyReportSubmitted] = useState(false);
    const [reportData, setReportData] = useState({
        busNumber: '',
        routeId: '',
        issueType: 'Driver Drowsiness / Fatigue',
        description: ''
    });

    useEffect(() => {
        api.getRoutes().then(res => {
            if (res.data) setRoutes(res.data);
            setLoading(false);
        });
    }, []);

    const filtered = routes.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.origin.toLowerCase().includes(search.toLowerCase()) ||
        r.destination.toLowerCase().includes(search.toLowerCase()) ||
        (r.busNumber && r.busNumber.toLowerCase().includes(search.toLowerCase())) ||
        (r.registrationNumber && r.registrationNumber.toLowerCase().includes(search.toLowerCase()))
    );

    const handleReportSubmit = (e) => {
        e.preventDefault();
        setSafetyReportSubmitted(true);
        setTimeout(() => setSafetyReportSubmitted(false), 5000);
        setReportData({ busNumber: '', routeId: '', issueType: 'Driver Drowsiness / Fatigue', description: '' });
    };

    return (
        <div style={{ maxWidth: 1150, margin: '0 auto', padding: '1rem' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(245, 158, 11, 0.12))',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <span style={{
                        display: 'inline-block',
                        background: '#f59e0b',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        marginBottom: 6
                    }}>
                        Citizen & Commuter Portal
                    </span>
                    <h1 style={{ fontSize: '1.5rem', color: '#f8fafc', margin: '0 0 4px 0' }}>
                        Welcome, {user?.name || 'TGSRTC Passenger'}
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                        Search active bus transit corridors, verify live registration numbers, service timings, and check driver health records.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link
                        to="/drivers"
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <Users size={16} /> View Crew Directory
                    </Link>
                    <button 
                        onClick={logout}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Quick Cards Banner */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Crew Transparency</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>Drivers & Conductors Directory</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Review qualifications, rest hours & fitness</div>
                    </div>
                    <Link to="/drivers" style={{ color: '#06b6d4', display: 'flex', alignItems: 'center' }}>
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Live Fleet Status</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>{routes.length} Active Corridors</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>High-frequency express & luxury services</div>
                    </div>
                    <span className="badge cyan">Fleet Active</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* TGSRTC Bus Corridors & Schedules */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bus size={22} color="#06b6d4" /> TGSRTC Bus Corridors & Schedules
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Showing {filtered.length} routes with vehicle registration details
                        </span>
                    </div>

                    <div className="search-box" style={{ marginBottom: '1.25rem' }}>
                        <Search size={16} />
                        <input 
                            type="text"
                            placeholder="Search by city, stop, Bus No (e.g. BUS-1001), or Reg No (e.g. TS-09-Z-1001)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filtered.map(r => (
                            <div key={r.id} style={{
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '10px',
                                padding: '1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                            }}>
                                {/* Top Route Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem' }}>
                                                {r.name}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>
                                                [{r.id}]
                                            </span>
                                            <span className="badge cyan" style={{ fontSize: '0.7rem' }}>
                                                {r.busType}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 4 }}>
                                            <MapPin size={13} style={{ display: 'inline', marginRight: 4, color: '#f59e0b' }} />
                                            <strong>{r.origin}</strong> ➔ <strong>{r.destination}</strong>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <span className="badge info">{r.terrain} Terrain</span>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                                            Depot: <strong>{r.depotName}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Bus Details & Timings Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: '0.75rem',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(148, 163, 184, 0.1)'
                                }}>
                                    {/* Bus Number */}
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Bus Fleet Code
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>
                                            {r.busNumber}
                                        </div>
                                    </div>

                                    {/* Registration Number */}
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Registration Number
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', marginTop: 2, letterSpacing: '0.5px' }}>
                                            {r.registrationNumber}
                                        </div>
                                    </div>

                                    {/* Bus Timings */}
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} /> Daily Schedule Timings
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#22c55e', marginTop: 2 }}>
                                            {r.busTimings}
                                        </div>
                                    </div>

                                    {/* Distance & Journey Duration */}
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                                            Trip Distance & Time
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginTop: 2 }}>
                                            {r.distance} KM • ~{r.avgDuration} min
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Safety Reporting Widget */}
                <div className="card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={20} color="#22c55e" /> Passenger Safety Hotline
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                        Report aggressive driving, driver drowsiness, or vehicle maintenance issues directly to the TGSRTC depot monitoring desk.
                    </p>

                    {safetyReportSubmitted ? (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            padding: '1rem',
                            borderRadius: '8px',
                            color: '#4ade80',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <CheckCircle2 size={18} />
                            <span>Your report has been dispatched to the central operations triage. Reference: TGSRTC-SAFE-2026</span>
                        </div>
                    ) : (
                        <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Bus Fleet / Reg Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. TS-09-Z-1002 or BUS-1002"
                                    value={reportData.busNumber}
                                    onChange={(e) => setReportData({ ...reportData, busNumber: e.target.value })}
                                    style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Safety Issue Type</label>
                                <select
                                    value={reportData.issueType}
                                    onChange={(e) => setReportData({ ...reportData, issueType: e.target.value })}
                                    style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                >
                                    <option value="Driver Drowsiness / Fatigue">Driver Drowsiness / Fatigue</option>
                                    <option value="Rash Driving / Speeding">Rash Driving / Speeding</option>
                                    <option value="Route Delay / Signal Jump">Route Delay / Signal Jump</option>
                                    <option value="Mechanical / AC Breakdown">Mechanical / AC Breakdown</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Brief Description</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Describe location and incident details..."
                                    value={reportData.description}
                                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                    style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                Submit Incident Alert
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
