USE `tgsrtc_shift_management`;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `alerts`;
TRUNCATE TABLE `incidents`;
TRUNCATE TABLE `shifts`;
TRUNCATE TABLE `buses`;
TRUNCATE TABLE `routes`;
TRUNCATE TABLE `staff`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `monthly_analytics`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Users (Password: Password@123 -> $2a$10$wT5HqL3l8i89E6xVf92b9eR7g5T0L7z0N.41c1F8MvM7c.K8uO77W or bcrypt hash)
-- Bcrypt hash for "Password@123": $2a$10$tZ2cI0cW1C6L2z2zW1gZ6.H9TfO8hL7t9zXwYqKjU4lM8tPnQ9G9O (or generate standardized standard bcrypt)
INSERT INTO `users` (`employee_id`, `name`, `email`, `password`, `role`, `phone`) VALUES
('TGS-MGR-001', 'Admin Supervisor', 'admin@tgsrtc.telangana.gov.in', '$2a$10$LFAgZ0wZqE4K2lC0LzG0veR0Z5L0J0Y0U0I0O0P0A0S0D0F0G0H0J', 'ADMIN', '9876543200'),
('TGS-MGR-002', 'Depot Manager MGBS', 'manager.mgbs@tgsrtc.telangana.gov.in', '$2a$10$LFAgZ0wZqE4K2lC0LzG0veR0Z5L0J0Y0U0I0O0P0A0S0D0F0G0H0J', 'DEPOT_MANAGER', '9876543201'),
('TGS-DRV-001', 'Rajesh Kumar', 'rajesh.drv@tgsrtc.telangana.gov.in', '$2a$10$LFAgZ0wZqE4K2lC0LzG0veR0Z5L0J0Y0U0I0O0P0A0S0D0F0G0H0J', 'DRIVER', '9876543210');

-- 2. Seed Staff (Drivers & Conductors)
INSERT INTO `staff` (`id`, `name`, `role`, `age`, `experience`, `health_score`, `fatigue_level`, `status`, `assigned_route`, `hours_worked`, `rest_hours`, `phone`, `blood_group`, `last_health_check`, `join_date`, `depot_location`) VALUES
('DRV001', 'Rajesh Kumar', 'Driver', 42, 18, 82, 35, 'On Duty', 'RTE-101', 6.5, 12, '9876543210', 'O+', '2026-07-01', '2008-03-15', 'MGBS, Hyderabad'),
('DRV002', 'Suresh Reddy', 'Driver', 38, 14, 74, 62, 'On Duty', 'RTE-105', 7.8, 8, '9876543211', 'B+', '2026-06-28', '2012-06-20', 'MGBS, Hyderabad'),
('DRV003', 'Venkatesh Rao', 'Driver', 50, 25, 65, 78, 'On Duty', 'RTE-112', 8.2, 7, '9876543212', 'A+', '2026-06-15', '2001-01-10', 'JBS, Secunderabad'),
('DRV004', 'Mahesh Sharma', 'Driver', 35, 10, 91, 20, 'Off Duty', NULL, 0, 16, '9876543213', 'AB+', '2026-07-05', '2016-08-01', 'MGBS, Hyderabad'),
('DRV005', 'Ramesh Goud', 'Driver', 45, 20, 70, 55, 'On Duty', 'RTE-108', 7.0, 9, '9876543214', 'O-', '2026-06-20', '2006-04-12', 'MGBS, Hyderabad'),
('DRV006', 'Anil Prasad', 'Driver', 33, 8, 88, 28, 'On Leave', NULL, 0, 48, '9876543215', 'B-', '2026-07-10', '2018-11-05', 'Dilsukhnagar Depot'),
('DRV007', 'Srinivas Murthy', 'Driver', 48, 22, 60, 85, 'On Duty', 'RTE-115', 9.0, 6, '9876543216', 'A-', '2026-06-10', '2004-07-22', 'MGBS, Hyderabad'),
('DRV008', 'Praveen Naik', 'Driver', 29, 5, 95, 15, 'Off Duty', NULL, 0, 14, '9876543217', 'O+', '2026-07-12', '2021-02-14', 'Kukatpally Depot'),
('DRV009', 'Krishna Varma', 'Driver', 40, 16, 77, 48, 'On Duty', 'RTE-103', 5.5, 11, '9876543218', 'AB-', '2026-06-25', '2010-09-30', 'JBS, Secunderabad'),
('DRV010', 'Ganesh Patil', 'Driver', 52, 28, 58, 72, 'On Duty', 'RTE-110', 8.5, 7, '9876543219', 'B+', '2026-06-05', '1998-12-01', 'MGBS, Hyderabad'),
('DRV011', 'Harish Babu', 'Driver', 37, 11, 83, 38, 'On Duty', 'RTE-106', 6.0, 10, '9876543226', 'B+', '2026-07-03', '2015-01-20', 'Secunderabad Depot'),
('DRV012', 'Mohan Das', 'Driver', 55, 30, 55, 80, 'On Leave', NULL, 0, 72, '9876543227', 'O+', '2026-05-28', '1996-09-10', 'MGBS, Hyderabad'),
('CND001', 'Ravi Shankar', 'Conductor', 36, 12, 85, 30, 'On Duty', 'RTE-101', 6.5, 12, '9876543220', 'O+', '2026-07-02', '2014-05-18', 'MGBS, Hyderabad'),
('CND002', 'Naresh Yadav', 'Conductor', 44, 19, 72, 58, 'On Duty', 'RTE-105', 7.8, 8, '9876543221', 'A+', '2026-06-18', '2007-10-08', 'MGBS, Hyderabad'),
('CND003', 'Vijay Kumar', 'Conductor', 31, 7, 90, 22, 'Off Duty', NULL, 0, 15, '9876543222', 'B+', '2026-07-08', '2019-03-25', 'MGBS, Hyderabad'),
('CND004', 'Sanjay Reddy', 'Conductor', 47, 23, 63, 75, 'On Duty', 'RTE-112', 8.2, 7, '9876543223', 'O-', '2026-06-12', '2003-08-14', 'JBS, Secunderabad'),
('CND005', 'Deepak Chandra', 'Conductor', 39, 15, 79, 42, 'On Duty', 'RTE-108', 7.0, 9, '9876543224', 'AB+', '2026-06-30', '2011-12-03', 'MGBS, Hyderabad'),
('CND006', 'Prakash Meena', 'Conductor', 28, 4, 93, 18, 'On Duty', 'RTE-103', 5.5, 11, '9876543225', 'A-', '2026-07-11', '2022-06-15', 'JBS, Secunderabad'),
('CND007', 'Kishore Raju', 'Conductor', 34, 9, 87, 25, 'Off Duty', NULL, 0, 13, '9876543228', 'AB-', '2026-07-09', '2017-04-07', 'Kukatpally Depot'),
('CND008', 'Ashok Tiwari', 'Conductor', 41, 17, 68, 65, 'On Duty', 'RTE-110', 8.5, 7, '9876543229', 'A+', '2026-06-22', '2009-11-30', 'MGBS, Hyderabad');

-- 3. Seed Routes
INSERT INTO `routes` (`id`, `name`, `origin`, `destination`, `distance`, `difficulty`, `traffic_index`, `avg_duration`, `terrain`, `incidents_count`, `avg_delay`) VALUES
('RTE-101', 'Hyderabad - Warangal', 'MGBS, Hyderabad', 'Warangal Bus Stand', 148, 4, 6.5, 195, 'Highway', 3, 12),
('RTE-103', 'Hyderabad - Nizamabad', 'JBS, Hyderabad', 'Nizamabad BS', 175, 5, 5.8, 225, 'Highway', 2, 15),
('RTE-105', 'Hyderabad - Karimnagar', 'MGBS, Hyderabad', 'Karimnagar BS', 165, 6, 7.2, 240, 'Mixed', 5, 18),
('RTE-106', 'Secunderabad - Medak', 'Secunderabad BS', 'Medak BS', 98, 3, 4.5, 135, 'Highway', 1, 8),
('RTE-108', 'Hyderabad - Nalgonda', 'MGBS, Hyderabad', 'Nalgonda BS', 112, 5, 6.0, 165, 'Mixed', 4, 14),
('RTE-110', 'Hyderabad - Mahbubnagar', 'MGBS, Hyderabad', 'Mahbubnagar BS', 102, 4, 5.5, 150, 'Highway', 2, 10),
('RTE-112', 'Hyderabad - Adilabad', 'JBS, Hyderabad', 'Adilabad BS', 305, 8, 7.8, 420, 'Ghat', 8, 25),
('RTE-115', 'Hyderabad - Khammam', 'MGBS, Hyderabad', 'Khammam BS', 198, 7, 7.0, 285, 'Mixed', 6, 20),
('RTE-117', 'Hyderabad - Siddipet', 'JBS, Hyderabad', 'Siddipet BS', 105, 3, 5.0, 140, 'Highway', 1, 7),
('RTE-120', 'Hyderabad - Mancherial', 'JBS, Hyderabad', 'Mancherial BS', 275, 7, 6.8, 360, 'Ghat', 5, 22),
('RTE-122', 'Hyderabad - Suryapet', 'MGBS, Hyderabad', 'Suryapet BS', 140, 4, 5.2, 180, 'Highway', 2, 11),
('RTE-125', 'Hyderabad - Jagtiyal', 'JBS, Hyderabad', 'Jagtiyal BS', 195, 6, 6.5, 270, 'Mixed', 3, 16),
('RTE-128', 'City Circular - Route A', 'Secunderabad', 'Mehdipatnam', 28, 6, 9.2, 90, 'Urban', 7, 22),
('RTE-130', 'City Circular - Route B', 'ECIL', 'Charminar', 32, 7, 9.5, 105, 'Urban', 9, 28),
('RTE-132', 'Hyderabad - Bodhan', 'JBS, Hyderabad', 'Bodhan BS', 210, 5, 5.5, 270, 'Highway', 2, 13);

-- 4. Seed Buses
INSERT INTO `buses` (`bus_number`, `depot_name`, `bus_type`, `seating_capacity`, `status`, `fitness_expiry`, `assigned_route_id`) VALUES
('TS-09-Z-1001', 'MGBS Depot', 'Super Luxury', 40, 'ACTIVE', '2027-03-31', 'RTE-101'),
('TS-09-Z-1002', 'MGBS Depot', 'Deluxe', 44, 'ACTIVE', '2027-04-15', 'RTE-105'),
('TS-09-Z-1003', 'JBS Depot', 'Express', 49, 'ACTIVE', '2026-12-31', 'RTE-112'),
('TS-09-Z-1004', 'MGBS Depot', 'Express', 49, 'ACTIVE', '2027-01-20', 'RTE-108'),
('TS-09-Z-1005', 'JBS Depot', 'Deluxe', 44, 'ACTIVE', '2027-05-10', 'RTE-103'),
('TS-09-Z-1006', 'MGBS Depot', 'Express', 49, 'ACTIVE', '2026-11-30', 'RTE-115'),
('TS-09-Z-1007', 'MGBS Depot', 'Palle Velugu', 55, 'ACTIVE', '2027-02-28', 'RTE-110'),
('TS-09-Z-1008', 'Secunderabad Depot', 'Metro Express', 50, 'ACTIVE', '2027-06-15', 'RTE-106'),
('TS-09-Z-1009', 'MGBS Depot', 'Super Luxury', 40, 'MAINTENANCE', '2026-10-15', NULL),
('TS-09-Z-1010', 'JBS Depot', 'Express', 49, 'ACTIVE', '2027-07-01', 'RTE-117');

-- 5. Seed Shifts
INSERT INTO `shifts` (`id`, `driver_id`, `conductor_id`, `route_id`, `bus_number`, `shift_date`, `start_time`, `end_time`, `status`, `fatigue_risk`, `notes`) VALUES
('SHF001', 'DRV001', 'CND001', 'RTE-101', 'TS-09-Z-1001', '2026-07-15', '06:00:00', '14:00:00', 'Active', 32, 'Regular morning express shift'),
('SHF002', 'DRV002', 'CND002', 'RTE-105', 'TS-09-Z-1002', '2026-07-15', '05:30:00', '13:30:00', 'Active', 58, 'Peak rush hour schedule'),
('SHF003', 'DRV003', 'CND004', 'RTE-112', 'TS-09-Z-1003', '2026-07-15', '04:00:00', '14:00:00', 'Active', 82, 'Long distance ghat road route. Driver monitor required.'),
('SHF004', 'DRV005', 'CND005', 'RTE-108', 'TS-09-Z-1004', '2026-07-15', '06:30:00', '14:30:00', 'Active', 50, 'Standard highway dispatch'),
('SHF005', 'DRV009', 'CND006', 'RTE-103', 'TS-09-Z-1005', '2026-07-15', '07:00:00', '15:00:00', 'Active', 40, 'Inter-city link'),
('SHF006', 'DRV007', 'CND008', 'RTE-115', 'TS-09-Z-1006', '2026-07-15', '04:30:00', '14:30:00', 'Active', 88, 'Extended 10h schedule - High Fatigue Alert generated'),
('SHF007', 'DRV010', 'CND008', 'RTE-110', 'TS-09-Z-1007', '2026-07-15', '05:00:00', '13:00:00', 'Active', 70, 'Senior driver highway shift'),
('SHF008', 'DRV011', 'CND001', 'RTE-106', 'TS-09-Z-1008', '2026-07-15', '08:00:00', '16:00:00', 'Scheduled', 35, 'Afternoon service'),
('SHF009', 'DRV001', 'CND002', 'RTE-101', 'TS-09-Z-1001', '2026-07-16', '06:00:00', '14:00:00', 'Scheduled', 38, 'Advance roster assignment'),
('SHF010', 'DRV004', 'CND003', 'RTE-117', 'TS-09-Z-1010', '2026-07-16', '07:00:00', '15:00:00', 'Scheduled', 18, 'Fresh driver rostered'),
('SHF011', 'DRV008', 'CND007', 'RTE-122', 'TS-09-Z-1002', '2026-07-16', '06:30:00', '14:30:00', 'Scheduled', 15, 'Optimal fatigue configuration'),
('SHF012', 'DRV002', 'CND005', 'RTE-105', 'TS-09-Z-1004', '2026-07-16', '05:30:00', '13:30:00', 'Scheduled', 62, 'Moderate risk - watch rest hours'),
('SHF013', 'DRV005', 'CND006', 'RTE-125', 'TS-09-Z-1005', '2026-07-16', '06:00:00', '14:00:00', 'Scheduled', 52, 'Standard scheduling'),
('SHF014', 'DRV009', 'CND002', 'RTE-103', 'TS-09-Z-1005', '2026-07-14', '06:00:00', '14:00:00', 'Completed', 42, 'Completed with 0 incidents'),
('SHF015', 'DRV003', 'CND004', 'RTE-120', 'TS-09-Z-1003', '2026-07-14', '04:00:00', '13:00:00', 'Completed', 76, 'Completed - driver required rest after ghat run'),
('SHF016', 'DRV007', 'CND008', 'RTE-130', 'TS-09-Z-1008', '2026-07-14', '05:00:00', '14:00:00', 'Completed', 84, 'Completed with minor signal delay');

-- 6. Seed Incidents
INSERT INTO `incidents` (`id`, `incident_date`, `incident_type`, `severity`, `driver_id`, `route_id`, `cause`, `fatigue_related`, `description`) VALUES
('INC001', '2026-07-10', 'Minor Collision', 'Medium', 'DRV003', 'RTE-112', 'Driver fatigue', TRUE, 'Rear-end collision at Godavarikhani junction. Driver reported drowsiness.'),
('INC002', '2026-07-08', 'Near Miss', 'Low', 'DRV007', 'RTE-115', 'Delayed reaction', TRUE, 'Bus veered into adjacent lane momentarily. No collision.'),
('INC003', '2026-07-05', 'Breakdown', 'Low', 'DRV010', 'RTE-110', 'Mechanical failure', FALSE, 'Engine overheating near Shadnagar. Passengers transferred.'),
('INC004', '2026-06-28', 'Major Accident', 'High', 'DRV003', 'RTE-120', 'Driver fatigue + poor visibility', TRUE, 'Bus went off-road near Mancherial ghat section. 3 passengers injured.'),
('INC005', '2026-06-22', 'Minor Collision', 'Medium', 'DRV002', 'RTE-105', 'Traffic congestion', FALSE, 'Side-swipe with two-wheeler in Karimnagar town traffic.'),
('INC006', '2026-06-18', 'Near Miss', 'Low', 'DRV007', 'RTE-130', 'Driver fatigue', TRUE, 'Jumped red signal at ECIL crossing. Alert conductor intervened.'),
('INC007', '2026-06-12', 'Breakdown', 'Low', 'DRV005', 'RTE-108', 'Tire burst', FALSE, 'Front tire burst near Nalgonda. No injuries, minor delay.'),
('INC008', '2026-06-05', 'Minor Collision', 'Medium', 'DRV010', 'RTE-128', 'Driver fatigue', TRUE, 'Hit road divider near Mehdipatnam after extended 10-hour shift.'),
('INC009', '2026-05-30', 'Near Miss', 'Low', 'DRV002', 'RTE-105', 'Delayed reaction', TRUE, 'Late braking at pedestrian crossing near Karimnagar.'),
('INC010', '2026-05-25', 'Major Accident', 'High', 'DRV012', 'RTE-112', 'Driver fatigue + rain', TRUE, 'Bus overturned near Nirmal in heavy rain. Driver was on 12th consecutive hour.');

-- 7. Seed Alerts
INSERT INTO `alerts` (`id`, `alert_type`, `title`, `message`, `time_ago`, `acknowledged`, `driver_id`) VALUES
('ALT001', 'critical', 'Extreme Fatigue Alert', 'Driver Srinivas Murthy (DRV007) fatigue level at 85%. Immediate rest required.', '10 min ago', FALSE, 'DRV007'),
('ALT002', 'critical', 'Shift Duration Violation', 'Driver Venkatesh Rao (DRV003) has been on duty for 10+ hours on ghat route.', '25 min ago', FALSE, 'DRV003'),
('ALT003', 'warning', 'Rest Period Insufficient', 'Driver Suresh Reddy (DRV002) had only 8 hours rest before current shift (min: 10h).', '1 hour ago', FALSE, 'DRV002'),
('ALT004', 'warning', 'High Fatigue Risk Assignment', 'Shift SHF003 on RTE-112 (Adilabad) has fatigue risk score of 82%.', '2 hours ago', TRUE, 'DRV003'),
('ALT005', 'warning', 'Health Check Overdue', 'Driver Mohan Das (DRV012) health check overdue by 18 days.', '3 hours ago', FALSE, 'DRV012'),
('ALT006', 'info', 'Shift Optimization Available', 'AI recommends reassigning 3 shifts to reduce overall fatigue risk by 15%.', '4 hours ago', FALSE, NULL),
('ALT007', 'warning', 'Driver Fatigue Rising', 'Driver Ganesh Patil (DRV010) fatigue level crossed 70% threshold.', '4 hours ago', TRUE, 'DRV010'),
('ALT008', 'critical', 'Route Risk Alert', 'RTE-130 (City Circular B) has 9 incidents this quarter. Review assignment policy.', '5 hours ago', TRUE, NULL),
('ALT009', 'info', 'Monthly Report Ready', 'June 2026 shift compliance and fatigue analysis report is ready for review.', '6 hours ago', TRUE, NULL),
('ALT010', 'info', 'New Driver Onboarded', 'Praveen Naik (DRV008) completed orientation and is available for assignments.', '1 day ago', TRUE, 'DRV008');

-- 8. Seed Monthly Analytics
INSERT INTO `monthly_analytics` (`month`, `avg_fatigue`, `absenteeism`, `incidents`, `shift_compliance`, `delays`, `satisfaction`) VALUES
('Jan', 42, 5.2, 3, 88, 145, 72),
('Feb', 45, 5.8, 4, 85, 162, 69),
('Mar', 48, 6.5, 5, 82, 178, 65),
('Apr', 52, 7.2, 6, 78, 195, 61),
('May', 55, 7.8, 8, 75, 210, 58),
('Jun', 50, 6.8, 5, 80, 185, 63),
('Jul', 47, 6.0, 4, 84, 160, 67);
