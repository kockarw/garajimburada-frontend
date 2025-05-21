import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Bell, MessageSquare, Mail, Phone } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const NotificationsTab: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'garage_updates',
      title: 'Garage Updates',
      description: 'Get notified when there are updates to your garage listings',
      channels: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Get notified when you receive a new message',
      channels: {
        email: true,
        push: true,
        sms: true
      }
    },
    {
      id: 'reviews',
      title: 'Reviews',
      description: 'Get notified when someone leaves a review for your garage',
      channels: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 'promotions',
      title: 'Promotions',
      description: 'Get notified about promotions and special offers',
      channels: {
        email: false,
        push: false,
        sms: false
      }
    },
    {
      id: 'system',
      title: 'System Notifications',
      description: 'Get notified about important system updates',
      channels: {
        email: true,
        push: false,
        sms: false
      }
    }
  ]);
  
  const handleToggleChannel = (settingId: string, channel: 'email' | 'push' | 'sms') => {
    const updatedSettings = notificationSettings.map(setting => {
      if (setting.id === settingId) {
        return {
          ...setting,
          channels: {
            ...setting.channels,
            [channel]: !setting.channels[channel]
          }
        };
      }
      return setting;
    });
    
    setNotificationSettings(updatedSettings);
  };
  
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the notification settings to your backend
      console.log('Saving notification settings:', notificationSettings);
      
      showToast('Notification preferences saved successfully', 'success');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      showToast('Failed to save notification preferences', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <p className="text-secondary-600 mb-6">
        Manage how you receive notifications. You can turn on/off notifications for each channel.
      </p>
      
      <div className="mb-6">
        <div className="flex items-center justify-between py-3 border-b border-secondary-200">
          <div></div>
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center w-14">
              <Mail size={18} className="text-secondary-500" />
            </div>
            <div className="flex items-center justify-center w-14">
              <Bell size={18} className="text-secondary-500" />
            </div>
            <div className="flex items-center justify-center w-14">
              <Phone size={18} className="text-secondary-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-secondary-200 text-sm">
          <div></div>
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center w-14 text-secondary-500">
              Email
            </div>
            <div className="flex items-center justify-center w-14 text-secondary-500">
              Push
            </div>
            <div className="flex items-center justify-center w-14 text-secondary-500">
              SMS
            </div>
          </div>
        </div>
        
        {notificationSettings.map(setting => (
          <div key={setting.id} className="flex items-center justify-between py-4 border-b border-secondary-200">
            <div>
              <h4 className="font-medium">{setting.title}</h4>
              <p className="text-sm text-secondary-500 mt-1">{setting.description}</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center justify-center w-14">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={setting.channels.email}
                    onChange={() => handleToggleChannel(setting.id, 'email')}
                  />
                  <div className="w-9 h-5 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-center w-14">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={setting.channels.push}
                    onChange={() => handleToggleChannel(setting.id, 'push')}
                  />
                  <div className="w-9 h-5 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-center w-14">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={setting.channels.sms}
                    onChange={() => handleToggleChannel(setting.id, 'sms')}
                  />
                  <div className="w-9 h-5 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-secondary-200 pt-6">
        <button 
          className="btn btn-primary"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              <span>Saving...</span>
            </>
          ) : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab; 