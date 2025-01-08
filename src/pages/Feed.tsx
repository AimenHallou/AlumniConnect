import React from 'react';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SAMPLE_POSTS = [
  {
    id: 1,
    author: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    content: 'Excited to announce that we are hiring summer interns! If you are a current Marshall student interested in tech, feel free to reach out. #MarshallAlumni #TechJobs',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: 'Mike Chen',
    role: 'Class of 2024',
    content: 'Just completed my first internship at JPMorgan Chase! Grateful for the Marshall alumni network that helped me land this opportunity. Looking forward to sharing my experience with other students.',
    timestamp: '5 hours ago',
    likes: 45,
    comments: 8,
  },
  {
    id: 3,
    author: 'Dr. Emily Rodriguez',
    role: 'Professor, Marshall School of Business',
    content: 'Proud to share that our Business Analytics program has been ranked #1 in the state! Thanks to our amazing faculty and successful alumni who continue to support our growth.',
    timestamp: '1 day ago',
    likes: 156,
    comments: 23,
  },
];

export default function Feed() {
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
          />
          <div className="mt-3 flex justify-end">
            <button className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {SAMPLE_POSTS.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold">{post.author}</h3>
                  <p className="text-sm text-gray-600">{post.role}</p>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <p className="text-gray-800 mb-4">{post.content}</p>
              <div className="flex items-center space-x-6 text-gray-600">
                <button className="flex items-center space-x-2 hover:text-green-800">
                  <ThumbsUp size={18} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-800">
                  <MessageCircle size={18} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-800">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 