import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Key, Clock, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Import Tab Components
import {
  ProfileTab,
  SecurityTab,
  NotificationsTab,
  ActivityTab,
  PreferencesTab
} from './account-tabs';

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // For authenticated users only
  if (!user) {
    return <Navigate to="/login" />;
  }

  const tabConfig = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: <User size={18} />,
      component: <ProfileTab />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Key size={18} />,
      component: <SecurityTab />
    },
    {
      id: 'activity',
      label: 'Account Activity',
      icon: <Clock size={18} />,
      component: <ActivityTab />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={18} />,
      component: <NotificationsTab />
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <Shield size={18} />,
      component: <PreferencesTab />
    }
  ];

  const activeTabData = tabConfig.find(tab => tab.id === activeTab);

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">My Account</h1>
      <p className="text-secondary-600 mb-8">Manage your account information and settings</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Tab List - Horizontal Icons */}
        <div className="lg:hidden px-4 mb-6">
          <div className="grid grid-cols-5 gap-1 bg-secondary-50/50 rounded-xl p-1.5 relative overflow-hidden">
            {/* Active Tab Background Indicator */}
            <div 
              className="absolute bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out"
              style={{
                width: `calc((100% - 6px * 4) / 5)`, // Total width minus gaps divided by number of columns
                aspectRatio: '1',
                transform: `translateX(calc(${tabConfig.findIndex(tab => tab.id === activeTab)} * (100% + 6px)))`,
                top: '6px',
                left: '6px'
              }}
            />
            {tabConfig.map((tab, index) => (
              <button
                key={tab.id}
                className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-300 ease-out relative z-10 ${
                  activeTab === tab.id 
                    ? 'text-primary-600 scale-105' 
                    : 'text-secondary-600 hover:text-primary-500'
                }`}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
              >
                <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tab List - Vertical with Labels */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="card sticky top-24">
            <div className="p-4 border-b border-secondary-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold">{user.username}</h2>
                  <p className="text-sm text-secondary-500">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2 relative">
              {/* Active Tab Background Indicator */}
              <div 
                className="absolute left-2 right-2 bg-primary-50 rounded-md transition-transform duration-300 ease-out"
                style={{
                  height: '46px',
                  transform: `translateY(${tabConfig.findIndex(tab => tab.id === activeTab) * (46 + 4)}px)`, // height + margin-bottom
                  top: '8px' // p-2 = 8px
                }}
              />
              {tabConfig.map((tab, index) => (
                <button
                  key={tab.id}
                  className={`w-full text-left px-4 py-3 rounded-md mb-1 transition-all duration-300 ease-out flex items-center gap-3 relative z-10 ${
                    activeTab === tab.id 
                      ? 'text-primary-600 transform scale-[1.02]' 
                      : 'text-secondary-700 hover:text-primary-500'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </span>
                  <span className="transition-colors duration-300">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="card min-h-[calc(100vh-300px)]">
            {/* Active Tab Label - Mobile Only */}
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold">{activeTabData?.label}</h2>
            </div>
            <div className="p-6">
              {activeTabData?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 