import React, { useState, useEffect } from 'react';
import { Calendar, Clock, LogIn, LogOut, Settings, Map, Plus, Trash, FileText } from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'profile_update' | 'garage_create' | 'garage_delete' | 'review' | 'location' | 'payment';
  description: string;
  date: string;
  ip?: string;
  device?: string;
  location?: string;
}

const ActivityTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  useEffect(() => {
    const fetchActivityLogs = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock activity logs
        const mockLogs: ActivityLog[] = [
          {
            id: '1',
            type: 'login',
            description: 'You logged in to your account',
            date: '2023-10-25T14:30:00Z',
            ip: '192.168.1.1',
            device: 'Chrome 117.0 on Windows',
            location: 'Istanbul, Turkey'
          },
          {
            id: '2',
            type: 'garage_create',
            description: 'You created a new garage listing "Turbo Force"',
            date: '2023-10-24T10:15:00Z'
          },
          {
            id: '3',
            type: 'profile_update',
            description: 'You updated your profile information',
            date: '2023-10-23T16:45:00Z'
          },
          {
            id: '4',
            type: 'review',
            description: 'You left a review for "Euro Specialists"',
            date: '2023-10-22T09:30:00Z'
          },
          {
            id: '5',
            type: 'login',
            description: 'You logged in to your account',
            date: '2023-10-21T20:10:00Z',
            ip: '192.168.1.2',
            device: 'Mobile App on iOS 16',
            location: 'Ankara, Turkey'
          },
          {
            id: '6',
            type: 'payment',
            description: 'You upgraded to Premium plan',
            date: '2023-10-20T11:30:00Z'
          },
          {
            id: '7',
            type: 'garage_delete',
            description: 'You deleted garage listing "Old Shop"',
            date: '2023-10-19T15:45:00Z'
          },
          {
            id: '8',
            type: 'location',
            description: 'Your account location was updated',
            date: '2023-10-18T08:20:00Z',
            location: 'Istanbul, Turkey'
          },
          {
            id: '9',
            type: 'logout',
            description: 'You logged out from your account',
            date: '2023-10-17T22:05:00Z',
            device: 'Chrome 116.0 on Windows'
          },
          {
            id: '10',
            type: 'login',
            description: 'You logged in to your account',
            date: '2023-10-17T14:30:00Z',
            ip: '192.168.1.1',
            device: 'Chrome 116.0 on Windows',
            location: 'Istanbul, Turkey'
          }
        ];
        
        setActivityLogs(mockLogs);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityLogs();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login':
        return <LogIn size={16} className="text-success-600" />;
      case 'logout':
        return <LogOut size={16} className="text-secondary-600" />;
      case 'profile_update':
        return <Settings size={16} className="text-primary-600" />;
      case 'garage_create':
        return <Plus size={16} className="text-success-600" />;
      case 'garage_delete':
        return <Trash size={16} className="text-error-600" />;
      case 'review':
        return <FileText size={16} className="text-warning-600" />;
      case 'location':
        return <Map size={16} className="text-primary-600" />;
      case 'payment':
        return <Calendar size={16} className="text-accent-600" />;
      default:
        return <Clock size={16} className="text-secondary-600" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-secondary-600 mb-6">
        Track your account activity and security events over time.
      </p>
      
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="p-3 border-b border-secondary-200 bg-secondary-50">
          <div className="grid grid-cols-12 text-sm font-medium text-secondary-700">
            <div className="col-span-5">Activity</div>
            <div className="col-span-3">Date & Time</div>
            <div className="col-span-2">Device</div>
            <div className="col-span-2">Location</div>
          </div>
        </div>
        
        <div className="divide-y divide-secondary-100">
          {activityLogs.map(log => (
            <div key={log.id} className="p-3 hover:bg-secondary-50">
              <div className="grid grid-cols-12 text-sm">
                <div className="col-span-5 flex items-start gap-2">
                  <div className="mt-0.5">
                    {getActivityIcon(log.type)}
                  </div>
                  <div>
                    <p className="text-secondary-900">{log.description}</p>
                    {log.ip && (
                      <p className="text-xs text-secondary-500 mt-0.5">
                        IP: {log.ip}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-3 text-secondary-600">
                  {formatDate(log.date)}
                </div>
                <div className="col-span-2 text-secondary-600">
                  {log.device || '-'}
                </div>
                <div className="col-span-2 text-secondary-600">
                  {log.location || '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {activityLogs.length > 10 && (
        <div className="flex justify-center mt-6">
          <button className="btn btn-secondary">
            View More Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTab; 