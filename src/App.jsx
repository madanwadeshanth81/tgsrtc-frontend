import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './utils/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Shifts from './pages/Shifts'
import CreateShift from './pages/CreateShift'
import RoutesPage from './pages/Routes'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import SystemInfo from './pages/SystemInfo'
import PassengerPortal from './pages/PassengerPortal'
import DriverPortal from './pages/DriverPortal'
import Passengers from './pages/Passengers'

// Guard component checking if user is logged in
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return null
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children
}

function MainLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/passengers" element={<Passengers />} />
                    <Route path="/shifts" element={<Shifts />} />
                    <Route path="/shifts/create" element={<CreateShift />} />
                    <Route path="/shifts/add" element={<CreateShift />} />
                    <Route path="/routes" element={<RoutesPage />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/system" element={<SystemInfo />} />
                    <Route path="/passenger" element={<PassengerPortal />} />
                    <Route path="/driver-portal" element={<DriverPortal />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
