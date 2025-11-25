import React from 'react';
import { Building2, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';
import ProfileAvatar from '../common/ProfileAvatar';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">PropertyHub</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ProfileAvatar 
                  user={{
                    name: user?.name || '',
                    profileImage: user?.profileImage,
                    role: user?.role
                  }}
                  size="md"
                  showBorder
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className={`text-xs capitalize font-medium ${user?.role === 'admin' ? 'text-purple-600' : 'text-gray-500'}`}>
                    {user?.role === 'admin' ? '👑 Administrator' : user?.role}
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;