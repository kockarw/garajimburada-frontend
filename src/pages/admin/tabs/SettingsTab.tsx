import React, { useState } from 'react';
import { Save, Image, Mail, AlertCircle } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

interface SiteSettings {
  site_name: string;
  site_logo: string;
  contact_email: string;
  footer_text: string;
  maintenance_mode: boolean;
  maintenance_message: string;
}

interface EmailSettings {
  notification_email: string;
  send_approval_emails: boolean;
  send_rejection_emails: boolean;
  send_weekly_summary: boolean;
  email_footer_text: string;
}

const SettingsTab: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'email' | 'maintenance'>('general');
  
  // General site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'GarajımBurada',
    site_logo: 'https://example.com/logo.png',
    contact_email: 'info@garajimburada.com',
    footer_text: '© {year} GarajımBurada. Tüm hakları saklıdır.',
    maintenance_mode: false,
    maintenance_message: 'Site bakım modundadır. Lütfen daha sonra tekrar deneyiniz.'
  });
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    notification_email: 'notifications@garajimburada.com',
    send_approval_emails: true,
    send_rejection_emails: true,
    send_weekly_summary: false,
    email_footer_text: 'GarajımBurada - Türkiye\'nin en iyi garaj bulma platformu'
  });
  
  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteSettings({
      ...siteSettings,
      [name]: value
    });
  };
  
  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setEmailSettings({
      ...emailSettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  const handleToggleMaintenance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteSettings({
      ...siteSettings,
      maintenance_mode: e.target.checked
    });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      showToast('Settings saved successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">Site Settings</h2>
      </div>
      
      <div className="p-4">
        <div className="flex border-b border-secondary-200 mb-6">
          <button
            className={`py-2 px-4 font-medium border-b-2 ${
              activeSection === 'general'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-600 hover:text-secondary-900'
            }`}
            onClick={() => setActiveSection('general')}
          >
            General
          </button>
          <button
            className={`py-2 px-4 font-medium border-b-2 ${
              activeSection === 'email'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-600 hover:text-secondary-900'
            }`}
            onClick={() => setActiveSection('email')}
          >
            Email
          </button>
          <button
            className={`py-2 px-4 font-medium border-b-2 ${
              activeSection === 'maintenance'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-600 hover:text-secondary-900'
            }`}
            onClick={() => setActiveSection('maintenance')}
          >
            Maintenance
          </button>
        </div>
        
        {activeSection === 'general' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="site_name" className="block text-sm font-medium text-secondary-700 mb-1">
                Site Name
              </label>
              <input
                id="site_name"
                name="site_name"
                type="text"
                value={siteSettings.site_name}
                onChange={handleSiteSettingsChange}
                className="input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="site_logo" className="block text-sm font-medium text-secondary-700 mb-1">
                Site Logo URL
              </label>
              <div className="flex gap-2">
                <input
                  id="site_logo"
                  name="site_logo"
                  type="text"
                  value={siteSettings.site_logo}
                  onChange={handleSiteSettingsChange}
                  className="input w-full"
                />
                <button className="btn btn-secondary px-3">
                  <Image size={16} />
                </button>
              </div>
              {siteSettings.site_logo && (
                <div className="mt-2 p-2 border border-secondary-200 rounded-md inline-block">
                  <img 
                    src={siteSettings.site_logo} 
                    alt="Site Logo Preview" 
                    className="h-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x50?text=Logo+Preview';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-secondary-700 mb-1">
                Contact Email
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={siteSettings.contact_email}
                onChange={handleSiteSettingsChange}
                className="input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="footer_text" className="block text-sm font-medium text-secondary-700 mb-1">
                Footer Text
              </label>
              <textarea
                id="footer_text"
                name="footer_text"
                value={siteSettings.footer_text}
                onChange={handleSiteSettingsChange}
                className="input w-full"
                rows={2}
              ></textarea>
              <p className="text-xs text-secondary-500 mt-1">
                Use {'{year}'} to dynamically insert current year.
              </p>
            </div>
          </div>
        )}
        
        {activeSection === 'email' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="notification_email" className="block text-sm font-medium text-secondary-700 mb-1">
                Notification Email
              </label>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-secondary-500" />
                <input
                  id="notification_email"
                  name="notification_email"
                  type="email"
                  value={emailSettings.notification_email}
                  onChange={handleEmailSettingsChange}
                  className="input w-full"
                />
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                Email used for sending automated notifications.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-secondary-700">Email Notifications</h3>
              
              <div className="flex items-center">
                <input
                  id="send_approval_emails"
                  name="send_approval_emails"
                  type="checkbox"
                  checked={emailSettings.send_approval_emails}
                  onChange={handleEmailSettingsChange}
                  className="mr-2"
                />
                <label htmlFor="send_approval_emails" className="text-secondary-700">
                  Send emails when a garage is approved
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="send_rejection_emails"
                  name="send_rejection_emails"
                  type="checkbox"
                  checked={emailSettings.send_rejection_emails}
                  onChange={handleEmailSettingsChange}
                  className="mr-2"
                />
                <label htmlFor="send_rejection_emails" className="text-secondary-700">
                  Send emails when a garage is rejected
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="send_weekly_summary"
                  name="send_weekly_summary"
                  type="checkbox"
                  checked={emailSettings.send_weekly_summary}
                  onChange={handleEmailSettingsChange}
                  className="mr-2"
                />
                <label htmlFor="send_weekly_summary" className="text-secondary-700">
                  Send weekly summary of site activities
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="email_footer_text" className="block text-sm font-medium text-secondary-700 mb-1">
                Email Footer Text
              </label>
              <textarea
                id="email_footer_text"
                name="email_footer_text"
                value={emailSettings.email_footer_text}
                onChange={handleEmailSettingsChange}
                className="input w-full"
                rows={2}
              ></textarea>
            </div>
          </div>
        )}
        
        {activeSection === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-warning-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-secondary-900">Maintenance Mode</h3>
                  <p className="text-secondary-600 text-sm mt-1">
                    When maintenance mode is enabled, the site will be unavailable to regular users. 
                    Only administrators will be able to access the site.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="maintenance_mode"
                name="maintenance_mode"
                type="checkbox"
                checked={siteSettings.maintenance_mode}
                onChange={handleToggleMaintenance}
                className="mr-2"
              />
              <label htmlFor="maintenance_mode" className="font-medium text-secondary-700">
                Enable Maintenance Mode
              </label>
            </div>
            
            {siteSettings.maintenance_mode && (
              <div>
                <label htmlFor="maintenance_message" className="block text-sm font-medium text-secondary-700 mb-1">
                  Maintenance Message
                </label>
                <textarea
                  id="maintenance_message"
                  name="maintenance_message"
                  value={siteSettings.maintenance_message}
                  onChange={handleSiteSettingsChange}
                  className="input w-full"
                  rows={3}
                ></textarea>
                <p className="text-xs text-secondary-500 mt-1">
                  This message will be displayed to users while the site is in maintenance mode.
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-secondary-200">
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 