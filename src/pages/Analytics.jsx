import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Download, Users, Shield, Clock as ClockIcon, RefreshCw } from 'lucide-react'
import { api } from '../utils/api'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const COLORS = ['#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#14b8a6']

export default function Analytics() {
    const [activeTab, setActiveTab] = useState('fatigue')
    const [monthlyData, setMonthlyData] = useState([])
    const [incidentsList, setIncidentsList] = useState([])
    const [staffList, setStaffList] = useState([])
    const [routesList, setRoutesList] = useState([])
    const [loading, setLoading] = useState(true)

    const loadAnalytics = async () => {
        try {
            setLoading(true)
            const [mRes, iRes, sRes, rRes] = await Promise.all([
                api.getMonthlyAnalytics(),
                api.getIncidents(),
                api.getStaff(),
                api.getRoutes()
            ])
            if (mRes.data) setMonthlyData(mRes.data)
            if (iRes.data) setIncidentsList(iRes.data)
            if (sRes.data) setStaffList(sRes.data)
            if (rRes.data) setRoutesList(rRes.data)
        } catch (err) {
            console.error('Failed to load analytics:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAnalytics()
    }, [])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: '#1a2237', border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '8px', padding: '10px 14px', fontSize: '0.8rem',
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

    // Incident breakdown
    const incidentBySeverity = [
        { name: 'High', value: incidentsList.filter(i => i.severity === 'High').length },
        { name: 'Medium', value: incidentsList.filter(i => i.severity === 'Medium').length },
        { name: 'Low', value: incidentsList.filter(i => i.severity === 'Low').length },
    ]

    const incidentByTime = [
        { time: '00-04', count: 1 },
        { time: '04-08', count: 4 },
        { time: '08-12', count: 2 },
        { time: '12-16', count: 1 },
        { time: '16-20', count: 1 },
        { time: '20-24', count: 1 },
    ]

    // Stakeholder impact radar
    const stakeholderData = [
        { factor: 'Passenger Safety', current: 68, target: 95 },
        { factor: 'Driver Health', current: 72, target: 90 },
        { factor: 'Shift Compliance', current: 80, target: 95 },
        { factor: 'On-Time Performance', current: 75, target: 90 },
        { factor: 'Cost Efficiency', current: 82, target: 88 },
        { factor: 'Employee Satisfaction', current: 63, target: 85 },
    ]

    // Route fatigue correlation
    const routeFatigueData = routesList.slice(0, 10).map(r => ({
        name: r.id,
        difficulty: r.difficulty,
        traffic: r.trafficIndex,
        incidents: r.incidents,
    }))

    // CSV Export function for B.Tech Viva demonstration
    const exportCSV = () => {
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += 'Month,Average_Fatigue,Absenteeism_Rate,Incidents_Count,Shift_Compliance,Delays,Satisfaction\n'
        monthlyData.forEach(row => {
            csvContent += `${row.month},${row.avgFatigue},${row.absenteeism},${row.incidents},${row.shiftCompliance},${row.delays},${row.satisfaction}\n`
        })
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `TGSRTC_Fatigue_Analytics_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="animate-fadeIn">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Analytics & Intelligence Hub</h1>
                    <p>Quantitative analysis of driver fatigue dynamics, shift safety, and systemic metrics</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        onClick={exportCSV}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <Download size={16} /> Export CSV Report
                    </button>
                    <button 
                        onClick={loadAnalytics}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Tab navigation */}
            <div className="tab-group" style={{ marginBottom: '1.5rem' }}>
                <button className={`tab-btn ${activeTab === 'fatigue' ? 'active' : ''}`} onClick={() => setActiveTab('fatigue')}>
                    Fatigue Dynamics
                </button>
                <button className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>
                    Safety & Incidents
                </button>
                <button className={`tab-btn ${activeTab === 'stakeholders' ? 'active' : ''}`} onClick={() => setActiveTab('stakeholders')}>
                    Stakeholder Impact
                </button>
                <button className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`} onClick={() => setActiveTab('trends')}>
                    Longitudinal Trends
                </button>
            </div>

            {/* TAB 1: Fatigue Dynamics */}
            {activeTab === 'fatigue' && (
                <div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>📈 Monthly Fatigue Progression vs Policy Limit</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} domain={[30, 80]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="avgFatigue" name="Avg Fleet Fatigue %" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey={() => 70} name="Safety Threshold (70%)" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>🛣️ Route Difficulty vs Incident Correlation</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={routeFatigueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="difficulty" name="Difficulty (1-10)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="incidents" name="Incidents Logged" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Safety & Incidents */}
            {activeTab === 'safety' && (
                <div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>⚠️ Incident Severity Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={incidentBySeverity} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value">
                                        <Cell fill="#ef4444" />
                                        <Cell fill="#f59e0b" />
                                        <Cell fill="#3b82f6" />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend formatter={(value) => <span style={{ color: '#94a3b8' }}>{value} Severity</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>⏰ Incident Frequency by Time of Day</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={incidentByTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" name="Incidents" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Stakeholders */}
            {activeTab === 'stakeholders' && (
                <div className="charts-grid">
                    <div className="chart-card" style={{ gridColumn: 'span 2' }}>
                        <h3>🎯 Stakeholder Impact Balanced Scorecard</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart cx="50%" cy="50%" outerRadius={120} data={stakeholderData}>
                                <PolarGrid stroke="rgba(148,163,184,0.15)" />
                                <PolarAngleAxis dataKey="factor" stroke="#94a3b8" fontSize={12} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                                <Radar name="Current Performance" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                                <Radar name="Target SLA Benchmark" dataKey="target" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                                <Legend />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* TAB 4: Longitudinal Trends */}
            {activeTab === 'trends' && (
                <div>
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>📊 Shift Compliance vs Delays</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="shiftCompliance" name="Compliance %" stroke="#22c55e" strokeWidth={2.5} />
                                    <Line type="monotone" dataKey="delays" name="Total Delays (min)" stroke="#f59e0b" strokeWidth={2.5} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>⭐ Commuter & Staff Satisfaction Index</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} domain={[50, 100]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="satisfaction" name="Satisfaction %" stroke="#8b5cf6" fill="url(#satGrad)" strokeWidth={2.5} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
