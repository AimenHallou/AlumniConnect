export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  conversation_id: string;
  profiles?: {
    id: string;
    full_name: string;
    user_type: string | null;
    degree: string;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  user_type: string | null;
  degree: string;
}

export interface ConversationParticipant {
  user_id: string;
  profiles: Profile;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  last_message?: {
    content: string;
    created_at: string;
  };
  updated_at: string;
} 