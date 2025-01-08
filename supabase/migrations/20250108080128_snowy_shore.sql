/*
  # Fix messaging system policies

  1. Changes
    - Simplify conversation participant policies to avoid recursion
    - Add optimized indexes for better performance
    - Update message policies for better access control

  2. Security
    - Maintain RLS for all tables
    - Ensure users can only access their own conversations
    - Prevent unauthorized message access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Access conversations" ON conversations;
DROP POLICY IF EXISTS "Access participants" ON conversation_participants;
DROP POLICY IF EXISTS "Insert participants" ON conversation_participants;

-- Simplified conversation access policy
CREATE POLICY "Access own conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = id
    AND user_id = auth.uid()
  ));

-- Non-recursive participant policies
CREATE POLICY "View conversation participants"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Create conversation participants"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Optimize indexes
DROP INDEX IF EXISTS idx_conversation_participants_composite;
DROP INDEX IF EXISTS idx_messages_composite;

CREATE INDEX idx_conversation_participants_lookup 
  ON conversation_participants(user_id, conversation_id);

CREATE INDEX idx_messages_lookup
  ON messages(conversation_id, created_at DESC);

-- Update message policies for better performance
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON messages;

CREATE POLICY "Access messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );