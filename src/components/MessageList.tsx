import { Message } from '../types/messages';
import { formatTimestamp, getInitials } from '../utils/formatters';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({ messages, currentUserId, messagesEndRef }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => {
        const isCurrentUser = message.sender_id === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start max-w-[70%]">
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-sm font-semibold mr-2 flex-shrink-0">
                  {message.profiles && getInitials(message.profiles.full_name)}
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-green-800 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {!isCurrentUser && message.profiles && (
                  <div className="text-xs text-gray-600 font-medium mb-1">
                    {message.profiles.full_name}
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.created_at)}
                </p>
              </div>
              {isCurrentUser && message.profiles && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-sm font-semibold ml-2 flex-shrink-0">
                  {getInitials(message.profiles.full_name)}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
} 