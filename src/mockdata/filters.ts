// Available services for filter
export const serviceOptions = [
  'All Services',
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

// Available cities for filter
export const cityOptions = ['All Cities', 'Istanbul', 'Ankara', 'Izmir'];

// Available districts by city for filter
export const districtOptions: Record<string, string[]> = {
  'All Cities': ['All Districts'],
  'Istanbul': ['All Districts', 'Kadıköy', 'Beşiktaş', 'Şişli', 'Ataşehir'],
  'Ankara': ['All Districts', 'Çankaya', 'Keçiören', 'Mamak'],
  'Izmir': ['All Districts', 'Konak', 'Karşıyaka', 'Bornova']
};

// Sorting options
export const sortOptions = [
  { value: 'rating', label: 'Rating (High to Low)' },
  { value: 'reviews', label: 'Number of Reviews' },
  { value: 'name', label: 'Name (A-Z)' }
]; 