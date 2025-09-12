-- Add reset token fields to users table
ALTER TABLE users 
ADD COLUMN resetToken VARCHAR(255) NULL,
ADD COLUMN resetTokenExpiry TIMESTAMP NULL;

-- Create index on resetToken for better performance
CREATE INDEX idx_users_reset_token ON users(resetToken);