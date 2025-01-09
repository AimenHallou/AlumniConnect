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
            onChange={(e) => {
              if (e.target.value.length <= POST_CHAR_LIMIT) {
                setNewPost(e.target.value);
              }
            }}
            maxLength={POST_CHAR_LIMIT}
          />
          <div className="mt-3 flex justify-between items-center">
            <span className={`text-sm ${
              newPost.length > POST_CHAR_LIMIT * 0.9 
                ? 'text-red-500' 
                : 'text-gray-500'
            }`}>
              {newPost.length}/{POST_CHAR_LIMIT} characters
            </span>
            <button
              onClick={handleCreatePost}
              disabled={newPost.length > POST_CHAR_LIMIT}
              className={`px-4 py-2 rounded-lg ${
                newPost.length > POST_CHAR_LIMIT
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-800 hover:bg-green-700 text-white'
              }`}
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

        {/* Delete Confirmation Modal */}
        {postToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
                <button
                  onClick={() => setPostToDelete(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
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
                      onClick={() => setPostToDelete(post.id)}
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
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                    className={`flex items-center space-x-2 hover:text-green-800 ${
                      activeCommentPost === post.id ? 'text-green-800 font-semibold' : ''
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {(activeCommentPost === post.id || post.comments?.length > 0) && (
                  <div className="mt-4 pt-4 border-t">
                    {/* Comment List */}
                    {post.comments?.map(comment => (
                      <div key={comment.id} className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                          {comment.profiles.full_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium text-sm">{comment.profiles.full_name}</span>
                              <span className="text-xs text-gray-500 ml-2">{formatTimestamp(comment.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    {activeCommentPost === post.id && (
                      <div className="flex items-start space-x-3 mt-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-sm font-semibold">
                          {post.profiles.full_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <textarea
                              placeholder="Write a comment..."
                              className="w-full p-2 pr-24 border rounded-lg resize-none text-sm"
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
                              <span className="text-xs text-gray-400">
                                {newComment.length}/{COMMENT_CHAR_LIMIT}
                              </span>
                              <button
                                onClick={() => handleCreateComment(post.id)}
                                disabled={!newComment.trim() || newComment.length > COMMENT_CHAR_LIMIT}
                                className={`p-1.5 rounded-lg ${
                                  !newComment.trim() || newComment.length > COMMENT_CHAR_LIMIT
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 