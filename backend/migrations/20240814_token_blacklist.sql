-- Create token_blacklist table
CREATE TABLE IF NOT EXISTS token_blacklist (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_token_blacklist_token ON token_blacklist (token);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires_at ON token_blacklist (expires_at);

-- Cleanup job (run this as a scheduled job in production)
-- DELETE FROM token_blacklist WHERE expires_at < NOW();
