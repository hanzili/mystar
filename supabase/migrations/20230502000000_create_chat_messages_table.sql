-- Create a new table for chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prediction_id UUID REFERENCES tarot_readings(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_ai_response BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the user_id column for better query performance
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Create an index on the prediction_id column for better query performance
CREATE INDEX idx_chat_messages_prediction_id ON chat_messages(prediction_id);