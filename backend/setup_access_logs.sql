-- Setup script for access_logs table
-- Run this script in your MySQL database to create the access_logs table

USE mimifua_db;

-- Create access_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS access_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  session_duration INT DEFAULT 0, -- in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_login (user_id, login_time),
  INDEX idx_status (status),
  INDEX idx_login_time (login_time)
);

-- Show table structure
DESCRIBE access_logs;

-- Show existing tables to verify
SHOW TABLES;

SELECT 'Access logs table setup complete!' as message;
