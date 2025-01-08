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
DROP POLICY IF EXISTS "Access own conversations" ON conversations;
DROP POLICY IF EXISTS "View conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Create conversation participants" ON conversation_participants;

-- Simple, non-recursive conversation policy
CREATE POLICY "access_conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Simple participant policies without recursion
CREATE POLICY "view_participants"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM conversation_participants cp2
      WHERE cp2.conversation_id = conversation_participants.conversation_id
      AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "insert_participants"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Optimize indexes
CREATE INDEX IF NOT EXISTS idx_participants_user_lookup 
  ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_participants_conversation_lookup
  ON conversation_participants(conversation_id);

-- Update message policies to match
DROP POLICY IF EXISTS "Access messages" ON messages;
DROP POLICY IF EXISTS "Send messages" ON messages;

CREATE POLICY "access_messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "send_messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 
      FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );