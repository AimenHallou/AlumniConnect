import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Conversation } from '../types/messages';

export function useConversations(userId: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async (uid: string) => {
    try {
      setIsLoading(true);
      // Step 1: Get user's conversations
      const { data: userConversations, error: conversationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', uid);

      if (conversationsError) throw conversationsError;

      if (!userConversations?.length) {
        setConversations([]);
        return;
      }

      const conversationIds = userConversations.map(c => c.conversation_id);

      // Step 2: Get all participants
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          user_id,
          profiles!conversation_participants_user_id_fkey (
            id,
            full_name,
            user_type,
            degree
          )
        `)
        .in('conversation_id', conversationIds);

      if (participantsError) throw participantsError;

      // Step 3: Get latest messages
      const { data: latestMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Format conversations
      const formattedConversations = conversationIds
        .map(convId => {
          const convParticipants = (participants || [])
            .filter(p => p.conversation_id === convId);
          
          const otherParticipant = convParticipants.find(p => p.user_id !== uid);
          const userParticipant = convParticipants.find(p => p.user_id === uid);
          const lastMessage = latestMessages?.find(m => m.conversation_id === convId);

          if (!otherParticipant?.profiles || !userParticipant?.profiles) {
            return null;
          }

          const conversation: Conversation = {
            id: convId,
            participants: [{
              user_id: uid,
              profiles: userParticipant.profiles
            }, {
              user_id: otherParticipant.user_id,
              profiles: otherParticipant.profiles
            }],
            last_message: lastMessage ? {
              content: lastMessage.content,
              created_at: lastMessage.created_at
            } : undefined,
            updated_at: lastMessage?.created_at || new Date().toISOString()
          };

          return conversation;
        })
        .filter((conv): conv is Conversation => conv !== null)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setConversations(formattedConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading conversations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadConversations(userId);
    }
  }, [userId]);

  return {
    conversations,
    isLoading,
    error,
    loadConversations
  };
} 