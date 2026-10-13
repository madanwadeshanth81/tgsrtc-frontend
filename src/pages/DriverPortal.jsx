import React, { useState, useEffect } from 'react';
import { User, Activity, Clock, Heart, Calendar, ShieldAlert, Award, AlertOctagon, Check, X, FileText } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import { getFatigueClass, getHealthClass } from '../utils/fatigueEngine';

export default function DriverPortal() {
    const { user, logout } = useAuth();
    const [myStaffRecord, setMyStaffRecord] = useState(null);
    const [myShifts, setMyShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Leave Application Modal State
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaveType, setLeaveType] = useState('Emergency Leave');
    const [leaveReason, setLeaveReason] = useState('Severe Fatigue / Sleep Deficit');
    const [additionalComments, setAdditionalComments] = useState('');
    const [submittingLeave, setSubmittingLeave] = useState(false);
    const [leaveSuccess, setLeaveSuccess] = useState('');

    const fetchDriverData = async () => {
        try {
            // Default driver profile for Rajesh Kumar (DRV001)
            const driverId = user?.employee_id === 'TGS-DRV-001' ? 'DRV001' : (user?.employee_id || 'DRV001');
            const [staffRes, shiftsRes] = await Promise.all([
                api.getStaffById(driverId),
                api.getShifts({ driverId })
            ]);
            if (staffRes.data) setMyStaffRecord(staffRes.data);
            if (shiftsRes.data) setMyShifts(shiftsRes.data);
        } catch (err) {
            console.error('Failed to load driver profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDriverData();
    }, [user]);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        if (!myStaffRecord) return;
        setSubmittingLeave(true);
        try {
            const finalReason = additionalComments.trim() 
                ? `${leaveType}: ${leaveReason} (${additionalComments.trim()})`
                : `${leaveType}: ${leaveReason}`;
            const res = await api.applyEmergencyLeave(myStaffRecord.id, finalReason);
            if (res.success) {
                setLeaveSuccess(res.message);
                setTimeout(() => {
                    setLeaveSuccess('');
                    setAdditionalComments('');
                    setShowLeaveModal(false);
                    fetchDriverData();
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to apply leave:', err);
        } finally {
            setSubmittingLeave(false);
        }
    };

    const fc = myStaffRecord ? getFatigueClass(myStaffRecord.fatigueLevel) : { color: 'success', label: 'Optimal' };
    const hc = myStaffRecord ? getHealthClass(myStaffRecord.healthScore) : { color: 'success', label: 'Fit' };
    const isOnLeave = myStaffRecord?.status === 'Emergency Leave' || myStaffRecord?.status === 'On Leave';

    return (
        <div style={{ maxWidth: 1050, margin: '0 auto', padding: '1rem' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(6, 182, 212, 0.12))',
                border: '1px solid rgba(34, 197, 94, 0.25)',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 6 }}>
                        <span style={{
                            display: 'inline-block',
                            background: '#22c55e',
                            color: '#0f172a',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                        }}>
                            Driver & Crew Portal
                        </span>
                        <span className={`badge ${isOnLeave ? 'danger' : myStaffRecord?.status === 'On Duty' ? 'success' : 'neutral'}`}>
                            {myStaffRecord?.status || 'Active'}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '1.5rem', color: '#f8fafc', margin: '0 0 4px 0' }}>
                        Welcome, {myStaffRecord?.name || user?.name || 'Rajesh Kumar'}
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                        Staff ID: <strong style={{ color: '#06b6d4' }}>{myStaffRecord?.id || 'DRV001'}</strong> • Depot: {myStaffRecord?.depotLocation || 'MGBS, Hyderabad'} • Blood Group: {myStaffRecord?.bloodGroup || 'O+'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* Apply Leave Button in Header */}
                    {!isOnLeave ? (
                        <button 
                            onClick={() => setShowLeaveModal(true)}
                            className="btn btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                            }}
                        >
                            <AlertOctagon size={16} /> Apply Leave / Relief
                        </button>
                    ) : (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#f87171',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}>
                            On {myStaffRecord?.status}
                        </div>
                    )}

                    <button onClick={logout} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* If Driver is currently on leave, show notification banner */}
            {isOnLeave && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <AlertOctagon size={24} color="#ef4444" />
                    <div>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>
                            You are currently on {myStaffRecord?.status}
                        </div>
                        <div style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: 2 }}>
                            Reason Logged: <em>"{myStaffRecord?.leaveReason || 'Relieved from duty'}"</em>. Your active dispatches have been safely deallocated.
                        </div>
                    </div>
                </div>
            )}

            {/* Health & Fatigue Metric Widgets */}
            <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="kpi-card">
                    <div className="kpi-icon green"><Heart size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Health Fitness Score</div>
                        <div className="kpi-value">{myStaffRecord?.healthScore || 82}%</div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className={`kpi-icon ${fc.color === 'danger' ? 'red' : fc.color === 'warning' ? 'amber' : 'cyan'}`}>
                        <Activity size={22} />
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-label">Current Fatigue Index</div>
                        <div className="kpi-value">{myStaffRecord?.fatigueLevel || 35}%</div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon cyan"><Clock size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Duty Hours Today</div>
                        <div className="kpi-value">{myStaffRecord?.hoursWorked || 6.5}h</div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon purple"><Award size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Consecutive Rest Hours</div>
                        <div className="kpi-value">{myStaffRecord?.restHours || 12}h</div>
                    </div>
                </div>
            </div>

            {/* Leave & Relief Quick Card */}
            <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
                        <FileText size={22} color="#f87171" />
                    </div>
                    <div>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>
                            Driver Wellness & Immediate Relief Request
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 2 }}>
                            Feeling fatigued, unwell, or have a family emergency? Submit leave to automatically relieve your shifts.
                        </div>
                    </div>
                </div>
                {!isOnLeave && (
                    <button
                        onClick={() => setShowLeaveModal(true)}
                        className="btn btn-secondary"
                        style={{
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderColor: 'rgba(239, 68, 68, 0.4)',
                            color: '#f87171'
                        }}
                    >
                        <AlertOctagon size={16} /> Request Leave
                    </button>
                )}
            </div>

            {/* My Rostered Shifts */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="#06b6d4" /> My Roster & Dispatches
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {myShifts.length} assignments logged
                    </span>
                </div>

                {myShifts.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No active shifts scheduled.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {myShifts.map(s => (
                            <div key={s.id} style={{
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                                        {s.routeName} <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>({s.routeId})</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
                                        {s.origin} ➔ {s.destination} • Bus: {s.busNumber || 'Assigned'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                                            {s.startTime} – {s.endTime}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.date}</div>
                                    </div>
                                    <span className={`badge ${s.status === 'Active' ? 'success' : s.status === 'Scheduled' ? 'info' : s.status === 'Cancelled' ? 'danger' : 'neutral'}`}>
                                        {s.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Apply Leave Modal */}
            {showLeaveModal && (
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
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '480px',
                        padding: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertOctagon size={22} color="#ef4444" />
                                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>Driver Leave Application</h3>
                            </div>
                            <button onClick={() => setShowLeaveModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {leaveSuccess ? (
                            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                ✓ {leaveSuccess}
                            </div>
                        ) : (
                            <form onSubmit={handleApplyLeave}>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 700 }}>
                                        {myStaffRecord?.name} ({myStaffRecord?.id}) • Driver
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                                        Current Fatigue Level: <strong style={{ color: '#ef4444' }}>{myStaffRecord?.fatigueLevel}%</strong> • Route: {myStaffRecord?.assignedRoute || 'Unassigned'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: 4 }}>
                                        ⚠️ Submitting leave will immediately mark your status as on leave and unassign today's scheduled dispatches to ensure road safety.
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Leave Type *
                                    </label>
                                    <select
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value)}
                                        style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
                                    >
                                        <option value="Emergency Leave">Emergency Leave (Immediate Effect)</option>
                                        <option value="Medical Rest Leave">Medical Rest Leave (Fatigue / Health)</option>
                                        <option value="Casual Personal Leave">Casual Personal Leave</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Reason / Symptoms *
                                    </label>
                                    <select
                                        value={leaveReason}
                                        onChange={(e) => setLeaveReason(e.target.value)}
                                        style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}
                                    >
                                        <option value="Severe Fatigue / Sleep Deficit">Severe Fatigue / Sleep Deficit</option>
                                        <option value="Drowsiness & Delayed Reflexes">Drowsiness & Delayed Reflexes</option>
                                        <option value="Acute Illness / Fever / Body Ache">Acute Illness / Fever / Body Ache</option>
                                        <option value="Family Medical Emergency">Family Medical Emergency</option>
                                        <option value="Other / Personal Emergency">Other / Personal Emergency</option>
                                    </select>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                                        Additional Comments (Optional):
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={additionalComments}
                                        onChange={(e) => setAdditionalComments(e.target.value)}
                                        placeholder="Type any additional comments here..."
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                    <button type="button" onClick={() => setShowLeaveModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={submittingLeave}
                                        style={{
                                            background: '#ef4444',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Check size={16} /> {submittingLeave ? 'Submitting...' : 'Confirm & Relief Duty'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
