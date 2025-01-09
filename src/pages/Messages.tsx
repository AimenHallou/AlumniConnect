import { useState, useRef, useEffect } from 'react';
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
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;
    
    const success = await sendMessage(newMessage, selectedConversation, currentUserId);
    if (success) {
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 grid grid-cols-3 h-screen">
        {conversationsLoading ? (
          <div className="col-span-3 flex items-center justify-center">
            <div className="text-gray-500">Loading conversations...</div>
          </div>
        ) : (
          <>
            {/* Chat List */}
            <div className="col-span-1 border-r bg-white">
              <ConversationList
                conversations={conversations}
                currentUserId={currentUserId || ''}
                selectedConversationId={selectedConversation?.id || null}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectConversation={setSelectedConversation}
              />
            </div>

            {/* Chat Messages */}
            <div className="col-span-2 flex flex-col bg-white">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">
                        {selectedConversation.participants.find(p => p.user_id !== currentUserId)?.profiles.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h2 className="font-semibold">
                          {selectedConversation.participants.find(p => p.user_id !== currentUserId)?.profiles.full_name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.participants.find(p => p.user_id !== currentUserId)?.profiles.degree}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <MessageList
                    messages={messages}
                    currentUserId={currentUserId || ''}
                    messagesEndRef={messagesEndRef}
                  />

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="p-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a chat to start messaging
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 