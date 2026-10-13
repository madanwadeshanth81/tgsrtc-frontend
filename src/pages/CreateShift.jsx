import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CalendarClock, ArrowLeft, Check, AlertTriangle, Shield,
    User, Award, Bus, MapPin, Clock, Sparkles
} from 'lucide-react'
import { api } from '../utils/api'

export default function CreateShiftPage() {
    const navigate = useNavigate()
    const [staffList, setStaffList] = useState([])
    const [routesList, setRoutesList] = useState([])
    const [busesList, setBusesList] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [form, setForm] = useState({
        driverId: '',
        conductorId: '',
        routeId: '',
        busNumber: '',
        date: '',
        startTime: '',
        endTime: '',
        notes: ''
    })

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const [stRes, rtRes, busRes] = await Promise.all([
                    api.getStaff(),
                    api.getRoutes(),
                    api.getBuses()
                ])
                if (stRes.data) setStaffList(stRes.data)
                if (rtRes.data) setRoutesList(rtRes.data)
                if (busRes.data) setBusesList(busRes.data)
            } catch (err) {
                console.error('Failed to load form dependencies:', err)
                setError('Failed to load system references from MariaDB.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const drivers = staffList.filter(s => s.role === 'Driver')
    const conductors = staffList.filter(s => s.role === 'Conductor')
    const selectedDriver = drivers.find(d => d.id === form.driverId)
    const selectedRoute = routesList.find(r => r.id === form.routeId)

    // Calculate preview fatigue risk in real-time
    const previewRisk = (() => {
        if (!selectedDriver || !selectedRoute) return 30
        const restPenalty = (selectedDriver.restHours || 12) < 8 ? 25 : ((selectedDriver.restHours || 12) < 10 ? 15 : 0)
        const terrainMult = selectedRoute.terrain === 'Ghat' ? 1.4 : (selectedRoute.terrain === 'Urban' ? 1.2 : 1.0)
        return Math.min(100, Math.round(((selectedDriver.fatigueLevel || 20) * 0.5) + (selectedRoute.difficulty * 6 * terrainMult * 0.3) + restPenalty))
    })()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!form.driverId || !form.conductorId || !form.routeId || !form.date) {
            setError('Please complete all mandatory fields (*).')
            return
        }

        try {
            setSubmitting(true)
            const res = await api.createShift(form)
            if (res.success) {
                setSuccess(res.message || 'Shift scheduled successfully!')
                setTimeout(() => {
                    navigate('/shifts')
                }, 1200)
            } else {
                setError(res.message || 'Failed to schedule shift. Verify selections.')
            }
        } catch (err) {
            setError(err.message || 'Server error while scheduling shift.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="animate-fadeIn" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => navigate('/shifts')}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <ArrowLeft size={16} /> Back to Roster
                </button>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Schedule New Duty Shift</h1>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Create duty roster dispatch, assign crew, route, fleet vehicle & auto-evaluate fatigue
                    </p>
                </div>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Check size={18} />
                    <span>{success} Redirecting to Shift Roster...</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Form Card */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1.75rem'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Crew */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} /> 1. Crew Assignment
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Driver *
                                    </label>
                                    <select
                                        value={form.driverId}
                                        onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                        required
                                    >
                                        <option value="">-- Select Driver --</option>
                                        {drivers.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.name} ({d.id}) — Fatigue: {d.fatigueLevel}%
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Conductor *
                                    </label>
                                    <select
                                        value={form.conductorId}
                                        onChange={(e) => setForm({ ...form, conductorId: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                        required
                                    >
                                        <option value="">-- Select Conductor --</option>
                                        {conductors.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Route & Vehicle */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Bus size={16} /> 2. Route & Fleet Vehicle
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Assigned Route *
                                    </label>
                                    <select
                                        value={form.routeId}
                                        onChange={(e) => setForm({ ...form, routeId: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                        required
                                    >
                                        <option value="">-- Select Route --</option>
                                        {routesList.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.id}: {r.name} ({r.terrain} • {r.distance} km)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Bus Vehicle
                                    </label>
                                    <select
                                        value={form.busNumber}
                                        onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                    >
                                        <option value="">-- Auto-Assign Available Fleet Bus --</option>
                                        {busesList.map(b => (
                                            <option key={b.busNumber} value={b.busNumber}>
                                                {b.busNumber} ({b.busType} - {b.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Shift Date & Time */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={16} /> 3. Schedule Timings
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={form.startTime}
                                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={form.endTime}
                                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', padding: '0.65rem' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Dispatch Notes */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                                Dispatch Notes
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Peak hour morning express, depot platform 4..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="filter-select"
                                style={{ width: '100%', padding: '0.65rem' }}
                            />
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/shifts')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem 1.5rem' }}
                            >
                                <Check size={18} />
                                {submitting ? 'Saving to Database...' : 'Save & Calculate Fatigue Risk'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Telemetry Risk Preview Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.5rem'
                    }}>
                        <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={16} style={{ color: '#06b6d4' }} /> Telemetry Risk Preview
                        </h4>

                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: previewRisk >= 70 ? '#ef4444' : previewRisk >= 50 ? '#f59e0b' : '#22c55e'
                            }}>
                                {previewRisk}%
                            </div>
                            <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                color: previewRisk >= 70 ? '#ef4444' : previewRisk >= 50 ? '#f59e0b' : '#22c55e'
                            }}>
                                {previewRisk >= 70 ? 'Critical Risk' : previewRisk >= 50 ? 'Moderate Risk' : 'Low Fatigue Risk'}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Driver Fatigue:</span>
                                <strong style={{ color: 'var(--text-primary)' }}>{selectedDriver?.fatigueLevel || 0}%</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Driver Rest Hours:</span>
                                <strong style={{ color: 'var(--text-primary)' }}>{selectedDriver?.restHours || 12} hrs</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Route Difficulty:</span>
                                <strong style={{ color: 'var(--text-primary)' }}>{selectedRoute?.difficulty || 5}/10</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Route Terrain:</span>
                                <strong style={{ color: 'var(--text-primary)' }}>{selectedRoute?.terrain || 'Highway'}</strong>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(6, 182, 212, 0.05)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6
                    }}>
                        <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '4px' }}>TGSRTC Policy Guardrails:</strong>
                        • Max continuous shift duration: 8 hours<br />
                        • Minimum mandatory rest between shifts: 10 hours<br />
                        • Automatic alerts generated if fatigue risk exceeds 80%
                    </div>
                </div>
            </div>
        </div>
    )
}
