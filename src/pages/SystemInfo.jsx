import React from 'react'
import { Info, Users, Target, GitBranch, Layers, BookOpen, Heart, Shield, Building2, Landmark, UserCheck } from 'lucide-react'
import { stakeholders } from '../data/mockData'

const iconMap = {
    Users, UserCheck, Building2, Landmark, Heart, Shield,
}

export default function SystemInfo() {
    return (
        <div className="animate-fadeIn">
            <div className="page-header">
                <h1>System Information</h1>
                <p>Understanding the TGSRTC shift management system through systems thinking and stakeholder analysis</p>
            </div>

            {/* About Section */}
            <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} /> About This System
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                    The <strong>TGSRTC Driver & Conductor Shift Management System</strong> is a data-driven framework designed to address
                    the systemic factors contributing to driver fatigue in Telangana State Road Transport Corporation. By integrating
                    fatigue monitoring, health tracking, route difficulty analysis, and AI-powered shift optimization, this system aims
                    to balance operational demands with driver well-being and passenger safety.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    This project investigates the research problem: <em>"What systemic factors contribute to driver fatigue in TGSRTC,
                        and how can a data-driven shift management framework balance operational demands with driver health and passenger safety?"</em>
                </p>
            </div>

            {/* System Boundary */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={20} style={{ color: 'var(--accent-secondary)' }} /> System Boundary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Super System</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Public Transportation System (Telangana)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Encompasses all modes of public transport and regulatory bodies</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-secondary)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sub-System</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>TGSRTC Bus Operations – Driver & Conductor Shift Management</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Focuses on shift scheduling, fatigue management, and operational safety</div>
                    </div>
                </div>
            </div>

            {/* Causal Loop Diagram */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GitBranch size={20} style={{ color: '#22c55e' }} /> Causal Loop Diagram (CLD)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    This diagram illustrates the reinforcing and balancing feedback loops within the TGSRTC shift management system.
                </p>

                {/* ASCII CLD Visualization */}
                <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    overflowX: 'auto',
                    border: '1px solid var(--border-color)',
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.85rem' }}>🔄 Reinforcing Loop R1: Fatigue-Accident Spiral</div>
                            <div style={{ lineHeight: 2.2, paddingLeft: '0.5rem', borderLeft: '2px solid rgba(239,68,68,0.3)' }}>
                                Extended Shifts → ↑ Driver Fatigue<br />
                                ↑ Driver Fatigue → ↓ Alertness & Reaction Time<br />
                                ↓ Alertness → ↑ Accident Risk<br />
                                ↑ Accidents → ↑ Driver Absenteeism<br />
                                ↑ Absenteeism → ↑ Workload on Remaining Drivers<br />
                                ↑ Workload → ↑ Extended Shifts (R1)
                            </div>
                        </div>
                        <div>
                            <div style={{ color: '#22c55e', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.85rem' }}>⚖️ Balancing Loop B1: Shift Management Intervention</div>
                            <div style={{ lineHeight: 2.2, paddingLeft: '0.5rem', borderLeft: '2px solid rgba(34,197,94,0.3)' }}>
                                ↑ Driver Fatigue → Fatigue Detected by System<br />
                                Detection → Shift Rebalancing & Rest Enforcement<br />
                                Rest Enforcement → ↓ Driver Fatigue<br />
                                ↓ Fatigue → ↑ Alertness<br />
                                ↑ Alertness → ↓ Accident Risk<br />
                                ↓ Accidents → ↓ Absenteeism (B1)
                            </div>
                        </div>
                        <div>
                            <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.85rem' }}>🔄 Reinforcing Loop R2: Health Degradation</div>
                            <div style={{ lineHeight: 2.2, paddingLeft: '0.5rem', borderLeft: '2px solid rgba(245,158,11,0.3)' }}>
                                Irregular Shifts → ↓ Sleep Quality<br />
                                ↓ Sleep Quality → ↓ Health Score<br />
                                ↓ Health Score → ↑ Fatigue Accumulation Rate<br />
                                ↑ Fatigue Rate → ↑ Stress & Mental Load<br />
                                ↑ Stress → Further Health Decline (R2)
                            </div>
                        </div>
                        <div>
                            <div style={{ color: '#3b82f6', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.85rem' }}>⚖️ Balancing Loop B2: Health Monitoring</div>
                            <div style={{ lineHeight: 2.2, paddingLeft: '0.5rem', borderLeft: '2px solid rgba(59,130,246,0.3)' }}>
                                ↓ Health Score → Health Check Alert<br />
                                Alert → Mandatory Health Review<br />
                                Review → Medical Intervention / Leave<br />
                                Recovery → ↑ Health Score<br />
                                ↑ Health → ↓ Fatigue Rate (B2)
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stakeholder Analysis */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={20} style={{ color: 'var(--accent-primary)' }} /> Stakeholder Analysis
                </h3>
                <div className="info-grid">
                    {stakeholders.map((s, i) => {
                        const Icon = iconMap[s.icon] || Users
                        return (
                            <div key={i} className="info-card animate-slideUp" style={{ animationDelay: `${i * 0.08}s` }}>
                                <h3>
                                    <Icon size={20} style={{ color: 'var(--accent-primary)' }} />
                                    {s.name}
                                </h3>
                                <p style={{ marginBottom: '0.75rem' }}>{s.description}</p>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontWeight: 600 }}>
                                    Key Concerns
                                </div>
                                <ul>
                                    {s.concerns.map((c, j) => (
                                        <li key={j}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Research Methodology */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={20} style={{ color: '#f59e0b' }} /> Research Methodology
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {[
                        { step: '01', title: 'Problem Identification', desc: 'Analyze existing TGSRTC shift patterns and identify fatigue-related risk factors through accident records and duty logs.' },
                        { step: '02', title: 'Systems Mapping', desc: 'Create Causal Loop Diagrams (CLDs) to map feedback loops between shifts, fatigue, health, and safety outcomes.' },
                        { step: '03', title: 'Data Collection', desc: 'Gather quantifiable data on duty hours, rest periods, absenteeism, health scores, route difficulty, and incident records.' },
                        { step: '04', title: 'Framework Design', desc: 'Design a data-driven shift management framework incorporating fatigue scoring, route matching, and policy constraints.' },
                        { step: '05', title: 'Simulation & Testing', desc: 'Test the framework with simulated scenarios to validate fatigue reduction and safety improvements.' },
                        { step: '06', title: 'Recommendations', desc: 'Propose actionable interventions for TGSRTC management, including AI-based scheduling and health monitoring protocols.' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            borderTop: '3px solid',
                            borderImage: 'var(--gradient-primary) 1',
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)', opacity: 0.3, marginBottom: '0.3rem' }}>{item.step}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quantifiable Metrics */}
            <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={20} style={{ color: 'var(--accent-teal)' }} /> Quantifiable Metrics Used
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                        'Accident Records', 'Duty Hours Logged', 'Rest Period Duration',
                        'Absenteeism Rate', 'Service Delays', 'Health Check Scores',
                        'Route Difficulty Index', 'Traffic Congestion Index', 'Fatigue Risk Score',
                        'Shift Compliance Rate', 'Employee Satisfaction Index', 'Incident Severity Classification'
                    ].map((metric, i) => (
                        <span key={i} className="badge cyan" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                            {metric}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
