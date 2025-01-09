import { LayoutDashboard, Users, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed w-64 h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-green-800 dark:text-green-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="4" fill="currentColor"/>
            <circle cx="8" cy="8" r="3" fill="currentColor"/>
            <circle cx="24" cy="8" r="3" fill="currentColor"/>
            <circle cx="24" cy="24" r="3" fill="currentColor"/>
            <circle cx="8" cy="24" r="3" fill="currentColor"/>
            <line x1="11.5" y1="11.5" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="18.5" y1="13.5" x2="20.5" y2="11.5" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="18.5" y1="18.5" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="11.5" y1="20.5" x2="13.5" y2="18.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alumni Connect</h2>
        </div>
      </div>
      <nav className="flex flex-col h-[calc(100%-72px)]">
        <div className="p-4 flex-1">
          <div className="mb-2 px-2">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Main Menu</span>
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                to="/feed"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                  isActive('/feed')
                    ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <LayoutDashboard size={18} className="flex-shrink-0" />
                <span>Feed</span>
              </Link>
            </li>
            <li>
              <Link
                to="/directory"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                  isActive('/directory')
                    ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Users size={18} className="flex-shrink-0" />
                <span>Directory</span>
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                  isActive('/messages')
                    ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <MessageCircle size={18} className="flex-shrink-0" />
                <span>Messages</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Link
            to="/profile"
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
              isActive('/profile')
                ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100 font-medium shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <User size={18} className="flex-shrink-0" />
            <span>Profile & Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 