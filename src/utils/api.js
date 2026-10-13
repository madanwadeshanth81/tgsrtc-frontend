// API Service connecting to TGSRTC Backend Server (Live Render Cloud URL with fallback to local)
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001/api'
    : 'https://tgsrtc-backend-55ma.onrender.com/api';

// Helper to get auth headers if token is present
const getAuthHeaders = () => {
    const token = localStorage.getItem('tgsrtc_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    // Auth
    async login(email, password) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('tgsrtc_token', data.token);
            localStorage.setItem('tgsrtc_user', JSON.stringify(data.user));
        }
        return data;
    },

    async register(userData) {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('tgsrtc_token', data.token);
            localStorage.setItem('tgsrtc_user', JSON.stringify(data.user));
        }
        return data;
    },

    async sendOtp(type, value) {
        const res = await fetch(`${API_BASE}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, value })
        });
        return await res.json();
    },

    async verifyOtp(type, value, otp) {
        const res = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, value, otp })
        });
        return await res.json();
    },

    async getUsers(params = {}) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/auth/users${query ? `?${query}` : ''}`, {
            headers: getAuthHeaders()
        });
        return await res.json();
    },

    async deleteUser(id) {
        const res = await fetch(`${API_BASE}/auth/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return await res.json();
    },

    getCurrentUser() {
        const user = localStorage.getItem('tgsrtc_user');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        localStorage.removeItem('tgsrtc_token');
        localStorage.removeItem('tgsrtc_user');
    },

    // Staff Directory (Drivers & Conductors)
    async getStaff(params = {}) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/staff${query ? `?${query}` : ''}`);
        return await res.json();
    },

    async getStaffById(id) {
        const res = await fetch(`${API_BASE}/staff/${id}`);
        return await res.json();
    },

    async createStaff(staffData) {
        const res = await fetch(`${API_BASE}/staff`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(staffData)
        });
        return await res.json();
    },

    async updateStaff(id, updateData) {
        const res = await fetch(`${API_BASE}/staff/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData)
        });
        return await res.json();
    },

    async deleteStaff(id) {
        const res = await fetch(`${API_BASE}/staff/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return await res.json();
    },

    async applyEmergencyLeave(id, reason) {
        const res = await fetch(`${API_BASE}/staff/${id}/emergency-leave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        });
        return await res.json();
    },

    // Routes
    async getRoutes(params = {}) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/routes${query ? `?${query}` : ''}`);
        return await res.json();
    },

    // Shifts
    async getShifts(params = {}) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/shifts${query ? `?${query}` : ''}`);
        return await res.json();
    },

    async createShift(shiftData) {
        const res = await fetch(`${API_BASE}/shifts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(shiftData)
        });
        return await res.json();
    },

    async updateShiftStatus(id, status) {
        const res = await fetch(`${API_BASE}/shifts/${id}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return await res.json();
    },

    // Operations, KPIs, Incidents & Alerts
    async getDashboardSummary() {
        const res = await fetch(`${API_BASE}/ops/summary`);
        return await res.json();
    },

    async getAlerts(params = {}) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/ops/alerts${query ? `?${query}` : ''}`);
        return await res.json();
    },

    async acknowledgeAlert(id) {
        const res = await fetch(`${API_BASE}/ops/alerts/${id}/ack`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
        return await res.json();
    },

    async getIncidents() {
        const res = await fetch(`${API_BASE}/ops/incidents`);
        return await res.json();
    },

    async getMonthlyAnalytics() {
        const res = await fetch(`${API_BASE}/ops/monthly`);
        return await res.json();
    },

    async getBuses() {
        const res = await fetch(`${API_BASE}/ops/buses`);
        return await res.json();
    }
};
