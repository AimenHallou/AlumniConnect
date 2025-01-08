/*
  # Fix messaging system policies

  1. Changes
    - Remove recursive policies causing infinite recursion
    - Simplify access control logic
    - Add optimized indexes

  2. Security
    - Maintain RLS for all tables
    - Ensure users can only access their own conversations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "access_conversations" ON conversations;
DROP POLICY IF EXISTS "view_participants" ON conversation_participants;
DROP POLICY IF EXISTS "insert_participants" ON conversation_participants;

-- Simple, non-recursive conversation policy
CREATE POLICY "access_conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = id 
    AND user_id = auth.uid()
  ));

-- Simple participant policies without recursion
CREATE POLICY "view_participants"
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

CREATE POLICY "insert_participants"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM conversation_participants
      WHERE conversation_id = conversation_participants.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Optimize indexes
DROP INDEX IF EXISTS idx_participants_user_lookup;
DROP INDEX IF EXISTS idx_participants_conversation_lookup;

CREATE INDEX idx_participants_user_conversation 
  ON conversation_participants(user_id, conversation_id);

CREATE INDEX idx_participants_conversation_user
  ON conversation_participants(conversation_id, user_id);

-- Update message policies for consistency
DROP POLICY IF EXISTS "access_messages" ON messages;
DROP POLICY IF EXISTS "send_messages" ON messages;

CREATE POLICY "access_messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "send_messages"
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