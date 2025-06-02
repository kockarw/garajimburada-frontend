import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Shield, Check, X } from 'lucide-react';

interface AdminControlsProps {
  garageId: string;
  isVerified: boolean;
  isActive: boolean;
  onToggleVerify: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

interface FloatingMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

const AdminControls: React.FC<AdminControlsProps> = ({ 
  garageId, 
  isVerified, 
  isActive,
  onToggleVerify,
  onToggleActive,
  onDelete
}) => {
  const [floatingMenu, setFloatingMenu] = useState<FloatingMenuState>({
    isOpen: false,
    x: 0,
    y: 0
  });

  const handleFloatingMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setFloatingMenu(prev => ({
      isOpen: !prev.isOpen,
      x: rect.x,
      y: rect.bottom
    }));
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setFloatingMenu(prev => ({ ...prev, isOpen: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Mobile Card View
  const MobileCard = () => (
    <div className="card border border-secondary-200 p-4 mb-6 lg:hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#dc2626] flex items-center gap-2">
          <Shield size={18} />
          <span>Admin Controls</span>
        </h2>
        <div className="flex items-center gap-1">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-success-100 text-success-800' 
              : 'bg-error-100 text-error-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isVerified 
              ? 'bg-primary-100 text-primary-800' 
              : 'bg-secondary-100 text-secondary-800'
          }`}>
            {isVerified ? 'Verified' : 'Unverified'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <Link 
          to={`/edit-garage/${garageId}`}
          className="btn btn-primary btn-sm flex items-center justify-center gap-1"
        >
          <Edit size={16} />
          <span>Edit</span>
        </Link>
        <button
          onClick={onToggleVerify}
          className={`btn btn-sm flex items-center justify-center gap-1 ${
            isVerified 
              ? 'btn-secondary' 
              : 'btn-primary'
          }`}
        >
          <Shield size={16} />
          <span>{isVerified ? 'Unverify' : 'Verify'}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onToggleActive}
          className={`btn btn-sm flex items-center justify-center gap-1 ${
            isActive 
              ? 'btn-error' 
              : 'btn-success'
          }`}
        >
          {isActive ? <X size={16} /> : <Check size={16} />}
          <span>{isActive ? 'Deactivate' : 'Activate'}</span>
        </button>
        <button
          onClick={onDelete}
          className="btn btn-error btn-sm flex items-center justify-center gap-1"
        >
          <Trash size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );

  // Desktop Floating Menu
  const DesktopMenu = () => (
    <div className="fixed right-4 top-[180px] z-40 hidden lg:block">
      <button
        onClick={handleFloatingMenuClick}
        className="bg-[#dc2626] shadow-lg rounded-lg px-2 py-4 hover:bg-[#b91c1c] transition-colors"
      >
        <div className="vertical-text font-medium text-white [writing-mode:vertical-lr] transform rotate-180">
          Admin Controls
        </div>
      </button>
      
      <div 
        className={`absolute right-12 top-0 bg-white rounded-lg shadow-xl border border-secondary-200 py-2 min-w-[200px]
          transform transition-all duration-300 ease-in-out origin-right
          ${floatingMenu.isOpen 
            ? 'opacity-100 scale-x-100' 
            : 'opacity-0 scale-x-0 pointer-events-none'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="py-1">
          <div className="px-4 py-2 border-b border-secondary-100">
            <div className="flex items-center gap-1 justify-end">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-error-100 text-error-800'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isVerified 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-secondary-100 text-secondary-800'
              }`}>
                {isVerified ? 'Verified' : 'Unverified'}
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link 
              to={`/edit-garage/${garageId}`}
              className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center gap-2 w-full"
            >
              <Edit size={16} />
              <span>Edit</span>
            </Link>
            
            <button 
              onClick={onToggleVerify}
              className={`px-4 py-2 text-sm hover:bg-secondary-50 flex items-center gap-2 w-full ${
                isVerified 
                  ? 'text-secondary-700' 
                  : 'text-primary-700'
              }`}
            >
              <Shield size={16} />
              <span>{isVerified ? 'Remove Verification' : 'Verify'}</span>
            </button>

            <button 
              onClick={onToggleActive}
              className={`px-4 py-2 text-sm hover:bg-secondary-50 flex items-center gap-2 w-full ${
                isActive 
                  ? 'text-error-700' 
                  : 'text-success-700'
              }`}
            >
              {isActive ? <X size={16} /> : <Check size={16} />}
              <span>{isActive ? 'Deactivate' : 'Activate'}</span>
            </button>

            <button 
              onClick={onDelete}
              className="px-4 py-2 text-sm text-error-700 hover:bg-secondary-50 flex items-center gap-2 w-full"
            >
              <Trash size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileCard />
      <DesktopMenu />
    </>
  );
};

export default AdminControls; 