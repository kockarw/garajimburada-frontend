import React from 'react';
import { Building2, Globe, Phone, Mail } from 'lucide-react';
import { GarageFormData } from '../../types/garage';

interface GeneralInfoStepProps {
  formData: GarageFormData;
  setFormData: React.Dispatch<React.SetStateAction<GarageFormData>>;
  getInputError: (field: string) => string;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ formData, setFormData, getInputError }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters except +
    value = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +90
    if (!value.startsWith('+90')) {
      value = '+90' + value.replace('+', '');
    }
    
    // Limit the total length to 13 (+90 + 10 digits)
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setFormData((prev: any) => ({
      ...prev,
      phone: value
    }));
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!formData.phone) {
      setFormData((prev: any) => ({
        ...prev,
        phone: '+90'
      }));
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">General Information</h2>
        <p className="text-secondary-600 mb-6">
          Please provide the basic information about your garage.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
            Garage Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 size={18} className="text-secondary-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={32}
              className={`input pl-10 ${getInputError('name') ? 'border-error-500 focus:border-error-500' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter garage name"
              required
            />
          </div>
          {getInputError('name') && (
            <p className="mt-1 text-sm text-error-500">{getInputError('name')}</p>
          )}
          <p className="mt-1 text-sm text-secondary-500">
            {formData.name.length}/32 characters
          </p>
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-medium text-secondary-700 mb-1">
            About Garage *
          </label>
          <textarea
            id="about"
            name="about"
            rows={4}
            className="input"
            value={formData.about}
            onChange={handleChange}
            placeholder="Describe your garage and services"
            required
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-secondary-700 mb-1">
            Website
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe size={18} className="text-secondary-400" />
            </div>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="input pl-10"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-secondary-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              onKeyDown={handlePhoneKeyDown}
              className="input pl-10"
              placeholder="+90 (___) ___ ____"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-secondary-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input pl-10 ${getInputError('email') ? 'border-error-500 focus:border-error-500' : ''}`}
              placeholder="garage@example.com"
              required
            />
          </div>
          {getInputError('email') && (
            <p className="mt-1 text-sm text-error-500">{getInputError('email')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoStep; 