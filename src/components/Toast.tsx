import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

const Toast: React.FC = () => {
  const { toast, hideToast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (toast.visible) {
      setIsLeaving(false);
    }
  }, [toast.visible]);

  useEffect(() => {
    if (toast.visible && !toast.isModal) {
      const timer = setTimeout(() => {
        handleHideToast();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.visible, toast.isModal]);

  const handleHideToast = () => {
    setIsLeaving(true);
    
    // Wait for animation to complete before actually hiding
    setTimeout(() => {
      hideToast();
      setIsLeaving(false);
    }, 300);
  };

  if (!toast.visible) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="text-success-500" size={20} />;
      case 'error':
        return <XCircle className="text-error-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-warning-500" size={20} />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-50 border-success-500';
      case 'error':
        return 'bg-error-50 border-error-500';
      case 'warning':
        return 'bg-warning-50 border-warning-500';
      default:
        return 'bg-white border-secondary-300';
    }
  };

  // Modal Toast for success messages
  if (toast.isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleHideToast} />
        <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-success-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              {toast.title || 'Success!'}
            </h3>
            <p className="text-secondary-600 mb-6">
              {toast.message}
            </p>
            <button
              onClick={handleHideToast}
              className="btn btn-primary w-full"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Toast - positioned at the top center with smooth animations
  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div 
        className={`
          p-4 rounded-lg shadow-lg border-l-4 ${getBgColor()} 
          max-w-xs md:max-w-sm flex gap-3 items-center
          transform transition-all duration-300 ease-in-out pointer-events-auto
          ${isLeaving ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}
        `}
        style={{ 
          transitionProperty: 'opacity, transform',
          transformOrigin: 'top center'
        }}
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 mr-2">
          <p className="text-secondary-800 font-medium">{toast.message}</p>
        </div>
        <button 
          onClick={handleHideToast}
          className="text-secondary-500 hover:text-secondary-700 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;