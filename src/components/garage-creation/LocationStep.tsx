import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationStepProps {
  formData: {
    city: string;
    district: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const LocationStep: React.FC<LocationStepProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // Mock data for cities and districts
  const cities = ['Istanbul', 'Ankara', 'Izmir'];
  const districts: Record<string, string[]> = {
    'Istanbul': ['Kadıköy', 'Beşiktaş', 'Ümraniye', 'Sarıyer', 'Şişli', 'Ataşehir', 'Beylikdüzü', 'Pendik'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak'],
    'Izmir': ['Konak', 'Bornova', 'Karşıyaka', 'Buca']
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Location Information</h2>
        <p className="text-secondary-600 mb-6">
          Please provide the location details of your garage.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-1">
            City
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-secondary-700 mb-1">
            District
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="input"
            required
            disabled={!formData.city}
          >
            <option value="">Select a district</option>
            {formData.city && districts[formData.city]?.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-1">
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-secondary-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input pl-10"
              placeholder="Enter full address"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStep; 