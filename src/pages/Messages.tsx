import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import ConversationList from '../components/ConversationList';
import { useMessages } from '../hooks/useMessages';
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '../types/messages';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MESSAGE_CHAR_LIMIT = 2000;

  const { conversations, isLoading: conversationsLoading } = useConversations(currentUserId);
  const { messages, sendMessage } = useMessages(selectedConversation?.id || null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    const conversationId = searchParams.get('conversation');
    
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        navigate('/login');
        return;
      }
      setCurrentUserId(user.id);
      if (conversationId) {
        const conv = conversations.find(c => c.id === conversationId);
        if (conv) {
          setSelectedConversation(conv);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, navigate, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId || newMessage.length > MESSAGE_CHAR_LIMIT) return;
    
    const success = await sendMessage(newMessage, selectedConversation, currentUserId);
    if (success) {
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64 p-8">
        {conversationsLoading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Messages Grid */}
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
              {/* Conversations List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100%-4rem)]">
                  {conversations.map(conversation => {
                    const otherParticipant = conversation.participants.find(p => p.user_id !== currentUserId);
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedConversation?.id === conversation.id 
                            ? 'bg-gray-50 dark:bg-gray-700' 
                            : ''
                        }`}
                      >
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-100 font-semibold">
                          {otherParticipant?.profiles.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {otherParticipant?.profiles.full_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {otherParticipant?.profiles.degree}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Area */}
              <div className="col-span-2 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-100 font-semibold mr-3">
                          {selectedConversation.participants.find(p => p.user_id !== currentUserId)?.profiles.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900 dark:text-white">
                            {selectedConversation.participants.find(p => p.user_id !== currentUserId)?.profiles.full_name}
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedConversation.participants.find(p => p.user_id !== currentUserId)?.profiles.degree}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                      <MessageList
                        messages={messages}
                        currentUserId={currentUserId || ''}
                        messagesEndRef={messagesEndRef}
                      />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="relative">
                        <textarea
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="w-full p-3 pr-12 border dark:border-gray-700 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          rows={3}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className={`absolute right-3 bottom-3 p-2 rounded-lg ${
                            !newMessage.trim()
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Select a chat to start messaging
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 