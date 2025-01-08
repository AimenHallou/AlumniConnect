import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    user_type: string;
    degree: string;
  };
  likes: { id: string; user_id: string }[];
  comments: { id: string }[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name,
            user_type,
            degree
          ),
          likes (id, user_id),
          comments (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('posts')
        .insert([{ content: newPost, user_id: user.id }]);

      if (error) throw error;

      setNewPost('');
      loadPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: likes } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (likes && likes.length > 0) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', likes[0].id);
      } else {
        await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: user.id }]);
      }

      loadPosts();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <textarea
            placeholder="Share something with your network..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleCreatePost}
              className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Post
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">
                    {post.profiles.full_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{post.profiles.full_name}</h3>
                    <p className="text-sm text-gray-600">
                      {post.profiles.user_type === 'student' 
                        ? `Student, ${post.profiles.degree}`
                        : post.profiles.degree}
                    </p>
                    <p className="text-xs text-gray-500">{formatTimestamp(post.created_at)}</p>
                  </div>
                  {post.user_id === currentUserId && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="ml-auto p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                      title="Delete post"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <div className="flex items-center space-x-6 text-gray-600">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 hover:text-green-800 ${
                      post.likes?.some(like => like.user_id === currentUserId)
                        ? 'text-green-800 font-semibold'
                        : ''
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-800">
                    <MessageCircle size={18} />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-green-800">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 