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
      label: 'Garaj İlanları',
      icon: <LayoutDashboard size={20} />,
      component: <GarageListingsTab />
    },
    {
      id: 'new-submissions',
      label: 'New Submissions',
      icon: <ShoppingBag size={20} />,
      component: <NewGarageSubmissionsTab />
    },
    {
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare size={20} />,
      component: <CommentModerationTab />
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users size={20} />,
      component: <UserManagementTab />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      component: <SettingsTab />
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: <MessageCircle size={20} />,
      component: <FeedbackTab />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart size={20} />,
      component: <AnalyticsTab />
    }
  ];

  const activeTabData = tabConfig.find(tab => tab.id === activeTab);

  if (loading) {
    return (
      <div className="container py-8 md:py-16 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 px-4 md:px-0">Admin Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8">
        {/* Mobile Tab List - Horizontal Icons */}
        <div className="lg:hidden px-4 mb-6">
          <div className="flex bg-secondary-100 rounded-xl p-2 relative">
            {/* Active Tab Background Indicator */}
            <div 
              className="absolute bg-white rounded-lg shadow-md transition-all duration-300 ease-out"
              style={{
                width: 'calc((100% - 24px) / 7)', // (container width - (6 gaps * 4px)) / 7 items
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
              <h2 className="text-lg font-semibold">Dashboard</h2>
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
        
        {/* Content Area */}
        <div className="lg:col-span-4 px-4 lg:px-0">
          <div className="card min-h-[calc(100vh-200px)]">
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

export default AdminPage;