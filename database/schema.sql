-- TGSRTC Driver & Conductor Shift Management System Database Schema
-- Academic Framework: B.Tech PSE Engineering Project (IP-3)
-- Database Engine: MariaDB / MySQL 8.0

CREATE DATABASE IF NOT EXISTS `tgsrtc_shift_management` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `tgsrtc_shift_management`;

-- 1. Users & RBAC
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `employee_id` VARCHAR(50) UNIQUE NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'DEPOT_MANAGER', 'DRIVER', 'CONDUCTOR') NOT NULL DEFAULT 'DEPOT_MANAGER',
    `phone` VARCHAR(20) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Staff Directory (Drivers & Conductors)
CREATE TABLE IF NOT EXISTS `staff` (
    `id` VARCHAR(50) PRIMARY KEY, -- e.g. DRV001, CND001
    `name` VARCHAR(100) NOT NULL,
    `role` ENUM('Driver', 'Conductor') NOT NULL,
    `age` INT NOT NULL,
    `experience` INT NOT NULL,
    `health_score` INT NOT NULL DEFAULT 80,
    `fatigue_level` INT NOT NULL DEFAULT 30,
    `status` ENUM('On Duty', 'Off Duty', 'On Leave', 'Suspended') NOT NULL DEFAULT 'Off Duty',
    `assigned_route` VARCHAR(50) DEFAULT NULL,
    `hours_worked` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `rest_hours` DECIMAL(5,2) NOT NULL DEFAULT 12.00,
    `phone` VARCHAR(20) NOT NULL,
    `blood_group` VARCHAR(10) DEFAULT 'O+',
    `last_health_check` DATE DEFAULT NULL,
    `join_date` DATE DEFAULT NULL,
    `depot_location` VARCHAR(100) DEFAULT 'MGBS, Hyderabad',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_staff_role` (`role`),
    INDEX `idx_staff_status` (`status`),
    INDEX `idx_fatigue_level` (`fatigue_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Transit Routes Master
CREATE TABLE IF NOT EXISTS `routes` (
    `id` VARCHAR(50) PRIMARY KEY, -- e.g. RTE-101
    `name` VARCHAR(150) NOT NULL,
    `origin` VARCHAR(150) NOT NULL,
    `destination` VARCHAR(150) NOT NULL,
    `distance` INT NOT NULL, -- in KM
    `difficulty` INT NOT NULL DEFAULT 3, -- 1-10
    `traffic_index` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
    `avg_duration` INT NOT NULL, -- in minutes
    `terrain` ENUM('Highway', 'Mixed', 'Ghat', 'Urban') NOT NULL DEFAULT 'Highway',
    `incidents_count` INT NOT NULL DEFAULT 0,
    `avg_delay` INT NOT NULL DEFAULT 10, -- in minutes
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_terrain` (`terrain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bus Fleet Master
CREATE TABLE IF NOT EXISTS `buses` (
    `bus_number` VARCHAR(50) PRIMARY KEY, -- e.g. TS-09-Z-1001
    `depot_name` VARCHAR(100) NOT NULL DEFAULT 'MGBS Depot',
    `bus_type` ENUM('Super Luxury', 'Deluxe', 'Express', 'Palle Velugu', 'Metro Express', 'Garuda Plus') NOT NULL DEFAULT 'Express',
    `seating_capacity` INT NOT NULL DEFAULT 49,
    `status` ENUM('ACTIVE', 'MAINTENANCE', 'RESERVE', 'DECOMMISSIONED') NOT NULL DEFAULT 'ACTIVE',
    `fitness_expiry` DATE DEFAULT NULL,
    `assigned_route_id` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`assigned_route_id`) REFERENCES `routes`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Duty Shifts & Scheduling
CREATE TABLE IF NOT EXISTS `shifts` (
    `id` VARCHAR(50) PRIMARY KEY, -- e.g. SHF001
    `driver_id` VARCHAR(50) NOT NULL,
    `conductor_id` VARCHAR(50) NOT NULL,
    `route_id` VARCHAR(50) NOT NULL,
    `bus_number` VARCHAR(50) DEFAULT NULL,
    `shift_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `status` ENUM('Active', 'Scheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
    `fatigue_risk` INT NOT NULL DEFAULT 30,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`driver_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`conductor_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`bus_number`) REFERENCES `buses`(`bus_number`) ON DELETE SET NULL,
    INDEX `idx_shift_date` (`shift_date`),
    INDEX `idx_shift_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Safety & Incident Logs
CREATE TABLE IF NOT EXISTS `incidents` (
    `id` VARCHAR(50) PRIMARY KEY, -- e.g. INC001
    `incident_date` DATE NOT NULL,
    `incident_type` VARCHAR(100) NOT NULL,
    `severity` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Low',
    `driver_id` VARCHAR(50) DEFAULT NULL,
    `route_id` VARCHAR(50) DEFAULT NULL,
    `cause` VARCHAR(255) NOT NULL,
    `fatigue_related` BOOLEAN NOT NULL DEFAULT FALSE,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`driver_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE SET NULL,
    INDEX `idx_incident_date` (`incident_date`),
    INDEX `idx_fatigue_related` (`fatigue_related`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Fatigue & Duty Alerts
CREATE TABLE IF NOT EXISTS `alerts` (
    `id` VARCHAR(50) PRIMARY KEY, -- e.g. ALT001
    `alert_type` ENUM('critical', 'warning', 'info') NOT NULL DEFAULT 'info',
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `time_ago` VARCHAR(50) DEFAULT 'Just now',
    `acknowledged` BOOLEAN NOT NULL DEFAULT FALSE,
    `driver_id` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`driver_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
    INDEX `idx_acknowledged` (`acknowledged`),
    INDEX `idx_alert_type` (`alert_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Monthly Analytics Snapshot
CREATE TABLE IF NOT EXISTS `monthly_analytics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `month` VARCHAR(20) NOT NULL,
    `avg_fatigue` INT NOT NULL,
    `absenteeism` DECIMAL(4,2) NOT NULL,
    `incidents` INT NOT NULL,
    `shift_compliance` INT NOT NULL,
    `delays` INT NOT NULL,
    `satisfaction` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
