-- G.G Strategy Database Schema
-- Complete MySQL Database Setup

-- Create Database
CREATE DATABASE IF NOT EXISTS gg_strategy;
USE gg_strategy;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks Table
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    category VARCHAR(50),
    due_date DATE,
    start_time TIME,
    end_time TIME,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    color_label VARCHAR(20) DEFAULT '#3b82f6',
    reminder_enabled BOOLEAN DEFAULT TRUE,
    reminder_time ENUM('15min', '30min', '1hour', '1day') DEFAULT '30min',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meetings Table
CREATE TABLE meetings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    meeting_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    attendees TEXT,
    meeting_link VARCHAR(500),
    reminder_enabled BOOLEAN DEFAULT TRUE,
    reminder_time ENUM('15min', '30min', '1hour', '1day') DEFAULT '1hour',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_meeting_date (meeting_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    task_id INT,
    meeting_id INT,
    notification_type ENUM('task_reminder', 'meeting_reminder', 'task_due', 'meeting_approaching') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_email_sent (email_sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Productivity Stats Table
CREATE TABLE productivity_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    stat_date DATE NOT NULL,
    total_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    total_meetings INT DEFAULT 0,
    attended_meetings INT DEFAULT 0,
    productivity_score FLOAT DEFAULT 0.0,
    focus_hours FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, stat_date),
    INDEX idx_user_id (user_id),
    INDEX idx_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for Performance
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);
CREATE INDEX idx_meetings_user_date ON meetings(user_id, meeting_date);
CREATE INDEX idx_notifications_user_time ON notifications(user_id, scheduled_time);
