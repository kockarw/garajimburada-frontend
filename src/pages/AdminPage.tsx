import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, MessageSquare, Users, Settings, BarChart, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Import Tab Components
import {
  GarageListingsTab,
  NewGarageSubmissionsTab,
  CommentModerationTab,
  UserManagementTab,
  SettingsTab,
  FeedbackTab,
  AnalyticsTab
} from './admin/tabs';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('garage-listings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // For authorized/admin users only
  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }

  const tabConfig = [
    {
      id: 'garage-listings',
      label: 'Garage Listings',
      icon: <LayoutDashboard size={18} />,
      component: <GarageListingsTab />
    },
    {
      id: 'new-submissions',
      label: 'New Submissions',
      icon: <ShoppingBag size={18} />,
      component: <NewGarageSubmissionsTab />
    },
    {
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare size={18} />,
      component: <CommentModerationTab />
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users size={18} />,
      component: <UserManagementTab />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={18} />,
      component: <SettingsTab />
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: <MessageCircle size={18} />,
      component: <FeedbackTab />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart size={18} />,
      component: <AnalyticsTab />
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
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="p-4 border-b border-secondary-200">
              <h2 className="text-lg font-semibold">Dashboard</h2>
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
        
        <div className="lg:col-span-4">
          <div className="min-h-[calc(100vh-200px)]">
            {activeTabData?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;