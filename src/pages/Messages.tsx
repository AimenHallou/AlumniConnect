import { useState } from 'react';
import { Search, Send } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SAMPLE_CHATS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    lastMessage: "Thanks for reaching out! I'd be happy to help with your internship search.",
    timestamp: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    name: 'Prof. Michael Brown',
    role: 'Professor, Marshall School of Business',
    lastMessage: "Let's schedule a meeting to discuss your research project.",
    timestamp: '1 hour ago',
    unread: false,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Marketing Manager at Apple',
    lastMessage: 'Great meeting you at the alumni event!',
    timestamp: '2 days ago',
    unread: false,
  },
];

const SAMPLE_MESSAGES = [
  {
    id: 1,
    sender: 'Sarah Johnson',
    content: "Hi! I saw that you're interested in software engineering internships.",
    timestamp: '2:30 PM',
    isSender: false,
  },
  {
    id: 2,
    sender: 'You',
    content: "Yes, I am! I'm currently looking for summer opportunities.",
    timestamp: '2:31 PM',
    isSender: true,
  },
  {
    id: 3,
    sender: 'Sarah Johnson',
    content: 'Great! We have some exciting internship positions opening up at Google. Would you like me to share more details?',
    timestamp: '2:33 PM',
    isSender: false,
  },
  {
    id: 4,
    sender: 'You',
    content: 'That would be amazing! Thank you so much for the help.',
    timestamp: '2:34 PM',
    isSender: true,
  },
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(SAMPLE_CHATS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = SAMPLE_CHATS.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 grid grid-cols-3 h-screen">
        {/* Chat List */}
        <div className="col-span-1 border-r bg-white">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {filteredChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 ${
                    selectedChat.id === chat.id ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">
                      {chat.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.role}</p>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="col-span-2 flex flex-col bg-white">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">
                    {selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="font-semibold">{selectedChat.name}</h2>
                    <p className="text-sm text-gray-600">{selectedChat.role}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {SAMPLE_MESSAGES.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isSender
                          ? 'bg-green-800 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isSender ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="p-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
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
      </div>
    </div>
  );
} 