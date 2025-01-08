import React, { useState } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, MessageCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SAMPLE_USERS = [
  {
    id: 1,
    name: 'Alex Thompson',
    type: 'alumni',
    role: 'Marketing Director at Nike',
    location: 'Portland, OR',
    graduationYear: '2015',
    industry: 'Marketing & Advertising',
    connections: 245,
  },
  {
    id: 2,
    name: 'Jessica Lee',
    type: 'student',
    role: 'Senior, Business Administration',
    location: 'Huntington, WV',
    graduationYear: '2024',
    interests: 'Finance, Consulting',
    connections: 89,
  },
  {
    id: 3,
    name: 'David Martinez',
    type: 'alumni',
    role: 'Investment Banker at Goldman Sachs',
    location: 'New York, NY',
    graduationYear: '2018',
    industry: 'Finance',
    connections: 412,
  },
  {
    id: 4,
    name: 'Rachel Kim',
    type: 'student',
    role: 'Junior, Marketing',
    location: 'Huntington, WV',
    graduationYear: '2025',
    interests: 'Digital Marketing, Brand Management',
    connections: 67,
  },
];

export default function Directory() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = SAMPLE_USERS.filter(user => {
    const matchesFilter = filter === 'all' || user.type === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <div key={user.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-xl font-semibold mr-4">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-600">{user.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {user.location}
                  </div>
                  <div className="flex items-center">
                    {user.type === 'alumni' ? (
                      <Briefcase size={16} className="mr-2" />
                    ) : (
                      <GraduationCap size={16} className="mr-2" />
                    )}
                    {user.type === 'alumni' ? user.industry : user.interests}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{user.connections} connections</span>
                  <button className="flex items-center space-x-1 text-green-800 hover:text-green-700">
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 