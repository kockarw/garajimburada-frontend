// Available services for filter
export const serviceOptions = [
  'All Services', 
  'Tuning', 
  'Custom Modification', 
  'Maintenance', 
  'Body Work', 
  'Electrical Repairs', 
  'Performance Tuning', 
  'ECU Remapping', 
  'Custom Exhaust', 
  'Luxury Detailing'
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