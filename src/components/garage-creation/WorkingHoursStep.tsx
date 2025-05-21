import React from 'react';
import { Clock } from 'lucide-react';

interface WorkingHoursStepProps {
  formData: {
    workingHours: {
      [key: string]: {
        isOpen: boolean;
        openTime: string;
        closeTime: string;
      };
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const WorkingHoursStep: React.FC<WorkingHoursStepProps> = ({ formData, setFormData }) => {
  const handleDayToggle = (day: string) => {
    setFormData((prev: any) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          isOpen: !prev.workingHours[day].isOpen
        }
      }
    }));
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
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
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id={`day-${day}`}
                checked={formData.workingHours[day].isOpen}
                onChange={() => handleDayToggle(day)}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor={`day-${day}`}
                className="text-sm font-medium text-secondary-700"
              >
                {day}
              </label>
            </div>

            {formData.workingHours[day].isOpen && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-secondary-400" />
                  <input
                    type="time"
                    value={formData.workingHours[day].openTime}
                    onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                    className="border-secondary-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <span className="text-secondary-400">to</span>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-secondary-400" />
                  <input
                    type="time"
                    value={formData.workingHours[day].closeTime}
                    onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                    className="border-secondary-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingHoursStep; 