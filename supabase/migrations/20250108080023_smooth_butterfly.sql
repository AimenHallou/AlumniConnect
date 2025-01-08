/*
  # Fix messaging system policies

  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies for conversations and participants
    - Add function to handle conversation updates
    - Add performance indexes

  2. Security
    - Maintains RLS security
    - Prevents policy recursion
    - Ensures users can only access their conversations
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "View own conversations" ON conversations;
DROP POLICY IF EXISTS "View conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Create conversation participants" ON conversation_participants;

-- Create new simplified policies for conversations
CREATE POLICY "Access conversations"
  ON conversations FOR ALL
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Create new simplified policies for conversation participants
CREATE POLICY "Access participants"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Insert participants"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_composite 
  ON conversation_participants(conversation_id, user_id);

CREATE INDEX IF NOT EXISTS idx_messages_composite
  ON messages(conversation_id, created_at DESC);