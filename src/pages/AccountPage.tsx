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
          <div className="flex bg-secondary-100 rounded-xl p-2 relative">
            {/* Active Tab Background Indicator */}
            <div 
              className="absolute bg-white rounded-lg shadow-md transition-all duration-300 ease-out"
              style={{
                width: 'calc(20% - 4px)',
                height: '40px',
                transform: `translateX(calc(${tabConfig.findIndex(tab => tab.id === activeTab)} * 100% + 4px))`,
                top: '8px'
              }}
            />
            {tabConfig.map((tab, index) => (
              <button
                key={tab.id}
                className={`flex-1 h-10 flex items-center justify-center rounded-lg relative z-10 transition-all duration-300 ease-out ${
                  activeTab === tab.id 
                    ? 'text-primary-700 scale-105 font-medium' 
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-white/50'
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
            
            <div className="p-2 relative bg-secondary-100 m-2 rounded-xl">
              {/* Active Tab Background Indicator */}
              <div 
                className="absolute bg-white rounded-lg shadow-md transition-all duration-300 ease-out"
                style={{
                  left: '8px',
                  right: '8px',
                  height: '46px',
                  transform: `translateY(calc(${tabConfig.findIndex(tab => tab.id === activeTab)} * 50px + 2px))`,
                  top: '8px'
                }}
              />
              <div className="flex flex-col space-y-1 relative z-10">
                {tabConfig.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`w-full text-left h-[46px] px-4 rounded-lg transition-all duration-300 ease-out flex items-center gap-3 ${
                      activeTab === tab.id 
                        ? 'text-primary-700 font-medium' 
                        : 'text-secondary-600 hover:text-primary-600 hover:bg-white/50'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className={`transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-primary-600 scale-110' 
                        : 'text-secondary-500'
                    }`}>
                      {tab.icon}
                    </span>
                    <span className="transition-colors duration-300">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="card min-h-[calc(100vh-300px)]">
            {/* Active Tab Label */}
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary-600">{activeTabData?.icon}</span>
                {activeTabData?.label}
              </h2>
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