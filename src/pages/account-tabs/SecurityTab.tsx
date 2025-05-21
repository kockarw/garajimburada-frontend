import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Eye, EyeOff, Key, Lock, ShieldCheck } from 'lucide-react';

const SecurityTab: React.FC = () => {
  const { showToast } = useToast();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the password update request to your backend
      console.log('Updating password with:', passwordForm);
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showToast('Password updated successfully', 'success');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <p className="text-secondary-600 mb-6">
        Manage your password and account security settings.
      </p>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="currentPassword">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handleInputChange}
                  className="input w-full pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => togglePasswordVisibility('current')}
                  tabIndex={-1}
                >
                  {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handleInputChange}
                  className="input w-full pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => togglePasswordVisibility('new')}
                  tabIndex={-1}
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handleInputChange}
                  className="input w-full pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={() => togglePasswordVisibility('confirm')}
                  tabIndex={-1}
                >
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Updating...</span>
              </>
            ) : 'Update Password'}
          </button>
        </form>
      </div>
      
      <div className="border-t border-secondary-200 pt-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="bg-secondary-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <ShieldCheck className="text-primary-600" size={20} />
            </div>
            <div>
              <h4 className="font-medium">Enhance your account security</h4>
              <p className="text-sm text-secondary-600 mt-1">
                Two-factor authentication adds an extra layer of security to your account. 
                In addition to your password, you'll need to enter a code that we send to your phone.
              </p>
            </div>
          </div>
        </div>
        <button className="btn btn-secondary flex items-center gap-2">
          <Lock size={16} />
          <span>Enable Two-Factor Authentication</span>
        </button>
      </div>
      
      <div className="border-t border-secondary-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
        <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
          <div className="p-4 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Current Session</h4>
                <p className="text-sm text-secondary-500 mt-1">
                  Windows • Chrome • Istanbul, Turkey
                </p>
              </div>
              <div className="bg-success-100 text-success-800 text-xs font-medium px-2 py-1 rounded-full">
                Active Now
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mobile App</h4>
                <p className="text-sm text-secondary-500 mt-1">
                  iOS • GarajımBurada App • Last active 2 hours ago
                </p>
              </div>
              <button className="text-error-600 text-sm hover:text-error-800">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab; 