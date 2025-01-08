import { LayoutDashboard, Users, MessageCircle, Settings, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed w-64 h-full bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-green-800">Alumni Connect</h2>
      </div>
      <nav className="flex flex-col h-[calc(100%-64px)]">
        <div className="p-4 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/feed"
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/feed') ? 'bg-green-50 text-green-800' : 'text-gray-700'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Feed</span>
            </Link>
          </li>
          <li>
            <Link
              to="/directory"
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/directory') ? 'bg-green-50 text-green-800' : 'text-gray-700'
              }`}
            >
              <Users size={20} />
              <span>Directory</span>
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/messages') ? 'bg-green-50 text-green-800' : 'text-gray-700'
              }`}
            >
              <MessageCircle size={20} />
              <span>Messages</span>
            </Link>
          </li>
        </ul>
        </div>
        <div className="p-4 border-t">
          <Link
            to="/profile"
            className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
              isActive('/profile') ? 'bg-green-50 text-green-800' : 'text-gray-700'
            }`}
          >
            <User size={20} />
            <span>Profile & Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 