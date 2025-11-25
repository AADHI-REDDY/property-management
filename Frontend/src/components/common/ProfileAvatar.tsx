import React from 'react';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  user: {
    name: string;
    profileImage?: string;
    role?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  user, 
  size = 'md', 
  showBorder = false,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'md': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-8 h-8';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      case 'xl': return 'w-8 h-8';
      default: return 'w-4 h-4';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-600';
      case 'landlord':
        return 'bg-blue-100 text-blue-600';
      case 'tenant':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const borderClass = showBorder ? 'border-2 border-gray-200' : '';

  return (
    <div className={`${getSizeClasses()} rounded-full flex items-center justify-center overflow-hidden ${borderClass} ${className}`}>
      {user.profileImage ? (
        <img 
          src={user.profileImage} 
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show default avatar
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full flex items-center justify-center ${getRoleColor(user.role)}">
                  <svg class="${getIconSize()}" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              `;
            }
          }}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${getRoleColor(user.role)}`}>
          <User className={getIconSize()} />
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;