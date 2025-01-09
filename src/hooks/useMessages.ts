import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Message, Conversation } from '../types/messages';

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async (convId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_sender_id_fkey (
            id,
            full_name,
            user_type,
            degree
          )
        `)
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, conversation: Conversation, senderId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          conversation_id: conversation.id,
          sender_id: senderId
        });

      if (error) throw error;
      await loadMessages(conversation.id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message');
      return false;
    }
  };

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    loadMessages
  };
} 