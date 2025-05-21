import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Settings, Globe, Moon, Sun, Eye } from 'lucide-react';

const PreferencesTab: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    emailsInEnglish: true
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the preferences to your backend
      console.log('Saving preferences:', preferences);
      
      showToast('Preferences saved successfully', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Failed to save preferences', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <p className="text-secondary-600 mb-6">
        Customize your experience with GarajımBurada. Set your preferences for language, theme, and more.
      </p>
      
      <div className="space-y-8 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Globe size={18} />
            <span>Language & Region</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="language">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={preferences.language}
                onChange={handleInputChange}
                className="input w-full max-w-xs"
              >
                <option value="en">English</option>
                <option value="tr">Turkish</option>
                <option value="de">German</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="emailsInEnglish"
                name="emailsInEnglish"
                type="checkbox"
                checked={preferences.emailsInEnglish}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-secondary-300"
              />
              <label htmlFor="emailsInEnglish" className="ml-2 block text-sm text-secondary-700">
                Always send emails in English regardless of site language
              </label>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-200 pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Eye size={18} />
            <span>Display Preferences</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Theme
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={preferences.theme === 'light'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <Sun size={16} className="text-warning-600" />
                  <span className="text-sm text-secondary-700">Light</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={preferences.theme === 'dark'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <Moon size={16} className="text-secondary-700" />
                  <span className="text-sm text-secondary-700">Dark</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={preferences.theme === 'system'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <Settings size={16} className="text-primary-600" />
                  <span className="text-sm text-secondary-700">System</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-secondary-200 pt-6">
        <button 
          className="btn btn-primary"
          onClick={handleSavePreferences}
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

export default PreferencesTab; 