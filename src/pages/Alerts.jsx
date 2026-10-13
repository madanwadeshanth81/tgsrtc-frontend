import React, { useState, useEffect } from 'react'
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, Filter, X, Eye, RefreshCw } from 'lucide-react'
import { api } from '../utils/api'

export default function Alerts() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState('All')
    const [showAcknowledged, setShowAcknowledged] = useState(true)

    const loadAlerts = async () => {
        try {
            setLoading(true)
            const res = await api.getAlerts()
            if (res.data) setAlerts(res.data)
        } catch (err) {
            console.error('Failed to load alerts from DB:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAlerts()
        const interval = setInterval(loadAlerts, 15000)
        return () => clearInterval(interval)
    }, [])

    const filtered = alerts.filter(a => {
        const matchType = filterType === 'All' || a.type === filterType
        const matchAck = showAcknowledged || !a.acknowledged
        return matchType && matchAck
    })

    const handleAcknowledge = async (id) => {
        try {
            await api.acknowledgeAlert(id)
            setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
        } catch (err) {
            console.error('Failed to acknowledge alert:', err)
        }
    }

    const criticalCount = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length
    const warningCount = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length
    const infoCount = alerts.filter(a => a.type === 'info' && !a.acknowledged).length
    const totalActive = alerts.filter(a => !a.acknowledged).length

    const getAlertIcon = (type) => {
        if (type === 'critical') return <AlertTriangle size={20} style={{ color: '#ef4444' }} />
        if (type === 'warning') return <AlertCircle size={20} style={{ color: '#f59e0b' }} />
        return <Info size={20} style={{ color: '#3b82f6' }} />
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Alerts & Policy Violations</h1>
                    <p>Live Fatigue Threshold Warnings & Operational Compliance (Connected to MariaDB)</p>
                </div>
                <div>
                    <button 
                        onClick={loadAlerts}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card animate-slideUp stagger-1">
                    <div className="kpi-icon red"><AlertTriangle size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Critical</div>
                        <div className="kpi-value">{criticalCount}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-2">
                    <div className="kpi-icon amber"><AlertCircle size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Warnings</div>
                        <div className="kpi-value">{warningCount}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-3">
                    <div className="kpi-icon cyan"><Info size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Info</div>
                        <div className="kpi-value">{infoCount}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-4">
                    <div className="kpi-icon purple"><Bell size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Active</div>
                        <div className="kpi-value">{totalActive}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="toolbar" style={{ margin: '1.5rem 0 1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Filter size={15} style={{ color: 'var(--accent-primary)' }} />
                        <span>Severity:</span>
                    </div>
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                    >
                        <option value="All">All Severity Types</option>
                        <option value="critical">Critical</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                    </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={showAcknowledged}
                        onChange={(e) => setShowAcknowledged(e.target.checked)}
                        style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Include Acknowledged Alerts
                </label>
            </div>

            {/* Alerts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map(alert => (
                    <div
                        key={alert.id}
                        className={`alert-card ${alert.type} animate-slideUp`}
                        style={{
                            opacity: alert.acknowledged ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <div className="alert-icon">
                            {getAlertIcon(alert.type)}
                        </div>
                        <div className="alert-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 2 }}>
                                <span className="alert-title">{alert.title}</span>
                                <span className={`badge ${alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}`} style={{ fontSize: '0.65rem' }}>
                                    {alert.type.toUpperCase()}
                                </span>
                                {alert.acknowledged && (
                                    <span className="badge neutral" style={{ fontSize: '0.65rem' }}>Acknowledged</span>
                                )}
                            </div>
                            <div className="alert-message">{alert.message}</div>
                            {alert.driverId && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                                    Associated Personnel: <strong style={{ color: 'var(--accent-primary)' }}>{alert.driverName ? `${alert.driverName} (${alert.driverId})` : alert.driverId}</strong>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <span className="alert-time">{alert.time}</span>
                            {!alert.acknowledged && (
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                    onClick={() => handleAcknowledge(alert.id)}
                                >
                                    <CheckCircle size={14} style={{ marginRight: 4 }} /> Acknowledge
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
