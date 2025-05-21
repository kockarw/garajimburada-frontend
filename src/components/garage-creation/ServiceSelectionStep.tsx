import React from 'react';
import { Wrench, Check } from 'lucide-react';

interface ServiceSelectionStepProps {
  formData: {
    services: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ formData, setFormData }) => {
  // Mock service options
  const serviceOptions = [
    'Tuning',
    'Maintenance',
    'Custom Modification',
    'Body Work',
    'Electrical Repairs',
    'Performance Tuning',
    'Custom Exhaust',
    'ECU Remapping',
    'Drift Setup',
    'Suspension Tuning',
    'Chassis Reinforcement',
    'Classic Restoration',
    'Antique Repair',
    'Vintage Parts',
    'EV Maintenance',
    'Battery Upgrades',
    'Electric Conversions',
    'Lift Kits',
    'Off-Road Accessories',
    'Trail Preparation',
    'German Cars',
    'Italian Exotics',
    'European Diagnostics',
    'JDM Parts',
    'Japanese Tuning',
    'Import Maintenance',
    'Turbo Installations',
    'Intercooler Upgrades',
    'Engine Builds',
    'Vehicle Wraps',
    'Paint Protection Film',
    'Custom Designs',
    'Ceramic Coating',
    'Paint Correction',
    'Interior Restoration',
    'Muscle Car Tuning',
    'Hot Rod Builds',
    'V8 Performance',
    'Track Setup',
    'Racing Brakes',
    'Rollcage Installation',
    'Audio Installation',
    'Custom Enclosures',
    'Sound Deadening',
    'Luxury Maintenance',
    'Performance Service',
    'Concierge Pickup',
    'Diesel Tuning',
    'Truck Performance',
    'Fuel System Upgrades',
    'Custom Wheels',
    'Performance Tires',
    'Suspension Upgrades',
    'Race Engines',
    'Competition Prep',
    'Data Acquisition',
    'Collision Repair',
    'Paint Matching',
    'Frame Straightening',
    'Custom Interiors',
    'Bespoke Modifications',
    'VIP Styling',
    'Oil Changes',
    'Brake Service',
    'Quick Repairs',
    'Hybrid Repair',
    'EV Service',
    'Eco-Friendly Maintenance',
    'Motorcycle Service',
    'Custom Bike Builds',
    'Performance Mods'
  ];

  const toggleService = (service: string) => {
    setFormData((prev: any) => {
      const services = prev.services;
      if (services.includes(service)) {
        return {
          ...prev,
          services: services.filter((s: string) => s !== service)
        };
      } else {
        return {
          ...prev,
          services: [...services, service]
        };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Service Selection</h2>
        <p className="text-secondary-600 mb-6">
          Select the services your garage offers. You can select multiple services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceOptions.map(service => (
          <button
            key={service}
            onClick={() => toggleService(service)}
            className={`p-4 rounded-lg border transition-colors flex items-center gap-3 ${
              formData.services.includes(service)
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-secondary-200 hover:border-primary-300 hover:bg-secondary-50'
            }`}
          >
            <div className={`p-2 rounded-full ${
              formData.services.includes(service)
                ? 'bg-primary-100'
                : 'bg-secondary-100'
            }`}>
              <Wrench size={16} className={
                formData.services.includes(service)
                  ? 'text-primary-600'
                  : 'text-secondary-600'
              } />
            </div>
            <span className="flex-1 text-left">{service}</span>
            {formData.services.includes(service) && (
              <Check size={16} className="text-primary-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelectionStep; 