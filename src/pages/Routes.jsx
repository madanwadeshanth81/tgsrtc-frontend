import React, { useState, useEffect } from 'react'
import { MapPin, Mountain, Gauge, AlertTriangle, Clock, TrendingUp, Car, RefreshCw, Filter, ArrowUpDown } from 'lucide-react'
import { api } from '../utils/api'

export default function RoutesPage() {
    const [routesList, setRoutesList] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('difficulty')
    const [terrainFilter, setTerrainFilter] = useState('All')

    const loadRoutes = async () => {
        try {
            setLoading(true)
            const res = await api.getRoutes()
            if (res.data) setRoutesList(res.data)
        } catch (err) {
            console.error('Failed to load routes from DB:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRoutes()
    }, [])

    const filtered = routesList
        .filter(r => terrainFilter === 'All' || r.terrain === terrainFilter)
        .sort((a, b) => {
            if (sortBy === 'difficulty') return b.difficulty - a.difficulty
            if (sortBy === 'distance') return b.distance - a.distance
            if (sortBy === 'incidents') return b.incidents - a.incidents
            return 0
        })

    const getDifficultyColor = (d) => {
        if (d >= 7) return '#ef4444'
        if (d >= 5) return '#f59e0b'
        if (d >= 3) return '#3b82f6'
        return '#22c55e'
    }

    const getTerrainIcon = (t) => {
        if (t === 'Ghat') return '⛰️'
        if (t === 'Urban') return '🏙️'
        if (t === 'Mixed') return '🛣️'
        return '🛤️'
    }

    const totalDistance = routesList.reduce((s, r) => s + r.distance, 0)
    const avgDifficulty = routesList.length ? (routesList.reduce((s, r) => s + r.difficulty, 0) / routesList.length).toFixed(1) : 0
    const totalIncidents = routesList.reduce((s, r) => s + r.incidents, 0)

    return (
        <div className="animate-fadeIn">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Route Network & Terrain Risk</h1>
                    <p>Live Route Master, Difficulty Index, and Incident Frequency (Connected to MariaDB)</p>
                </div>
                <div>
                    <button 
                        onClick={loadRoutes}
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
                    <div className="kpi-icon cyan"><MapPin size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Routes</div>
                        <div className="kpi-value">{routesList.length}</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-2">
                    <div className="kpi-icon purple"><Car size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Network</div>
                        <div className="kpi-value">{totalDistance} km</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-3">
                    <div className="kpi-icon amber"><Mountain size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Avg Difficulty</div>
                        <div className="kpi-value">{avgDifficulty}/10</div>
                    </div>
                </div>
                <div className="kpi-card animate-slideUp stagger-4">
                    <div className="kpi-icon red"><AlertTriangle size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Incidents</div>
                        <div className="kpi-value">{totalIncidents}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="toolbar" style={{ margin: '1.5rem 0 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Filter size={15} style={{ color: 'var(--accent-primary)' }} />
                        <span>Terrain:</span>
                    </div>
                    <select 
                        value={terrainFilter} 
                        onChange={(e) => setTerrainFilter(e.target.value)}
                        className="filter-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    >
                        <option value="All">All Terrains</option>
                        <option value="Highway">Highway</option>
                        <option value="Mixed">Mixed</option>
                        <option value="Ghat">Ghat (Hilly)</option>
                        <option value="Urban">Urban</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <ArrowUpDown size={15} style={{ color: 'var(--accent-primary)' }} />
                        <span>Sort By:</span>
                    </div>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    >
                        <option value="difficulty">Difficulty (High to Low)</option>
                        <option value="distance">Distance (Longest first)</option>
                        <option value="incidents">Incidents (Most first)</option>
                    </select>
                </div>
            </div>

            {/* Route Cards */}
            <div className="route-grid">
                {filtered.map(route => {
                    const diffColor = getDifficultyColor(route.difficulty)
                    return (
                        <div key={route.id} className="route-card animate-slideUp">
                            <div className="route-header">
                                <div>
                                    <span className="route-id">{route.id}</span>
                                    <div className="route-name">{route.name}</div>
                                </div>
                                <span className="route-terrain">
                                    {getTerrainIcon(route.terrain)} {route.terrain}
                                </span>
                            </div>

                            <div className="route-endpoints">
                                <div className="endpoint">
                                    <span className="dot origin" />
                                    <span>{route.origin}</span>
                                </div>
                                <div className="endpoint">
                                    <span className="dot destination" />
                                    <span>{route.destination}</span>
                                </div>
                            </div>

                            <div className="route-metrics">
                                <div className="metric">
                                    <span className="metric-label">Distance</span>
                                    <span className="metric-val">{route.distance} km</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Avg Time</span>
                                    <span className="metric-val">{route.avgDuration} min</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Traffic</span>
                                    <span className="metric-val">{route.trafficIndex}/10</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Avg Delay</span>
                                    <span className="metric-val">{route.avgDelay}m</span>
                                </div>
                            </div>

                            <div className="route-difficulty-bar">
                                <div className="diff-label">
                                    <span>Route Difficulty Index</span>
                                    <span style={{ color: diffColor, fontWeight: 700 }}>{route.difficulty}/10</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${route.difficulty * 10}%`,
                                            background: diffColor,
                                        }}
                                    />
                                </div>
                            </div>

                            {route.incidents > 0 && (
                                <div className="route-incidents">
                                    <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                                    <span><strong>{route.incidents}</strong> reported incidents on this route</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
