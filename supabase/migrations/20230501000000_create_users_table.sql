-- Create a new table for users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a trigger to update the updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Modify the tarot_readings table to use the new users table
ALTER TABLE tarot_readings
DROP COLUMN user_id,
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create an index on the user_id column for better query performance
CREATE INDEX idx_tarot_readings_user_id ON tarot_readings(user_id);