-- G.G Strategy Task Management System - Database Setup

-- Create notes table for storing user notes and bookmarks
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  type VARCHAR(50) DEFAULT 'note',
  tags VARCHAR(255),
  color VARCHAR(20) DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Query to verify the notes table was created
-- SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'your_database_name' AND TABLE_NAME = 'notes';
