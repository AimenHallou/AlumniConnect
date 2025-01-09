import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Trash2, Send, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    user_type: string;
    degree: string;
  };
}

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
  comments: Comment[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const POST_CHAR_LIMIT = 500;
  const COMMENT_CHAR_LIMIT = 200;

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
          comments (
            id,
            content,
            created_at,
            user_id,
            profiles (
              full_name,
              user_type,
              degree
            )
          )
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
    if (!newPost.trim() || newPost.length > POST_CHAR_LIMIT) return;

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

  const handleCreateComment = async (postId: string) => {
    if (!newComment.trim() || newComment.length > COMMENT_CHAR_LIMIT) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('comments')
        .insert([{ 
          content: newComment, 
          user_id: user.id,
          post_id: postId 
        }]);

      if (error) throw error;

      setNewComment('');
      setActiveCommentPost(null);
      loadPosts();
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Failed to create comment');
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
      setPostToDelete(null);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Feed</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Post
            </button>
          </div>

          {/* Create Post Form */}
          {showCreatePost && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create a Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-4 border dark:border-gray-700 rounded-lg mb-4 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                rows={4}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {postToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Post</h3>
                  <button
                    onClick={() => setPostToDelete(null)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setPostToDelete(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeletePost(postToDelete)}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts List */}
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-100 font-semibold">
                      {post.profiles.full_name?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{post.profiles.full_name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.profiles.user_type === 'student' ? 'Student' : 'Alumni'} • {post.profiles.degree}
                      </p>
                    </div>
                  </div>
                  {post.user_id === currentUserId && (
                    <button
                      onClick={() => setPostToDelete(post.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 hover:text-green-800 dark:hover:text-green-400 ${
                      post.likes?.some(like => like.user_id === currentUserId)
                        ? 'text-green-800 dark:text-green-400 font-semibold'
                        : ''
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                    className={`flex items-center space-x-2 hover:text-green-800 dark:hover:text-green-400 ${
                      activeCommentPost === post.id ? 'text-green-800 dark:text-green-400 font-semibold' : ''
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {(activeCommentPost === post.id || post.comments?.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    {post.comments?.map(comment => (
                      <div key={comment.id} className="flex items-start space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-100 text-sm font-semibold">
                          {comment.profiles.full_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {comment.profiles.full_name}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeCommentPost === post.id && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-100 text-sm font-semibold">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <textarea
                              placeholder="Write a comment..."
                              className="w-full p-2 pr-24 border dark:border-gray-700 rounded-lg resize-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                              rows={2}
                              value={newComment}
                              onChange={(e) => {
                                if (e.target.value.length <= COMMENT_CHAR_LIMIT) {
                                  setNewComment(e.target.value);
                                }
                              }}
                              maxLength={COMMENT_CHAR_LIMIT}
                            />
                            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {newComment.length}/{COMMENT_CHAR_LIMIT}
                              </span>
                              <button
                                onClick={() => handleCreateComment(post.id)}
                                disabled={!newComment.trim() || newComment.length > COMMENT_CHAR_LIMIT}
                                className={`p-1.5 rounded-lg ${
                                  !newComment.trim() || newComment.length > COMMENT_CHAR_LIMIT
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-green-800 text-white hover:bg-green-700'
                                }`}
                              >
                                <Send size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 