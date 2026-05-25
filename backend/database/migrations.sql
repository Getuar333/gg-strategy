-- ============================================
-- G.G Strategy Database Migrations
-- ============================================

-- Create notes table for storing user notes, bookmarks, reminders
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'note',
  tags VARCHAR(500),
  color VARCHAR(20) DEFAULT '#3b82f6',
  category VARCHAR(100),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at),
  INDEX idx_pinned (is_pinned),
  FULLTEXT INDEX ft_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add missing profile fields to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(100);

-- Create database backup marker
-- Last updated: 2026-05-24
-- Tables: users, tasks, meetings, notifications, productivity_stats, notes
