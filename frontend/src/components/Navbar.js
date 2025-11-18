'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, removeToken } from '@/lib/auth';
import { copyToClipboard } from '@/utils/api-helpers';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => setUser(getUser()), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-dropdown')) setIsDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const MenuItem = ({ onClick, icon, text, bordered = false, textColor = 'text-gray-700' }) => (
    <button onClick={onClick} className={`w-full text-left px-4 py-2 text-sm ${textColor} hover:bg-gray-100 flex items-center ${bordered ? 'border-t border-gray-200' : ''}`}>
      {icon}{text}
    </button>
  );

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-white font-bold text-xl"><a href="/dashboard">ProjectHub</a></div>
          
          <div className="relative profile-dropdown">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 text-white hover:bg-gray-800 px-3 py-2 rounded-md">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                {user?.email?.[0].toUpperCase() || '?'}
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'Loading...'}</p>
                    <button onClick={() => copyToClipboard(user?.email, 'Email copied to clipboard!')} className="text-gray-400 hover:text-gray-600 flex-shrink-0" title="Copy email">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  {user?.role && <span className="inline-block mt-1 px-2 py-1 bg-black text-white text-xs rounded">{user.role}</span>}
                </div>
                <MenuItem
                  onClick={() => copyToClipboard(user?.id, 'User UUID copied to clipboard!')}
                  bordered
                  icon={
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  }
                  text="Copy User UUID"
                />

                {user?.client?.id && user?.role === 'admin' && <MenuItem onClick={() => copyToClipboard(user.client.id, 'Company UUID copied to clipboard!')} icon={
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    }
                    text="Copy Company UUID" />}
                <MenuItem
                  onClick={handleLogout}
                  bordered
                  textColor="text-red-700"
                  icon={
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                  text="Logout"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
