import { Search } from 'lucide-react';
import { Conversation } from '../types/messages';
import { formatTimestamp, getInitials } from '../utils/formatters';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation
}: ConversationListProps) {
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.user_id !== currentUserId)?.profiles;
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {filteredConversations.map(conv => {
          const otherParticipant = getOtherParticipant(conv);
          if (!otherParticipant) return null;

          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 ${
                selectedConversationId === conv.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">
                  {getInitials(otherParticipant.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">{otherParticipant.full_name}</h3>
                    {conv.last_message && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTimestamp(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {otherParticipant.user_type === 'student'
                      ? `Student, ${otherParticipant.degree}`
                      : otherParticipant.degree}
                  </p>
                  {conv.last_message && (
                    <p className="text-sm text-gray-500 truncate">
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 