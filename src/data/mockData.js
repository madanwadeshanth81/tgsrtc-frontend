// TGSRTC Shift Management - Mock Data

export const drivers = [
    { id: 'DRV001', name: 'Rajesh Kumar', role: 'Driver', age: 42, experience: 18, healthScore: 82, fatigueLevel: 35, status: 'On Duty', assignedRoute: 'RTE-101', hoursWorked: 6.5, restHours: 12, phone: '9876543210', bloodGroup: 'O+', lastHealthCheck: '2026-07-01', joinDate: '2008-03-15' },
    { id: 'DRV002', name: 'Suresh Reddy', role: 'Driver', age: 38, experience: 14, healthScore: 74, fatigueLevel: 62, status: 'On Duty', assignedRoute: 'RTE-105', hoursWorked: 7.8, restHours: 8, phone: '9876543211', bloodGroup: 'B+', lastHealthCheck: '2026-06-28', joinDate: '2012-06-20' },
    { id: 'DRV003', name: 'Venkatesh Rao', role: 'Driver', age: 50, experience: 25, healthScore: 65, fatigueLevel: 78, status: 'On Duty', assignedRoute: 'RTE-112', hoursWorked: 8.2, restHours: 7, phone: '9876543212', bloodGroup: 'A+', lastHealthCheck: '2026-06-15', joinDate: '2001-01-10' },
    { id: 'DRV004', name: 'Mahesh Sharma', role: 'Driver', age: 35, experience: 10, healthScore: 91, fatigueLevel: 20, status: 'Off Duty', assignedRoute: null, hoursWorked: 0, restHours: 16, phone: '9876543213', bloodGroup: 'AB+', lastHealthCheck: '2026-07-05', joinDate: '2016-08-01' },
    { id: 'DRV005', name: 'Ramesh Goud', role: 'Driver', age: 45, experience: 20, healthScore: 70, fatigueLevel: 55, status: 'On Duty', assignedRoute: 'RTE-108', hoursWorked: 7.0, restHours: 9, phone: '9876543214', bloodGroup: 'O-', lastHealthCheck: '2026-06-20', joinDate: '2006-04-12' },
    { id: 'DRV006', name: 'Anil Prasad', role: 'Driver', age: 33, experience: 8, healthScore: 88, fatigueLevel: 28, status: 'On Leave', assignedRoute: null, hoursWorked: 0, restHours: 48, phone: '9876543215', bloodGroup: 'B-', lastHealthCheck: '2026-07-10', joinDate: '2018-11-05' },
    { id: 'DRV007', name: 'Srinivas Murthy', role: 'Driver', age: 48, experience: 22, healthScore: 60, fatigueLevel: 85, status: 'On Duty', assignedRoute: 'RTE-115', hoursWorked: 9.0, restHours: 6, phone: '9876543216', bloodGroup: 'A-', lastHealthCheck: '2026-06-10', joinDate: '2004-07-22' },
    { id: 'DRV008', name: 'Praveen Naik', role: 'Driver', age: 29, experience: 5, healthScore: 95, fatigueLevel: 15, status: 'Off Duty', assignedRoute: null, hoursWorked: 0, restHours: 14, phone: '9876543217', bloodGroup: 'O+', lastHealthCheck: '2026-07-12', joinDate: '2021-02-14' },
    { id: 'DRV009', name: 'Krishna Varma', role: 'Driver', age: 40, experience: 16, healthScore: 77, fatigueLevel: 48, status: 'On Duty', assignedRoute: 'RTE-103', hoursWorked: 5.5, restHours: 11, phone: '9876543218', bloodGroup: 'AB-', lastHealthCheck: '2026-06-25', joinDate: '2010-09-30' },
    { id: 'DRV010', name: 'Ganesh Patil', role: 'Driver', age: 52, experience: 28, healthScore: 58, fatigueLevel: 72, status: 'On Duty', assignedRoute: 'RTE-110', hoursWorked: 8.5, restHours: 7, phone: '9876543219', bloodGroup: 'B+', lastHealthCheck: '2026-06-05', joinDate: '1998-12-01' },
    { id: 'CND001', name: 'Ravi Shankar', role: 'Conductor', age: 36, experience: 12, healthScore: 85, fatigueLevel: 30, status: 'On Duty', assignedRoute: 'RTE-101', hoursWorked: 6.5, restHours: 12, phone: '9876543220', bloodGroup: 'O+', lastHealthCheck: '2026-07-02', joinDate: '2014-05-18' },
    { id: 'CND002', name: 'Naresh Yadav', role: 'Conductor', age: 44, experience: 19, healthScore: 72, fatigueLevel: 58, status: 'On Duty', assignedRoute: 'RTE-105', hoursWorked: 7.8, restHours: 8, phone: '9876543221', bloodGroup: 'A+', lastHealthCheck: '2026-06-18', joinDate: '2007-10-08' },
    { id: 'CND003', name: 'Vijay Kumar', role: 'Conductor', age: 31, experience: 7, healthScore: 90, fatigueLevel: 22, status: 'Off Duty', assignedRoute: null, hoursWorked: 0, restHours: 15, phone: '9876543222', bloodGroup: 'B+', lastHealthCheck: '2026-07-08', joinDate: '2019-03-25' },
    { id: 'CND004', name: 'Sanjay Reddy', role: 'Conductor', age: 47, experience: 23, healthScore: 63, fatigueLevel: 75, status: 'On Duty', assignedRoute: 'RTE-112', hoursWorked: 8.2, restHours: 7, phone: '9876543223', bloodGroup: 'O-', lastHealthCheck: '2026-06-12', joinDate: '2003-08-14' },
    { id: 'CND005', name: 'Deepak Chandra', role: 'Conductor', age: 39, experience: 15, healthScore: 79, fatigueLevel: 42, status: 'On Duty', assignedRoute: 'RTE-108', hoursWorked: 7.0, restHours: 9, phone: '9876543224', bloodGroup: 'AB+', lastHealthCheck: '2026-06-30', joinDate: '2011-12-03' },
    { id: 'CND006', name: 'Prakash Meena', role: 'Conductor', age: 28, experience: 4, healthScore: 93, fatigueLevel: 18, status: 'On Duty', assignedRoute: 'RTE-103', hoursWorked: 5.5, restHours: 11, phone: '9876543225', bloodGroup: 'A-', lastHealthCheck: '2026-07-11', joinDate: '2022-06-15' },
    { id: 'DRV011', name: 'Harish Babu', role: 'Driver', age: 37, experience: 11, healthScore: 83, fatigueLevel: 38, status: 'On Duty', assignedRoute: 'RTE-106', hoursWorked: 6.0, restHours: 10, phone: '9876543226', bloodGroup: 'B+', lastHealthCheck: '2026-07-03', joinDate: '2015-01-20' },
    { id: 'DRV012', name: 'Mohan Das', role: 'Driver', age: 55, experience: 30, healthScore: 55, fatigueLevel: 80, status: 'On Leave', assignedRoute: null, hoursWorked: 0, restHours: 72, phone: '9876543227', bloodGroup: 'O+', lastHealthCheck: '2026-05-28', joinDate: '1996-09-10' },
    { id: 'CND007', name: 'Kishore Raju', role: 'Conductor', age: 34, experience: 9, healthScore: 87, fatigueLevel: 25, status: 'Off Duty', assignedRoute: null, hoursWorked: 0, restHours: 13, phone: '9876543228', bloodGroup: 'AB-', lastHealthCheck: '2026-07-09', joinDate: '2017-04-07' },
    { id: 'CND008', name: 'Ashok Tiwari', role: 'Conductor', age: 41, experience: 17, healthScore: 68, fatigueLevel: 65, status: 'On Duty', assignedRoute: 'RTE-110', hoursWorked: 8.5, restHours: 7, phone: '9876543229', bloodGroup: 'A+', lastHealthCheck: '2026-06-22', joinDate: '2009-11-30' },
];

export const routes = [
    { id: 'RTE-101', name: 'Hyderabad - Warangal', origin: 'MGBS, Hyderabad', destination: 'Warangal Bus Stand', distance: 148, difficulty: 4, trafficIndex: 6.5, avgDuration: 195, terrain: 'Highway', incidents: 3, avgDelay: 12 },
    { id: 'RTE-103', name: 'Hyderabad - Nizamabad', origin: 'JBS, Hyderabad', destination: 'Nizamabad BS', distance: 175, difficulty: 5, trafficIndex: 5.8, avgDuration: 225, terrain: 'Highway', incidents: 2, avgDelay: 15 },
    { id: 'RTE-105', name: 'Hyderabad - Karimnagar', origin: 'MGBS, Hyderabad', destination: 'Karimnagar BS', distance: 165, difficulty: 6, trafficIndex: 7.2, avgDuration: 240, terrain: 'Mixed', incidents: 5, avgDelay: 18 },
    { id: 'RTE-106', name: 'Secunderabad - Medak', origin: 'Secunderabad BS', destination: 'Medak BS', distance: 98, difficulty: 3, trafficIndex: 4.5, avgDuration: 135, terrain: 'Highway', incidents: 1, avgDelay: 8 },
    { id: 'RTE-108', name: 'Hyderabad - Nalgonda', origin: 'MGBS, Hyderabad', destination: 'Nalgonda BS', distance: 112, difficulty: 5, trafficIndex: 6.0, avgDuration: 165, terrain: 'Mixed', incidents: 4, avgDelay: 14 },
    { id: 'RTE-110', name: 'Hyderabad - Mahbubnagar', origin: 'MGBS, Hyderabad', destination: 'Mahbubnagar BS', distance: 102, difficulty: 4, trafficIndex: 5.5, avgDuration: 150, terrain: 'Highway', incidents: 2, avgDelay: 10 },
    { id: 'RTE-112', name: 'Hyderabad - Adilabad', origin: 'JBS, Hyderabad', destination: 'Adilabad BS', distance: 305, difficulty: 8, trafficIndex: 7.8, avgDuration: 420, terrain: 'Ghat', incidents: 8, avgDelay: 25 },
    { id: 'RTE-115', name: 'Hyderabad - Khammam', origin: 'MGBS, Hyderabad', destination: 'Khammam BS', distance: 198, difficulty: 7, trafficIndex: 7.0, avgDuration: 285, terrain: 'Mixed', incidents: 6, avgDelay: 20 },
    { id: 'RTE-117', name: 'Hyderabad - Siddipet', origin: 'JBS, Hyderabad', destination: 'Siddipet BS', distance: 105, difficulty: 3, trafficIndex: 5.0, avgDuration: 140, terrain: 'Highway', incidents: 1, avgDelay: 7 },
    { id: 'RTE-120', name: 'Hyderabad - Mancherial', origin: 'JBS, Hyderabad', destination: 'Mancherial BS', distance: 275, difficulty: 7, trafficIndex: 6.8, avgDuration: 360, terrain: 'Ghat', incidents: 5, avgDelay: 22 },
    { id: 'RTE-122', name: 'Hyderabad - Suryapet', origin: 'MGBS, Hyderabad', destination: 'Suryapet BS', distance: 140, difficulty: 4, trafficIndex: 5.2, avgDuration: 180, terrain: 'Highway', incidents: 2, avgDelay: 11 },
    { id: 'RTE-125', name: 'Hyderabad - Jagtiyal', origin: 'JBS, Hyderabad', destination: 'Jagtiyal BS', distance: 195, difficulty: 6, trafficIndex: 6.5, avgDuration: 270, terrain: 'Mixed', incidents: 3, avgDelay: 16 },
    { id: 'RTE-128', name: 'City Circular - Route A', origin: 'Secunderabad', destination: 'Mehdipatnam', distance: 28, difficulty: 6, trafficIndex: 9.2, avgDuration: 90, terrain: 'Urban', incidents: 7, avgDelay: 22 },
    { id: 'RTE-130', name: 'City Circular - Route B', origin: 'ECIL', destination: 'Charminar', distance: 32, difficulty: 7, trafficIndex: 9.5, avgDuration: 105, terrain: 'Urban', incidents: 9, avgDelay: 28 },
    { id: 'RTE-132', name: 'Hyderabad - Bodhan', origin: 'JBS, Hyderabad', destination: 'Bodhan BS', distance: 210, difficulty: 5, trafficIndex: 5.5, avgDuration: 270, terrain: 'Highway', incidents: 2, avgDelay: 13 },
];

export const shifts = [
    { id: 'SHF001', driverId: 'DRV001', conductorId: 'CND001', routeId: 'RTE-101', date: '2026-07-15', startTime: '06:00', endTime: '14:00', status: 'Active', fatigueRisk: 32 },
    { id: 'SHF002', driverId: 'DRV002', conductorId: 'CND002', routeId: 'RTE-105', date: '2026-07-15', startTime: '05:30', endTime: '13:30', status: 'Active', fatigueRisk: 58 },
    { id: 'SHF003', driverId: 'DRV003', conductorId: 'CND004', routeId: 'RTE-112', date: '2026-07-15', startTime: '04:00', endTime: '14:00', status: 'Active', fatigueRisk: 82 },
    { id: 'SHF004', driverId: 'DRV005', conductorId: 'CND005', routeId: 'RTE-108', date: '2026-07-15', startTime: '06:30', endTime: '14:30', status: 'Active', fatigueRisk: 50 },
    { id: 'SHF005', driverId: 'DRV009', conductorId: 'CND006', routeId: 'RTE-103', date: '2026-07-15', startTime: '07:00', endTime: '15:00', status: 'Active', fatigueRisk: 40 },
    { id: 'SHF006', driverId: 'DRV007', conductorId: 'CND008', routeId: 'RTE-115', date: '2026-07-15', startTime: '04:30', endTime: '14:30', status: 'Active', fatigueRisk: 88 },
    { id: 'SHF007', driverId: 'DRV010', conductorId: 'CND008', routeId: 'RTE-110', date: '2026-07-15', startTime: '05:00', endTime: '13:00', status: 'Active', fatigueRisk: 70 },
    { id: 'SHF008', driverId: 'DRV011', conductorId: 'CND001', routeId: 'RTE-106', date: '2026-07-15', startTime: '08:00', endTime: '16:00', status: 'Scheduled', fatigueRisk: 35 },
    { id: 'SHF009', driverId: 'DRV001', conductorId: 'CND002', routeId: 'RTE-101', date: '2026-07-16', startTime: '06:00', endTime: '14:00', status: 'Scheduled', fatigueRisk: 38 },
    { id: 'SHF010', driverId: 'DRV004', conductorId: 'CND003', routeId: 'RTE-117', date: '2026-07-16', startTime: '07:00', endTime: '15:00', status: 'Scheduled', fatigueRisk: 18 },
    { id: 'SHF011', driverId: 'DRV008', conductorId: 'CND007', routeId: 'RTE-122', date: '2026-07-16', startTime: '06:30', endTime: '14:30', status: 'Scheduled', fatigueRisk: 15 },
    { id: 'SHF012', driverId: 'DRV002', conductorId: 'CND005', routeId: 'RTE-105', date: '2026-07-16', startTime: '05:30', endTime: '13:30', status: 'Scheduled', fatigueRisk: 62 },
    { id: 'SHF013', driverId: 'DRV005', conductorId: 'CND006', routeId: 'RTE-125', date: '2026-07-16', startTime: '06:00', endTime: '14:00', status: 'Scheduled', fatigueRisk: 52 },
    { id: 'SHF014', driverId: 'DRV009', conductorId: 'CND002', routeId: 'RTE-103', date: '2026-07-14', startTime: '06:00', endTime: '14:00', status: 'Completed', fatigueRisk: 42 },
    { id: 'SHF015', driverId: 'DRV003', conductorId: 'CND004', routeId: 'RTE-120', date: '2026-07-14', startTime: '04:00', endTime: '13:00', status: 'Completed', fatigueRisk: 76 },
    { id: 'SHF016', driverId: 'DRV007', conductorId: 'CND008', routeId: 'RTE-130', date: '2026-07-14', startTime: '05:00', endTime: '14:00', status: 'Completed', fatigueRisk: 84 },
];

export const incidents = [
    { id: 'INC001', date: '2026-07-10', type: 'Minor Collision', severity: 'Medium', driverId: 'DRV003', routeId: 'RTE-112', cause: 'Driver fatigue', fatigueRelated: true, description: 'Rear-end collision at Godavarikhani junction. Driver reported drowsiness.' },
    { id: 'INC002', date: '2026-07-08', type: 'Near Miss', severity: 'Low', driverId: 'DRV007', routeId: 'RTE-115', cause: 'Delayed reaction', fatigueRelated: true, description: 'Bus veered into adjacent lane momentarily. No collision.' },
    { id: 'INC003', date: '2026-07-05', type: 'Breakdown', severity: 'Low', driverId: 'DRV010', routeId: 'RTE-110', cause: 'Mechanical failure', fatigueRelated: false, description: 'Engine overheating near Shadnagar. Passengers transferred.' },
    { id: 'INC004', date: '2026-06-28', type: 'Major Accident', severity: 'High', driverId: 'DRV003', routeId: 'RTE-120', cause: 'Driver fatigue + poor visibility', fatigueRelated: true, description: 'Bus went off-road near Mancherial ghat section. 3 passengers injured.' },
    { id: 'INC005', date: '2026-06-22', type: 'Minor Collision', severity: 'Medium', driverId: 'DRV002', routeId: 'RTE-105', cause: 'Traffic congestion', fatigueRelated: false, description: 'Side-swipe with two-wheeler in Karimnagar town traffic.' },
    { id: 'INC006', date: '2026-06-18', type: 'Near Miss', severity: 'Low', driverId: 'DRV007', routeId: 'RTE-130', cause: 'Driver fatigue', fatigueRelated: true, description: 'Jumped red signal at ECIL crossing. Alert conductor intervened.' },
    { id: 'INC007', date: '2026-06-12', type: 'Breakdown', severity: 'Low', driverId: 'DRV005', routeId: 'RTE-108', cause: 'Tire burst', fatigueRelated: false, description: 'Front tire burst near Nalgonda. No injuries, minor delay.' },
    { id: 'INC008', date: '2026-06-05', type: 'Minor Collision', severity: 'Medium', driverId: 'DRV010', routeId: 'RTE-128', cause: 'Driver fatigue', fatigueRelated: true, description: 'Hit road divider near Mehdipatnam after extended 10-hour shift.' },
    { id: 'INC009', date: '2026-05-30', type: 'Near Miss', severity: 'Low', driverId: 'DRV002', routeId: 'RTE-105', cause: 'Delayed reaction', fatigueRelated: true, description: 'Late braking at pedestrian crossing near Karimnagar.' },
    { id: 'INC010', date: '2026-05-25', type: 'Major Accident', severity: 'High', driverId: 'DRV012', routeId: 'RTE-112', cause: 'Driver fatigue + rain', fatigueRelated: true, description: 'Bus overturned near Nirmal in heavy rain. Driver was on 12th consecutive hour.' },
];

export const monthlyAnalytics = [
    { month: 'Jan', avgFatigue: 42, absenteeism: 5.2, incidents: 3, shiftCompliance: 88, delays: 145, satisfaction: 72 },
    { month: 'Feb', avgFatigue: 45, absenteeism: 5.8, incidents: 4, shiftCompliance: 85, delays: 162, satisfaction: 69 },
    { month: 'Mar', avgFatigue: 48, absenteeism: 6.5, incidents: 5, shiftCompliance: 82, delays: 178, satisfaction: 65 },
    { month: 'Apr', avgFatigue: 52, absenteeism: 7.2, incidents: 6, shiftCompliance: 78, delays: 195, satisfaction: 61 },
    { month: 'May', avgFatigue: 55, absenteeism: 7.8, incidents: 8, shiftCompliance: 75, delays: 210, satisfaction: 58 },
    { month: 'Jun', avgFatigue: 50, absenteeism: 6.8, incidents: 5, shiftCompliance: 80, delays: 185, satisfaction: 63 },
    { month: 'Jul', avgFatigue: 47, absenteeism: 6.0, incidents: 4, shiftCompliance: 84, delays: 160, satisfaction: 67 },
];

export const alerts = [
    { id: 'ALT001', type: 'critical', title: 'Extreme Fatigue Alert', message: 'Driver Srinivas Murthy (DRV007) fatigue level at 85%. Immediate rest required.', time: '10 min ago', acknowledged: false, driverId: 'DRV007' },
    { id: 'ALT002', type: 'critical', title: 'Shift Duration Violation', message: 'Driver Venkatesh Rao (DRV003) has been on duty for 10+ hours on ghat route.', time: '25 min ago', acknowledged: false, driverId: 'DRV003' },
    { id: 'ALT003', type: 'warning', title: 'Rest Period Insufficient', message: 'Driver Suresh Reddy (DRV002) had only 8 hours rest before current shift (min: 10h).', time: '1 hour ago', acknowledged: false, driverId: 'DRV002' },
    { id: 'ALT004', type: 'warning', title: 'High Fatigue Risk Assignment', message: 'Shift SHF003 on RTE-112 (Adilabad) has fatigue risk score of 82%.', time: '2 hours ago', acknowledged: true, driverId: 'DRV003' },
    { id: 'ALT005', type: 'warning', title: 'Health Check Overdue', message: 'Driver Mohan Das (DRV012) health check overdue by 18 days.', time: '3 hours ago', acknowledged: false, driverId: 'DRV012' },
    { id: 'ALT006', type: 'info', title: 'Shift Optimization Available', message: 'AI recommends reassigning 3 shifts to reduce overall fatigue risk by 15%.', time: '4 hours ago', acknowledged: false, driverId: null },
    { id: 'ALT007', type: 'warning', title: 'Driver Fatigue Rising', message: 'Driver Ganesh Patil (DRV010) fatigue level crossed 70% threshold.', time: '4 hours ago', acknowledged: true, driverId: 'DRV010' },
    { id: 'ALT008', type: 'critical', title: 'Route Risk Alert', message: 'RTE-130 (City Circular B) has 9 incidents this quarter. Review assignment policy.', time: '5 hours ago', acknowledged: true, driverId: null },
    { id: 'ALT009', type: 'info', title: 'Monthly Report Ready', message: 'June 2026 shift compliance and fatigue analysis report is ready for review.', time: '6 hours ago', acknowledged: true, driverId: null },
    { id: 'ALT010', type: 'info', title: 'New Driver Onboarded', message: 'Praveen Naik (DRV008) completed orientation and is available for assignments.', time: '1 day ago', acknowledged: true, driverId: 'DRV008' },
];

export const stakeholders = [
    { name: 'Drivers & Conductors', icon: 'Users', description: 'Frontline employees operating buses daily. Directly affected by shift schedules, fatigue, and working conditions.', concerns: ['Work-life balance', 'Health & safety', 'Fair shift distribution', 'Adequate rest periods'] },
    { name: 'Passengers', icon: 'UserCheck', description: 'Daily commuters and travelers who depend on safe, reliable, and punctual bus services.', concerns: ['Safety on board', 'Punctuality', 'Service frequency', 'Comfortable travel'] },
    { name: 'TGSRTC Management', icon: 'Building2', description: 'Administrative body responsible for operations, fleet management, and service quality.', concerns: ['Operational efficiency', 'Cost optimization', 'Fleet utilization', 'Regulatory compliance'] },
    { name: 'Government & Regulators', icon: 'Landmark', description: 'State transport authority and labor regulators overseeing safety standards and policies.', concerns: ['Road safety standards', 'Labor law compliance', 'Public service quality', 'Accident reduction'] },
    { name: 'Healthcare Providers', icon: 'Heart', description: 'Medical professionals conducting health screenings and managing driver wellness programs.', concerns: ['Regular health monitoring', 'Fatigue-related health issues', 'Mental health support', 'Occupational hazards'] },
    { name: 'Unions & Associations', icon: 'Shield', description: 'Worker unions representing employee interests and negotiating working conditions.', concerns: ['Fair working hours', 'Shift equity', 'Grievance resolution', 'Benefits and welfare'] },
];
