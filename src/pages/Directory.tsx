import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  user_type: string;
  degree: string;
  location: string;
  graduation_year?: string;
  current_year?: string;
  linkedin_url?: string;
}

export default function Directory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesFilter = filter === 'all' || profile.user_type === filter;
    const matchesSearch = (profile.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (profile.degree?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMessageClick = async (profileId: string) => {
    console.log('Starting message click handler...', { profileId, currentUserId });
    
    try {
      if (!currentUserId) {
        throw new Error('You must be logged in to send messages');
      }

      // Check if a conversation already exists between these users
      const { data: existingConversations, error: existingError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      console.log('Existing conversations query result:', { existingConversations, error: existingError });

      let conversationId: string | null = null;

      if (existingConversations && existingConversations.length > 0) {
        // Get all conversation IDs where current user is a participant
        const conversationIds = existingConversations.map(c => c.conversation_id);
        console.log('Found existing conversation IDs:', conversationIds);

        // Find conversations where the other user is also a participant
        const { data: sharedConversations, error: sharedError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', profileId)
          .in('conversation_id', conversationIds)
          .limit(1)
          .single();

        console.log('Shared conversations query result:', { sharedConversations, error: sharedError });

        if (sharedConversations) {
          conversationId = sharedConversations.conversation_id;
          console.log('Found existing shared conversation:', conversationId);
        }
      }

      // If no conversation exists, create a new one
      if (!conversationId) {
        console.log('No existing conversation found, creating new one...');
        
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({})
          .select()
          .single();

        console.log('New conversation creation result:', { newConversation, error: conversationError });

        if (conversationError) throw conversationError;
        
        conversationId = newConversation.id;
        console.log('Created new conversation:', conversationId);

        // Add both users as participants
        const { data: participants, error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: currentUserId },
            { conversation_id: conversationId, user_id: profileId }
          ])
          .select();

        console.log('Adding participants result:', { participants, error: participantsError });

        if (participantsError) throw participantsError;
      }

      console.log('Navigating to messages with conversation:', conversationId);
      // Navigate to the messages page with the conversation ID
      navigate(`/messages?conversation=${conversationId}`);
    } catch (err) {
      console.error('Error in handleMessageClick:', err);
      setError('Failed to start conversation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Directory</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or role..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'all' ? 'bg-green-800 text-white' : 'bg-white text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('student')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'student' ? 'bg-green-800 text-white' : 'bg-white text-gray-700'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setFilter('alumni')}
                className={`px-4 py-2 rounded-lg ${
                  filter === 'alumni' ? 'bg-green-800 text-white' : 'bg-white text-gray-700'
                }`}
              >
                Alumni
              </button>
            </div>
          </div>

          {/* Directory Grid */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">Loading profiles...</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => (
              <div key={profile.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-xl font-semibold mr-4">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{profile.full_name}</h3>
                    <p className="text-gray-600">
                      {profile.user_type === 'student'
                        ? `${profile.current_year || 'Unknown'}, ${profile.degree || 'Unknown'}`
                        : profile.degree || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {profile.location || 'Location not specified'}
                  </div>
                  <div className="flex items-center">
                    {profile.user_type === 'alumni' ? (
                      <Briefcase size={16} className="mr-2" />
                    ) : (
                      <GraduationCap size={16} className="mr-2" />
                    )}
                    {profile.user_type === 'alumni'
                      ? `Class of ${profile.graduation_year || 'Unknown'}`
                      : profile.current_year || 'Unknown'}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View LinkedIn
                    </a>
                  )}
                  <button 
                    onClick={() => handleMessageClick(profile.id)}
                    disabled={profile.id === currentUserId}
                    className={`flex items-center space-x-1 ml-auto ${
                      profile.id === currentUserId 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-800 hover:text-green-700'
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>)}
        </div>
      </div>
    </div>
  );
} 