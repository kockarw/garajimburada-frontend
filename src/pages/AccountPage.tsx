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
        <div className="lg:col-span-1">
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
            
            <div className="p-2">
              {tabConfig.map(tab => (
                <button
                  key={tab.id}
                  className={`w-full text-left px-4 py-3 rounded-md mb-1 transition-colors flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'hover:bg-secondary-50 text-secondary-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="card min-h-[calc(100vh-300px)]">
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