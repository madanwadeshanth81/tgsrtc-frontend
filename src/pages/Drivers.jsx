import React, { useState, useEffect } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, Heart, Clock, TrendingUp, User, Plus, RefreshCw, X, Check, ShieldCheck, AlertOctagon, Trash2, AlertTriangle } from 'lucide-react'
import { api } from '../utils/api'
import { useAuth } from '../utils/AuthContext'
import { getFatigueClass, getHealthClass, getShiftRecommendation } from '../utils/fatigueEngine'

export default function Drivers() {
    const { user } = useAuth()
    const isPassenger = user?.role === 'PASSENGER'
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER'

    const [staffList, setStaffList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [fatigueFilter, setFatigueFilter] = useState('All')
    const [sortBy, setSortBy] = useState('name')
    const [sortDir, setSortDir] = useState('asc')
    const [expandedId, setExpandedId] = useState(null)

    // Staff deletion state (Admin / Depot Manager only)
    const [staffToDelete, setStaffToDelete] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [actionFeedback, setActionFeedback] = useState({ message: '', type: '' })

    // Modal state for enrolling new personnel (Admin/Depot Manager only)
    const [showModal, setShowModal] = useState(false)
    const [newStaff, setNewStaff] = useState({
        id: '',
        name: '',
        role: 'Driver',
        age: '',
        experience: '',
        healthScore: 85,
        fatigueLevel: 20,
        status: 'Off Duty',
        phone: '',
        bloodGroup: '',
        depotLocation: ''
    })
    const [modalError, setModalError] = useState('')

    const loadStaff = async () => {
        try {
            setLoading(true)
            const res = await api.getStaff()
            if (res.data) setStaffList(res.data)
        } catch (err) {
            console.error('Failed to fetch staff directory:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStaff()
    }, [])

    const handleCreateStaff = async (e) => {
        e.preventDefault()
        setModalError('')
        if (!newStaff.id || !newStaff.name || !newStaff.phone) {
            setModalError('Please fill in all required fields.')
            return
        }

        try {
            const res = await api.createStaff(newStaff)
            if (res.success) {
                setShowModal(false)
                setNewStaff({
                    id: '',
                    name: '',
                    role: 'Driver',
                    age: '',
                    experience: '',
                    healthScore: 85,
                    fatigueLevel: 20,
                    status: 'Off Duty',
                    phone: '',
                    bloodGroup: '',
                    depotLocation: ''
                })
                loadStaff()
            } else {
                setModalError(res.message || 'Failed to enroll staff member.')
            }
        } catch (err) {
            setModalError('Network error while creating staff.')
        }
    }

    const handleDeleteStaff = async () => {
        if (!staffToDelete) return
        setDeleteLoading(true)
        try {
            const res = await api.deleteStaff(staffToDelete.id)
            if (res.success) {
                setActionFeedback({
                    message: `${staffToDelete.role} ${staffToDelete.name} (${staffToDelete.id}) permanently deleted from database.`,
                    type: 'success'
                })
                setStaffToDelete(null)
                loadStaff()
            } else {
                setActionFeedback({
                    message: res.message || 'Failed to delete staff member.',
                    type: 'error'
                })
            }
        } catch (err) {
            setActionFeedback({
                message: 'Network error while deleting staff member.',
                type: 'error'
            })
        } finally {
            setDeleteLoading(false)
            setTimeout(() => setActionFeedback({ message: '', type: '' }), 5000)
        }
    }

    const filtered = staffList
        .filter(d => {
            const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                               d.id.toLowerCase().includes(search.toLowerCase()) ||
                               (d.assignedRoute && d.assignedRoute.toLowerCase().includes(search.toLowerCase())) ||
                               (d.depotLocation && d.depotLocation.toLowerCase().includes(search.toLowerCase()))
            const matchRole = roleFilter === 'All' || d.role === roleFilter
            const matchStatus = statusFilter === 'All' || d.status === statusFilter
            let matchFatigue = true
            if (fatigueFilter === 'Low') matchFatigue = d.fatigueLevel < 30
            else if (fatigueFilter === 'Moderate') matchFatigue = d.fatigueLevel >= 30 && d.fatigueLevel < 50
            else if (fatigueFilter === 'High') matchFatigue = d.fatigueLevel >= 50 && d.fatigueLevel < 70
            else if (fatigueFilter === 'Critical') matchFatigue = d.fatigueLevel >= 70
            return matchSearch && matchRole && matchStatus && matchFatigue
        })
        .sort((a, b) => {
            let cmp = 0
            if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
            else if (sortBy === 'fatigue') cmp = a.fatigueLevel - b.fatigueLevel
            else if (sortBy === 'health') cmp = a.healthScore - b.healthScore
            else if (sortBy === 'hours') cmp = a.hoursWorked - b.hoursWorked
            return sortDir === 'asc' ? cmp : -cmp
        })

    const handleSort = (col) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortBy(col); setSortDir('asc') }
    }

    const SortIcon = ({ col }) => {
        if (sortBy !== col) return null
        return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
    }

    return (
        <div className="animate-fadeIn">
            {/* Passenger Transparency Notice */}
            {isPassenger && (
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <ShieldCheck size={24} color="#f59e0b" />
                    <div>
                        <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>
                            Passenger Transparency & Commuter Safety Directory
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 2 }}>
                            As a passenger, you can review verified TGSRTC bus crew qualifications, duty fitness states, emergency leave statuses, and depot attachments before your journey.
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Drivers & Conductors Directory</h1>
                    <p>Live Personnel Master, Health Index, Fatigue Risk Roster, and Emergency Leave Dispatch</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {isAdminOrManager && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                        >
                            <Plus size={16} /> Enroll New Staff
                        </button>
                    )}
                    <button 
                        onClick={loadStaff}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                        <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {/* Feedback Toast Banner */}
            {actionFeedback.message && (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    background: actionFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${actionFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: actionFeedback.type === 'success' ? '#4ade80' : '#f87171'
                }}>
                    {actionFeedback.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                    <span style={{ flex: 1 }}>{actionFeedback.message}</span>
                    <button onClick={() => setActionFeedback({ message: '', type: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="kpi-card">
                    <div className="kpi-icon cyan"><User size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Personnel</div>
                        <div className="kpi-value">{staffList.length}</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon green"><Clock size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">On Duty Now</div>
                        <div className="kpi-value">{staffList.filter(d => d.status === 'On Duty').length}</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon amber"><Heart size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">Avg Health Score</div>
                        <div className="kpi-value">
                            {staffList.length ? Math.round(staffList.reduce((s, d) => s + d.healthScore, 0) / staffList.length) : 0}
                        </div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon red"><TrendingUp size={22} /></div>
                    <div className="kpi-content">
                        <div className="kpi-label">{isPassenger ? 'Safe Rest Required' : 'High Fatigue (>70%)'}</div>
                        <div className="kpi-value">{staffList.filter(d => d.fatigueLevel >= 70).length}</div>
                    </div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="toolbar" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <div className="search-bar" style={{ flex: '1 1 280px', minWidth: '240px' }}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder={isPassenger ? "Search crew by name, ID, route, or depot..." : "Search by name or Staff ID..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <Filter size={15} style={{ color: 'var(--accent-primary)' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Role:</span>
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                        >
                            <option value="All">All Roles</option>
                            <option value="Driver">Driver</option>
                            <option value="Conductor">Conductor</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Status:</span>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="On Duty">On Duty</option>
                            <option value="Off Duty">Off Duty</option>
                            <option value="Emergency Leave">Emergency Leave</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>Fatigue:</span>
                        <select 
                            value={fatigueFilter} 
                            onChange={(e) => setFatigueFilter(e.target.value)}
                            className="filter-select"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                        >
                            <option value="All">All Fatigue Levels</option>
                            <option value="Low">Low (&lt;30)</option>
                            <option value="Moderate">Moderate (30-50)</option>
                            <option value="High">High (50-70)</option>
                            <option value="Critical">Critical (&gt;70)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID <SortIcon col="id" /></th>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name <SortIcon col="name" /></th>
                            <th>Role</th>
                            <th onClick={() => handleSort('health')} style={{ cursor: 'pointer' }}>Health Index <SortIcon col="health" /></th>
                            <th onClick={() => handleSort('fatigue')} style={{ cursor: 'pointer' }}>Fatigue Status <SortIcon col="fatigue" /></th>
                            <th>Status</th>
                            <th onClick={() => handleSort('hours')} style={{ cursor: 'pointer' }}>Hours <SortIcon col="hours" /></th>
                            <th>Rest</th>
                            <th>Route</th>
                            {isAdminOrManager && <th style={{ textAlign: 'center' }}>Action</th>}
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(driver => {
                            const fc = getFatigueClass(driver.fatigueLevel)
                            const hc = getHealthClass(driver.healthScore)
                            const isExpanded = expandedId === driver.id
                            const rec = getShiftRecommendation(driver)
                            const isEmergencyLeave = driver.status === 'Emergency Leave'

                            return (
                                <React.Fragment key={driver.id}>
                                    <tr onClick={() => setExpandedId(isExpanded ? null : driver.id)} style={{ cursor: 'pointer' }}>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                                            {driver.id}
                                        </td>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                            {driver.name}
                                        </td>
                                        <td><span className={`badge ${driver.role === 'Driver' ? 'cyan' : 'purple'}`}>{driver.role}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="progress-bar" style={{ width: 60 }}>
                                                    <div className={`progress-bar-fill`} style={{
                                                        width: `${driver.healthScore}%`,
                                                        background: hc.color === 'success' ? '#22c55e' : hc.color === 'info' ? '#3b82f6' : hc.color === 'warning' ? '#f59e0b' : '#ef4444'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem' }}>{driver.healthScore}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${fc.color}`}>{driver.fatigueLevel}% • {fc.label}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${isEmergencyLeave ? 'danger' : driver.status === 'On Duty' ? 'success' : driver.status === 'Off Duty' ? 'neutral' : 'info'}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{driver.hoursWorked}h</td>
                                        <td>{driver.restHours}h</td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{driver.assignedRoute || '—'}</td>
                                        {isAdminOrManager && (
                                            <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setStaffToDelete(driver)}
                                                    title={`Delete ${driver.role} ${driver.name}`}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.12)',
                                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                                        color: '#f87171',
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'
                                                        e.currentTarget.style.borderColor = '#ef4444'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'
                                                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                                                    }}
                                                >
                                                    <Trash2 size={13} />
                                                    <span>Delete</span>
                                                </button>
                                            </td>
                                        )}
                                        <td>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={isAdminOrManager ? 11 : 10} style={{ padding: 0 }}>
                                                <div style={{
                                                    background: 'var(--bg-tertiary)',
                                                    padding: '1.25rem 1.5rem',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                    gap: '1rem',
                                                    borderTop: '1px solid var(--border-color)',
                                                    animation: 'fadeIn 0.3s ease',
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Crew Profile</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Age: {driver.age} yrs</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Driving Experience: {driver.experience} yrs</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Blood Group: {driver.bloodGroup}</div>
                                                        {!isPassenger && (
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Contact Phone: {driver.phone}</div>
                                                        )}
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Depot Attachment: {driver.depotLocation}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Fitness & Duty Status</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last Medical Check: {driver.lastHealthCheck}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Service Tenure Since: {driver.joinDate}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Health Status: <span className={`badge ${hc.color}`}>{hc.label}</span></div>
                                                        {driver.leaveReason && (
                                                            <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: 4 }}>
                                                                <strong>Leave Note:</strong> {driver.leaveReason}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                                                            {isPassenger ? 'Passenger Safety Assurance' : 'AI Shift Recommendation'}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                            Status: <span className={`badge ${isEmergencyLeave ? 'danger' : rec.status === 'fit' ? 'success' : rec.status === 'light-duty' ? 'warning' : 'danger'}`}>
                                                                {isEmergencyLeave ? 'Relieved on Emergency Leave' : rec.status === 'fit' ? 'Fit & Safe for Duty' : rec.status === 'light-duty' ? 'Light Duty / Supervised' : 'Rest Required'}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>Maximum Safe Shift: {rec.maxShiftHours}h</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prescribed Rest: {rec.minRestHours}h</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: 4, fontStyle: 'italic' }}>{rec.message}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal for Enrolling New Staff (Admin & Manager only) */}
            {showModal && isAdminOrManager && (
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
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '520px',
                        padding: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>Enroll New Driver / Conductor</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {modalError && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleCreateStaff}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Staff ID *</label>
                                    <input 
                                        type="text"
                                        value={newStaff.id}
                                        onChange={(e) => setNewStaff({ ...newStaff, id: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Role *</label>
                                    <select 
                                        value={newStaff.role}
                                        onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    >
                                        <option value="Driver">Driver</option>
                                        <option value="Conductor">Conductor</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                <input 
                                    type="text"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                    style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                                    <input 
                                        type="text"
                                        value={newStaff.phone}
                                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Depot Location</label>
                                    <input 
                                        type="text"
                                        value={newStaff.depotLocation}
                                        onChange={(e) => setNewStaff({ ...newStaff, depotLocation: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Age (yrs)</label>
                                    <input 
                                        type="number"
                                        value={newStaff.age}
                                        onChange={(e) => setNewStaff({ ...newStaff, age: e.target.value ? parseInt(e.target.value) : '' })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Exp (yrs)</label>
                                    <input 
                                        type="number"
                                        value={newStaff.experience}
                                        onChange={(e) => setNewStaff({ ...newStaff, experience: e.target.value ? parseInt(e.target.value) : '' })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Blood Group</label>
                                    <input 
                                        type="text"
                                        value={newStaff.bloodGroup}
                                        onChange={(e) => setNewStaff({ ...newStaff, bloodGroup: e.target.value })}
                                        style={{ width: '100%', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Check size={16} /> Save to Database
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Confirming Staff Deletion (Admin & Manager only) */}
            {staffToDelete && isAdminOrManager && (
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
                        maxWidth: '460px',
                        padding: '1.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ef4444',
                                flexShrink: 0
                            }}>
                                <Trash2 size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>
                                    Delete {staffToDelete.role}?
                                </h3>
                                <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                                    This action will permanently delete the staff record from MariaDB.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            padding: '0.85rem 1rem',
                            marginBottom: '1.25rem',
                            fontSize: '0.85rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#94a3b8' }}>Staff ID:</span>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{staffToDelete.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#94a3b8' }}>Name:</span>
                                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{staffToDelete.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#94a3b8' }}>Role:</span>
                                <span style={{ color: '#38bdf8' }}>{staffToDelete.role}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#94a3b8' }}>Depot:</span>
                                <span style={{ color: '#f8fafc' }}>{staffToDelete.depotLocation || 'MGBS, Hyderabad'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Phone:</span>
                                <span style={{ color: '#f8fafc' }}>{staffToDelete.phone || '—'}</span>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            padding: '0.65rem 0.85rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            fontSize: '0.78rem',
                            color: '#fca5a5'
                        }}>
                            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                            <span>Active shift allocations will be de-assigned safely and related dispatcher alerts purged.</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setStaffToDelete(null)}
                                className="btn btn-secondary"
                                disabled={deleteLoading}
                                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteStaff}
                                disabled={deleteLoading}
                                style={{
                                    background: '#ef4444',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    padding: '0.45rem 1rem',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    opacity: deleteLoading ? 0.7 : 1
                                }}
                            >
                                {deleteLoading ? <RefreshCw size={14} className="spin" /> : <Trash2 size={14} />}
                                {deleteLoading ? 'Deleting...' : `Confirm Delete`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
