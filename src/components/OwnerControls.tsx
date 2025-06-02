import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Clock } from 'lucide-react';

interface OwnerControlsProps {
  garageId: string;
}

interface FloatingMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

const OwnerControls: React.FC<OwnerControlsProps> = ({ garageId }) => {
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

  return (
    <div className="fixed right-4 top-[120px] z-40 hidden lg:block">
      <button
        onClick={handleFloatingMenuClick}
        className="bg-primary-600 shadow-lg rounded-lg px-2 py-4 hover:bg-primary-700 transition-colors"
      >
        <div className="vertical-text font-medium text-white [writing-mode:vertical-lr] transform rotate-180">
          Owner Controls
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
          <Link 
            to={`/edit-garage/${garageId}`}
            className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center gap-2 w-full"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Link>
          
          <button 
            className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center gap-2 w-full"
          >
            <Trash size={16} />
            <span>Takedown</span>
          </button>

          <button 
            className="px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center gap-2 w-full"
          >
            <Clock size={16} />
            <span>Refresh Date</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerControls; 