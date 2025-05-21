import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { User, Upload } from 'lucide-react';

const ProfileTab: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the updated profile data to your backend
      console.log('Updating profile with:', formData);
      
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <p className="text-secondary-600 mb-6">
        Update your personal information and how others see you on the platform.
      </p>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-3xl">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <button 
              className="btn btn-secondary flex items-center gap-2 mb-2"
              disabled={loading}
            >
              <Upload size={16} />
              <span>Upload New Picture</span>
            </button>
            <p className="text-sm text-secondary-500">
              JPG, PNG or GIF. Maximum size 2MB.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="username">
              Name
              /
              Surname
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="+90 (___) ___ ____"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="bio">
            About
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="input w-full"
            placeholder="Write a short bio about yourself..."
          ></textarea>
          <p className="text-xs text-secondary-500 mt-1">
            Brief description for your profile. This will be displayed publicly.
          </p>
        </div>
        
        <div className="border-t border-secondary-200 pt-6">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Saving...</span>
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab; 