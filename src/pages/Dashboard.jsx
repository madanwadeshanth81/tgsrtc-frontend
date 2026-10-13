import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Users, Bus, AlertTriangle, Activity, Clock, TrendingDown,
    TrendingUp, Minus, Shield, ArrowUpRight, ArrowDownRight, RefreshCw,
    Plus, CalendarClock, X, Check, Trash2
} from 'lucide-react'
import { api } from '../utils/api'
import { useAuth } from '../utils/AuthContext'
import { getFatigueClass } from '../utils/fatigueEngine'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(null)
    const [staffList, setStaffList] = useState([])
    const [routesList, setRoutesList] = useState([])
    const [busesList, setBusesList] = useState([])
    const [incidentsList, setIncidentsList] = useState([])
    const [alertsList, setAlertsList] = useState([])
    const [monthlyData, setMonthlyData] = useState([])
    const [passengersList, setPassengersList] = useState([])

    // Quick Schedule Shift Modal for Admin
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

    const loadData = async () => {
        try {
            setLoading(true)
            const [sumRes, staffRes, routesRes, incidentsRes, alertsRes, monthRes, busRes, usersRes] = await Promise.all([
                api.getDashboardSummary(),
                api.getStaff(),
                api.getRoutes(),
                api.getIncidents(),
                api.getAlerts({ acknowledged: 'false' }),
                api.getMonthlyAnalytics(),
                api.getBuses(),
                api.getUsers({ role: 'PASSENGER' }).catch(() => ({ data: [] }))
            ])

            if (sumRes.kpis) setSummary(sumRes.kpis)
            if (usersRes?.data) setPassengersList(usersRes.data)
            if (staffRes.data) {
                setStaffList(staffRes.data)
                const drivers = staffRes.data.filter(s => s.role === 'Driver')
                const conductors = staffRes.data.filter(s => s.role === 'Conductor')
                if (drivers.length && !newShift.driverId) setNewShift(prev => ({ ...prev, driverId: drivers[0].id }))
                if (conductors.length && !newShift.conductorId) setNewShift(prev => ({ ...prev, conductorId: conductors[0].id }))
            }
            if (routesRes.data) {
                setRoutesList(routesRes.data)
                if (routesRes.data.length && !newShift.routeId) setNewShift(prev => ({ ...prev, routeId: routesRes.data[0].id }))
            }
            if (busRes.data) {
                setBusesList(busRes.data)
                if (busRes.data.length && !newShift.busNumber) setNewShift(prev => ({ ...prev, busNumber: busRes.data[0].busNumber }))
            }
            if (incidentsRes.data) setIncidentsList(incidentsRes.data)
            if (alertsRes.data) setAlertsList(alertsRes.data)
            if (monthRes.data) setMonthlyData(monthRes.data)
        } catch (err) {
            console.error('Failed to load dashboard data from API:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        // Poll every 15s for real-time live data
        const interval = setInterval(loadData, 15000)
        return () => clearInterval(interval)
    }, [])

    const handleDeletePassenger = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete passenger '${name}' from database?`)) return;
        try {
            const res = await api.deleteUser(id);
            if (res.success) {
                setPassengersList(prev => prev.filter(p => p.id !== id));
            } else {
                alert(res.message || 'Failed to delete passenger account.');
            }
        } catch (err) {
            console.error('Failed to delete passenger:', err);
        }
    };

    const driversOnly = staffList.filter(s => s.role === 'Driver')
    const activeDrivers = summary?.onDuty || staffList.filter(d => d.status === 'On Duty').length
    const activeShifts = summary?.activeShifts || 0
    const avgFatigue = summary?.avgDriverFatigue || 0
    const highRiskAlerts = summary?.criticalAlerts || alertsList.filter(a => a.type === 'critical').length
    const totalIncidents = summary?.totalIncidents || incidentsList.length

    const fatigueDistribution = [
        { name: 'Low (<30)', value: driversOnly.filter(d => d.fatigueLevel < 30).length },
        { name: 'Moderate (30-50)', value: driversOnly.filter(d => d.fatigueLevel >= 30 && d.fatigueLevel < 50).length },
        { name: 'High (50-70)', value: driversOnly.filter(d => d.fatigueLevel >= 50 && d.fatigueLevel < 70).length },
        { name: 'Critical (70+)', value: driversOnly.filter(d => d.fatigueLevel >= 70).length },
    ]

    const routeDifficultyData = routesList.slice(0, 8).map(r => ({
        name: r.id,
        difficulty: r.difficulty,
        incidents: r.incidents,
    }))

    const recentAlerts = alertsList.slice(0, 4)

    const incidentByType = [
        { name: 'Fatigue-Related', value: incidentsList.filter(i => i.fatigueRelated).length },
        { name: 'Other Causes', value: incidentsList.filter(i => !i.fatigueRelated).length },
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: '#1a2237',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                }}>
                    <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>{label}</p>
                    {payload.map((entry, i) => (
                        <p key={i} style={{ color: entry.color, margin: '2px 0' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    const handleCreateShift = async (e) => {
        e.preventDefault()
        setModalError('')
        setModalSuccess('')
        if (!newShift.driverId || !newShift.conductorId || !newShift.routeId || !newShift.date) {
            setModalError('Please select a driver, conductor, route, and shift date.')
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
                }, 1200)
            } else {
                setModalError(res.message || 'Failed to schedule shift. Verify permissions or input.')
            }
        } catch (err) {
            setModalError(err.message || 'Error communicating with server while scheduling shift.')
        }
    }

    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER'

    return (
        <div>
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Operational Dashboard</h2>
                    <p>Live TGSRTC Driver Fatigue & Shift Management Telemetry (Connected to MariaDB)</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isAdminOrManager && (
                        <button
                            type="button"
                            onClick={() => navigate('/shifts/create')}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
                        >
                            <Plus size={15} /> Schedule Shift
                        </button>
                    )}
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                        DATABASE LIVE
                    </span>
                    <button 
                        onClick={loadData}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card blue animate-slideUp stagger-1">
                    <div className="stat-icon blue">
                        <Users size={22} />
                    </div>
                    <div className="stat-value">{activeDrivers}</div>
                    <div className="stat-label">On-Duty Drivers & Conductors</div>
                    <div className="stat-trend neutral">
                        <Minus size={14} /> Total Staff: {staffList.length}
                    </div>
                </div>

                <div className="stat-card green animate-slideUp stagger-2">
                    <div className="stat-icon green">
                        <Bus size={22} />
                    </div>
                    <div className="stat-value">{activeShifts}</div>
                    <div className="stat-label">Active Dispatched Shifts</div>
                    <div className="stat-trend positive">
                        <TrendingUp size={14} /> Scheduled: {summary?.scheduledShifts || 0}
                    </div>
                </div>

                <div className="stat-card amber animate-slideUp stagger-3">
                    <div className="stat-icon amber">
                        <Activity size={22} />
                    </div>
                    <div className="stat-value">{avgFatigue}%</div>
                    <div className="stat-label">Fleet Avg Fatigue Level</div>
                    <div className="stat-trend neutral">
                        <Minus size={14} /> Critical Drivers: {summary?.highFatigueCount || 0}
                    </div>
                </div>

                <div className="stat-card red animate-slideUp stagger-4">
                    <div className="stat-icon red">
                        <AlertTriangle size={22} />
                    </div>
                    <div className="stat-value">{highRiskAlerts}</div>
                    <div className="stat-label">Critical Fatigue Alerts</div>
                    <div className="stat-trend negative">
                        <ArrowUpRight size={14} /> Action Required
                    </div>
                </div>

                <div className="stat-card purple animate-slideUp stagger-5">
                    <div className="stat-icon purple">
                        <Shield size={22} />
                    </div>
                    <div className="stat-value">{totalIncidents}</div>
                    <div className="stat-label">Recorded Incidents</div>
                    <div className="stat-trend positive">
                        <TrendingDown size={14} /> Fatigue Related: {summary?.fatigueIncidents || 0}
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="charts-grid" style={{ marginBottom: '1.25rem' }}>
                <div className="chart-card animate-slideUp stagger-2">
                    <h3>📈 Fatigue vs Absenteeism Trend (Monthly)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="absGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area type="monotone" dataKey="avgFatigue" name="Avg Fatigue %" stroke="#06b6d4" fill="url(#fatGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="absenteeism" name="Absenteeism %" stroke="#f59e0b" fill="url(#absGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card animate-slideUp stagger-3">
                    <h3>🔴 Driver Fatigue Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={fatigueDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {fatigueDistribution.map((entry, index) => (
                                    <Cell key={index} fill={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'][index]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card animate-slideUp stagger-4">
                    <h3>🛣️ Route Difficulty vs Incidents</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={routeDifficultyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="difficulty" name="Difficulty" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="incidents" name="Incidents" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card animate-slideUp stagger-5">
                    <h3>⚠️ Incident Causes Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={incidentByType}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                <Cell fill="#ef4444" />
                                <Cell fill="#64748b" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="chart-card animate-slideUp stagger-6">
                <h3>🔔 Live Active Alerts (From Database)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {recentAlerts.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '1rem' }}>No active unacknowledged alerts.</p>
                    ) : (
                        recentAlerts.map(alert => (
                            <div key={alert.id} className={`alert-card ${alert.type}`}>
                                <AlertTriangle size={18} className="alert-icon" style={{ color: alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6' }} />
                                <div className="alert-content">
                                    <div className="alert-title">{alert.title}</div>
                                    <div className="alert-message">{alert.message}</div>
                                </div>
                                <div className="alert-time">{alert.time}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Registered Passenger Accounts (Admin Database Oversight) */}
            <div className="chart-card animate-slideUp stagger-6" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} style={{ color: '#f59e0b' }} />
                        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>
                            Registered Commuters & Passenger Accounts (Admin Database: tgsrtc_shift_management)
                        </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                            {passengersList.length} Accounts Stored
                        </span>
                        <Link 
                            to="/passengers" 
                            className="btn btn-primary" 
                            style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            Open Login Directory &rarr;
                        </Link>
                    </div>
                </div>

                <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Passenger ID</th>
                                <th>Username / Full Name</th>
                                <th>Email Address</th>
                                <th>Mobile Number</th>
                                <th>Login Password</th>
                                <th>Role</th>
                                <th>Registered In Database</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengersList.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                                        No registered passenger accounts found.
                                    </td>
                                </tr>
                            ) : (
                                passengersList.map(p => (
                                    <tr key={p.id}>
                                        <td><strong style={{ color: '#06b6d4' }}>{p.employee_id}</strong></td>
                                        <td style={{ fontWeight: 600, color: '#f8fafc' }}>{p.name}</td>
                                        <td style={{ color: '#94a3b8' }}>{p.email}</td>
                                        <td style={{ color: '#94a3b8' }}>{p.phone || 'N/A'}</td>
                                        <td>
                                            <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 600, background: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155', fontSize: '0.82rem' }}>
                                                {p.password || 'Password@123'}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                {p.role}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {p.created_at ? new Date(p.created_at).toLocaleString() : 'Recent'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDeletePassenger(p.id, p.name)}
                                                className="btn btn-danger"
                                                style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                                title="Delete passenger from database"
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Schedule Shift Modal */}
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
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '1.75rem',
                        width: '90%',
                        maxWidth: '580px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CalendarClock size={20} style={{ color: '#06b6d4' }} />
                                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>Schedule New Duty Shift</h3>
                            </div>
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
                                        {driversOnly.map(d => (
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
                                        {staffList.filter(s => s.role === 'Conductor').map(c => (
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
