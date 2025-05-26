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
      label: 'Yeni Başvurular',
      icon: <ShoppingBag size={20} />,
      component: <NewGarageSubmissionsTab />
    },
    {
      id: 'comments',
      label: 'Yorumlar',
      icon: <MessageSquare size={20} />,
      component: <CommentModerationTab />
    },
    {
      id: 'users',
      label: 'Kullanıcılar',
      icon: <Users size={20} />,
      component: <UserManagementTab />
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: <Settings size={20} />,
      component: <SettingsTab />
    },
    {
      id: 'feedback',
      label: 'Geri Bildirim',
      icon: <MessageCircle size={20} />,
      component: <FeedbackTab />
    },
    {
      id: 'analytics',
      label: 'Analitik',
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
        <div className="lg:hidden px-4">
          <div className="grid grid-cols-7 gap-1 bg-secondary-50/50 rounded-xl p-1.5 relative overflow-hidden">
            {/* Active Tab Background Indicator */}
            <div 
              className="absolute bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out"
              style={{
                width: `calc((100% - 6px * 6) / 7)`, // Total width minus gaps divided by number of columns
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
                {tab.icon}
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
        
        {/* Content Area */}
        <div className="lg:col-span-4 px-4 lg:px-0">
          <div className="min-h-[calc(100vh-200px)]">
            {/* Active Tab Label - Mobile Only */}
            <div className="lg:hidden mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                {activeTabData?.label}
              </h2>
            </div>
            
            {activeTabData?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;