-- Add status column to users table
ALTER TABLE users 
ADD COLUMN status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' 
AFTER role;
