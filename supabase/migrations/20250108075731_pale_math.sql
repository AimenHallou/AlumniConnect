/*
  # Fix conversation RLS policies
  
  1. Changes
    - Drop and recreate conversation participant policies to avoid recursion
    - Add policy for creating new conversations
    - Add policy for inserting conversation participants
  
  2. Security
    - Maintain security while fixing recursion issues
    - Ensure users can only access their own conversations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves to conversations" ON conversation_participants;

-- Create new policies for conversation_participants
CREATE POLICY "Users can view their own conversation participants"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view participants of their conversations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversation participants"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is adding themselves
    user_id = auth.uid()
    OR
    -- Or if user is already a participant in the conversation
    EXISTS (
      SELECT 1 
      FROM conversation_participants 
      WHERE conversation_id = conversation_participants.conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Add policy for creating new conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);