import React from 'react';

interface MessageListProps {
  messages: any[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('');
};

export default function MessageList({ messages, currentUserId, messagesEndRef }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map(message => {
        const isCurrentUser = message.sender_id === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start max-w-[70%]">
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-800 dark:text-green-100 text-sm font-semibold mr-2 flex-shrink-0">
                  {message.profiles && getInitials(message.profiles.full_name)}
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-green-800 text-white rounded-tr-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none'
                }`}
              >
                {!isCurrentUser && message.profiles && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                    {message.profiles.full_name}
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTimestamp(message.created_at)}
                </p>
              </div>
              {isCurrentUser && message.profiles && (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-800 dark:text-green-100 text-sm font-semibold ml-2 flex-shrink-0">
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