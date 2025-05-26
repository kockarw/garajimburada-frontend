import React from 'react';
import { GarageFormData } from '../../types/garage';

interface WorkingHoursStepProps {
  formData: GarageFormData;
  setFormData: React.Dispatch<React.SetStateAction<GarageFormData>>;
}

const WorkingHoursStep: React.FC<WorkingHoursStepProps> = ({ formData, setFormData }) => {
  const days = [
    { full: 'Monday', short: 'Mon' },
    { full: 'Tuesday', short: 'Tue' },
    { full: 'Wednesday', short: 'Wed' },
    { full: 'Thursday', short: 'Thu' },
    { full: 'Friday', short: 'Fri' },
    { full: 'Saturday', short: 'Sat' },
    { full: 'Sunday', short: 'Sun' }
  ];

  const handleTimeChange = (day: string, type: 'openTime' | 'closeTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [type]: value
        }
      }
    }));
  };

  const handleIsOpenChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          isOpen: !prev.workingHours[day as keyof typeof prev.workingHours].isOpen
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Working Hours</h2>
        <p className="text-secondary-600 mb-6">
          Set your garage's working hours for each day of the week.
        </p>
      </div>

      <div className="space-y-4">
        {days.map(day => (
          <div key={day.full} className="flex items-center gap-3 md:gap-4">
            <div className="w-20 md:w-28">
              <span className="hidden md:inline">{day.full}</span>
              <span className="md:hidden">{day.short}</span>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.workingHours[day.full as keyof typeof formData.workingHours].isOpen}
                onChange={() => handleIsOpenChange(day.full)}
              />
              <div className="w-9 h-5 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
            </label>

            {formData.workingHours[day.full as keyof typeof formData.workingHours].isOpen && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  className="input py-1.5 px-2 w-24 md:w-32 text-sm"
                  value={formData.workingHours[day.full as keyof typeof formData.workingHours].openTime}
                  onChange={(e) => handleTimeChange(day.full, 'openTime', e.target.value)}
                />
                <span className="text-secondary-500">-</span>
                <input
                  type="time"
                  className="input py-1.5 px-2 w-24 md:w-32 text-sm"
                  value={formData.workingHours[day.full as keyof typeof formData.workingHours].closeTime}
                  onChange={(e) => handleTimeChange(day.full, 'closeTime', e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingHoursStep; 