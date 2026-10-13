import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, Zap, AlertTriangle, CheckCircle2, Clock, ArrowDown, ArrowUp, Sparkles, Plus, RefreshCw, X, Check } from 'lucide-react'
import { api } from '../utils/api'
import { flagHighRiskAssignments, optimizeShifts, getFatigueClass } from '../utils/fatigueEngine'

export default function Shifts() {
    const navigate = useNavigate()
    const [shiftsList, setShiftsList] = useState([])
    const [staffList, setStaffList] = useState([])
    const [routesList, setRoutesList] = useState([])
    const [busesList, setBusesList] = useState([])
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState('all')
    const [isOptimized, setIsOptimized] = useState(false)
    const [optimizedData, setOptimizedData] = useState(null)

    // Schedule Shift Modal
    const [showModal, setShowModal] = useState(false)
    const [modalError, setModalError] = useState('')
    const [modalSuccess, setModalSuccess] = useState('')
    const [newShift, setNewShift] = useState({
        driverId: '',
        conductorId: '',
        routeId: '',
        busNumber: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '06:00',
        endTime: '14:00',
        notes: ''
    })

    const resetShiftForm = (driversList = staffList.filter(s => s.role === 'Driver'), conductorsList = staffList.filter(s => s.role === 'Conductor'), rList = routesList, bList = busesList) => {
        setNewShift({
            driverId: driversList[0]?.id || '',
            conductorId: conductorsList[0]?.id || '',
            routeId: rList[0]?.id || '',
            busNumber: bList[0]?.busNumber || '',
            date: new Date().toISOString().split('T')[0],
            startTime: '06:00',
            endTime: '14:00',
            notes: ''
        })
    }

    const loadData = async () => {
        try {
            setLoading(true)
            const [shRes, stRes, rtRes, busRes] = await Promise.all([
                api.getShifts(),
                api.getStaff(),
                api.getRoutes(),
                api.getBuses()
            ])
            if (shRes.data) setShiftsList(shRes.data)
            if (stRes.data) {
                setStaffList(stRes.data)
                // Set default dropdown selections
                const drivers = stRes.data.filter(s => s.role === 'Driver')
                const conductors = stRes.data.filter(s => s.role === 'Conductor')
                if (drivers.length && !newShift.driverId) setNewShift(prev => ({ ...prev, driverId: drivers[0].id }))
                if (conductors.length && !newShift.conductorId) setNewShift(prev => ({ ...prev, conductorId: conductors[0].id }))
            }
            if (rtRes.data) {
                setRoutesList(rtRes.data)
                if (rtRes.data.length && !newShift.routeId) setNewShift(prev => ({ ...prev, routeId: rtRes.data[0].id }))
            }
            if (busRes.data) {
                setBusesList(busRes.data)
                if (busRes.data.length && !newShift.busNumber) {
                    setNewShift(prev => ({ ...prev, busNumber: busRes.data[0].busNumber }))
                }
            }
        } catch (err) {
            console.error('Failed to load shifts:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const drivers = staffList.filter(s => s.role === 'Driver')
    const conductors = staffList.filter(s => s.role === 'Conductor')

    // Run fatigue policy analyzer on live DB records
    const analyzed = flagHighRiskAssignments(shiftsList, staffList, routesList)

    const activeShifts = analyzed.filter(s => s.status === 'Active')
    const scheduledShifts = analyzed.filter(s => s.status === 'Scheduled')
    const completedShifts = analyzed.filter(s => s.status === 'Completed')

    const displayShifts = activeTab === 'active' ? activeShifts : 
                          activeTab === 'scheduled' ? scheduledShifts : 
                          activeTab === 'completed' ? completedShifts : analyzed

    const handleOptimize = () => {
        const result = optimizeShifts(shiftsList, staffList, routesList)
        setOptimizedData(result)
        setIsOptimized(true)
    }

    const handleReset = () => {
        setIsOptimized(false)
        setOptimizedData(null)
    }

    const handleCreateShift = async (e) => {
        e.preventDefault()
        setModalError('')
        setModalSuccess('')
        if (!newShift.driverId || !newShift.conductorId || !newShift.routeId || !newShift.date) {
            setModalError('Please fill in all mandatory shift parameters.')
            return
        }

        try {
            const res = await api.createShift(newShift)
            if (res.success) {
                setModalSuccess(res.message || 'Shift scheduled successfully!')
                setTimeout(() => {
                    setShowModal(false)
                    setModalSuccess('')
                    loadData()
                    resetShiftForm()
                }, 1000)
            } else {
                setModalError(res.message || 'Failed to schedule shift. Please verify shift details or login role.')
            }
        } catch (err) {
            console.error('Shift creation error:', err)
            setModalError(err.message || 'Error communicating with server while scheduling shift.')
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.updateShiftStatus(id, newStatus)
            loadData()
        } catch (err) {
            console.error('Failed to update status:', err)
        }
    }

    const totalActive = activeShifts.length
    const totalScheduled = scheduledShifts.length
    const highRisk = analyzed.filter(s => s.riskLevel === 'critical').length
    const violations = analyzed.reduce((sum, s) => sum + (s.violations ? s.violations.length : 0), 0)

    const handleOpenModal = () => {
        setModalError('')
        setModalSuccess('')
        // Pre-fill defaults if not already set
        if (!newShift.driverId && drivers.length) newShift.driverId = drivers[0].id
        if (!newShift.conductorId && conductors.length) newShift.conductorId = conductors[0].id
        if (!newShift.routeId && routesList.length) newShift.routeId = routesList[0].id
        if (!newShift.busNumber && busesList.length) newShift.busNumber = busesList[0].busNumber
        setShowModal(true)
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Shift Scheduling & Duty Roster</h1>
                    <p>Fatigue-Aware Roster Optimization & Real-Time Dispatch (Connected to MariaDB)</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        type="button"
                        onClick={() => navigate('/shifts/create')}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <Plus size={16} /> Schedule Shift
                    </button>
                    <button 
                        onClick={loadData}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card animate-slideUp stagger-1">
                    <div className="kpi-icon green"><CheckCircle2 size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Active Shifts</div>
                        <div className="kpi-value">{totalActive}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-2">
                    <div className="kpi-icon cyan"><CalendarClock size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Scheduled</div>
                        <div className="kpi-value">{totalScheduled}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-3">
                    <div className="kpi-icon red"><AlertTriangle size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">High-Risk Assignments</div>
                        <div className="kpi-value">{highRisk}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-4">
                    <div className="kpi-icon amber"><Zap size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Policy Violations</div>
                        <div className="kpi-value">{violations}</div>
                    </div>
                </div>
            </div>

            {/* AI Optimization Banner */}
            <div className="optimization-banner animate-slideUp stagger-2" style={{ marginTop: '1.25rem' }}>
                <div className="opt-left">
                    <div className="opt-icon"><Sparkles size={24} /></div>
                    <div>
                        <div className="opt-title">AI Shift Optimization Engine</div>
                        <div className="opt-desc">
                            {isOptimized
                                ? `Optimized ${optimizedData?.reassignedCount || 0} high-risk assignments. Average fatigue risk reduced by ${optimizedData?.riskReduction || 0}%.`
                                : 'Detect fatigue conflicts, insufficient rest periods, and high-difficulty routes before assigning shifts.'}
                        </div>
                    </div>
                </div>
                <div className="opt-actions">
                    {isOptimized ? (
                        <button className="btn btn-secondary" onClick={handleReset}>Reset Roster</button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleOptimize}>
                            <Sparkles size={16} style={{ marginRight: 6 }} /> Run Optimization
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-group" style={{ margin: '1.5rem 0 1rem' }}>
                <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                    All Dispatches ({analyzed.length})
                </button>
                <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                    Active ({activeShifts.length})
                </button>
                <button className={`tab-btn ${activeTab === 'scheduled' ? 'active' : ''}`} onClick={() => setActiveTab('scheduled')}>
                    Scheduled ({scheduledShifts.length})
                </button>
                <button className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                    Completed ({completedShifts.length})
                </button>
            </div>

            {/* Policy Info */}
            <div style={{
                display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', flexWrap: 'wrap',
            }}>
                <span>📋 Max Shift: <strong style={{ color: 'var(--text-secondary)' }}>8 hours</strong></span>
                <span>💤 Min Rest: <strong style={{ color: 'var(--text-secondary)' }}>10 hours</strong></span>
                <span>⚠️ Fatigue Threshold: <strong style={{ color: 'var(--text-secondary)' }}>70%</strong></span>
                <span>🛣️ Ghat Route Limit: <strong style={{ color: 'var(--text-secondary)' }}>7 hours</strong></span>
            </div>

            {/* Shift Timeline */}
            <div className="shift-timeline">
                {displayShifts.map(shift => {
                    const fc = getFatigueClass(shift.calculatedRisk || shift.fatigueRisk)
                    const riskValue = isOptimized && optimizedData
                        ? (optimizedData.shifts.find(s => s.id === shift.id)?.optimizedRisk || shift.calculatedRisk)
                        : (shift.calculatedRisk || shift.fatigueRisk)
                    const fcDisplay = getFatigueClass(riskValue)
                    const optShift = isOptimized && optimizedData ? optimizedData.shifts.find(s => s.id === shift.id) : null

                    return (
                        <div key={shift.id} className="shift-row" style={{
                            borderLeft: `3px solid ${fc.cssColor}`,
                        }}>
                            <div className="shift-row-time">
                                <Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                {shift.startTime} – {shift.endTime}
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{shift.date}</div>
                            </div>
                            <div className="shift-row-driver" style={{ minWidth: 170 }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{shift.driverName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Driver: {shift.driverId}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Cond: {shift.conductorName || shift.conductorId}</div>
                            </div>
                            <div className="shift-row-route" style={{ minWidth: 160 }}>
                                <div>{shift.routeName || shift.routeId}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{shift.routeId} • Bus: {shift.busNumber || 'Assigned'}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                {shift.violations && shift.violations.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {shift.violations.map((v, i) => (
                                            <span key={i} className="badge danger" style={{ fontSize: '0.65rem' }}>⚠ {v}</span>
                                        ))}
                                    </div>
                                )}
                                {optShift?.optimized && (
                                    <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: 4, fontStyle: 'italic' }}>
                                        💡 {optShift.recommendation}
                                    </div>
                                )}
                            </div>
                            <div className="shift-row-risk">
                                <span className={`badge ${fcDisplay.color}`}>
                                    {riskValue}% {fcDisplay.label}
                                    {isOptimized && optShift?.optimized && (
                                        <span style={{ marginLeft: 4 }}>
                                            <ArrowDown size={12} />
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <select 
                                    value={shift.status} 
                                    onChange={(e) => handleStatusChange(shift.id, e.target.value)}
                                    style={{
                                        background: '#1e293b',
                                        color: shift.status === 'Active' ? '#22c55e' : shift.status === 'Scheduled' ? '#38bdf8' : '#94a3b8',
                                        border: '1px solid #334155',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Schedule Shift Modal */}
            {showModal && (
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
                    zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '540px',
                        padding: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>Schedule New Duty Shift</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {modalError && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                {modalError}
                            </div>
                        )}

                        {modalSuccess && (
                            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Check size={16} /> {modalSuccess}
                            </div>
                        )}

                        <form onSubmit={handleCreateShift}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Assign Driver *</label>
                                    <select 
                                        value={newShift.driverId}
                                        onChange={(e) => setNewShift({ ...newShift, driverId: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    >
                                        {drivers.map(d => (
                                            <option key={d.id} value={d.id}>{d.name} ({d.id}) - Fatigue {d.fatigueLevel}%</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Assign Conductor *</label>
                                    <select 
                                        value={newShift.conductorId}
                                        onChange={(e) => setNewShift({ ...newShift, conductorId: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    >
                                        {conductors.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Select Route *</label>
                                    <select 
                                        value={newShift.routeId}
                                        onChange={(e) => setNewShift({ ...newShift, routeId: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    >
                                        {routesList.map(r => (
                                            <option key={r.id} value={r.id}>{r.id}: {r.name} ({r.terrain})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Bus Vehicle</label>
                                    <select
                                        value={newShift.busNumber}
                                        onChange={(e) => setNewShift({ ...newShift, busNumber: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    >
                                        <option value="">-- Auto-Assign Available Bus --</option>
                                        {busesList.map(b => (
                                            <option key={b.busNumber} value={b.busNumber}>
                                                {b.busNumber} ({b.busType} - {b.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Shift Date *</label>
                                    <input 
                                        type="date"
                                        value={newShift.date}
                                        onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Start Time</label>
                                    <input 
                                        type="time"
                                        value={newShift.startTime}
                                        onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>End Time</label>
                                    <input 
                                        type="time"
                                        value={newShift.endTime}
                                        onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Dispatch Notes</label>
                                <input 
                                    type="text"
                                    placeholder="Optional notes or instructions..."
                                    value={newShift.notes}
                                    onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Check size={16} /> Save & Calculate Fatigue Risk
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
